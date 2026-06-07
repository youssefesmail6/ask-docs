module Api
  class QueriesController < ApplicationController
    def index
      queries = Query.includes(:document, :user).order(created_at: :desc).limit(100)
      render json: { queries: queries.map { |query| QuerySerializer.new(query).as_json } }
    end

    def show
      render json: { query: QuerySerializer.new(Query.find(params[:id])).as_json }
    end
  end
end
