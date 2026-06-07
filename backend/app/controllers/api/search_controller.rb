module Api
  class SearchController < ApplicationController
    def create
      query = params[:query].to_s.strip

      if query.blank?
        render json: { error: "Search query is required" }, status: :unprocessable_entity
        return
      end

      result = RagService.new.query(document: selected_document, question: query)

      render json: {
        results: result["sources"] || [],
        answer_preview: result["answer"],
        confidence: result["confidence"]
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
  end
end
