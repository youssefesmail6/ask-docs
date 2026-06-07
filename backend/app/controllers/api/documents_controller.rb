module Api
  class DocumentsController < ApplicationController
    def index
      documents = Document.includes(:uploaded_by).order(created_at: :desc)
      render json: { documents: documents.map { |document| DocumentSerializer.new(document).as_json } }
    end

    def show
      render json: { document: DocumentSerializer.new(document).as_json }
    end

    def create
      if document_attributes[:content].blank?
        render json: { error: "Document content is required" }, status: :unprocessable_entity
        return
      end

      document = Document.create!(
        title: document_attributes[:title],
        filename: document_filename,
        uploaded_by: uploader,
        upload_status: "processing"
      )

      response = RagService.new.upload_document(
        document: document,
        content: document_attributes[:content]
      )

      document.update!(
        ai_job_id: response["job_id"],
        upload_status: response["status"].presence || "processing"
      )

      render json: { document: DocumentSerializer.new(document).as_json }, status: :created
    rescue RagService::Error => error
      document&.update(upload_status: "failed")
      render json: { error: error.message }, status: :bad_gateway
    end

    def destroy
      RagService.new.delete_document(document: document)
      document.destroy!
      head :no_content
    rescue RagService::Error => error
      render json: { error: error.message }, status: :bad_gateway
    end

    def sync_status
      if document.ai_job_id.blank?
        render json: { document: DocumentSerializer.new(document).as_json }
        return
      end

      response = RagService.new.job_status(document.ai_job_id)
      document.update!(upload_status: response["status"]) if response["status"].present?

      render json: {
        document: DocumentSerializer.new(document).as_json,
        job: response
      }
    rescue RagService::Error => error
      render json: { error: error.message }, status: :bad_gateway
    end

    private

    def document
      @document ||= Document.find(params[:id])
    end

    def document_attributes
      @document_attributes ||= params.require(:document).permit(
        :title,
        :filename,
        :content,
        :uploaded_by_id
      )
    end

    def document_filename
      document_attributes[:filename].presence ||
        "#{document_attributes[:title].to_s.parameterize.presence || 'document'}.txt"
    end

    def uploader
      @uploader ||= if document_attributes[:uploaded_by_id].present?
        User.find(document_attributes[:uploaded_by_id])
      else
        User.find_by!(role: "admin")
      end
    end
  end
end
