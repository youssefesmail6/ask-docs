module Api
  class AskController < ApplicationController
    def create
      question = params[:question].to_s.strip

      if question.blank?
        render json: { error: "Question is required" }, status: :unprocessable_entity
        return
      end

      result = RagService.new.query(document: selected_document, question: question)
      document_for_log = selected_document || document_from_sources(result["sources"])
      query = Query.create!(
        question: question,
        document: document_for_log,
        user: selected_user
      )

      render json: {
        answer: result["answer"],
        sources: result["sources"] || [],
        confidence: result["confidence"],
        query: QuerySerializer.new(query).as_json
      }
    rescue RagService::Error => error
      render json: { error: error.message }, status: :bad_gateway
    end

    private

    def selected_document
      @selected_document ||= if params[:document_id].present?
        Document.find(params[:document_id])
      end
    end

    def document_from_sources(sources)
      ai_document_id = Array(sources).first&.dig("document_id")
      Document.find_by(ai_document_id: ai_document_id) ||
        Document.where(upload_status: "ready").order(created_at: :desc).first ||
        raise(ActiveRecord::RecordNotFound, "No document is available for questions")
    end

    def selected_user
      @selected_user ||= if params[:user_id].present?
        User.find(params[:user_id])
      else
        User.find_by!(role: "employee")
      end
    end
  end
end
