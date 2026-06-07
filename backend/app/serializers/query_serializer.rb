class QuerySerializer
  def initialize(query)
    @query = query
  end

  def as_json
    {
      id: @query.id,
      question: @query.question,
      document_id: @query.document_id,
      user_id: @query.user_id,
      created_at: @query.created_at&.iso8601
    }
  end
end
