class DocumentSerializer
  def initialize(document)
    @document = document
  end

  def as_json
    {
      id: @document.id,
      title: @document.title,
      filename: @document.filename,
      uploaded_by: serialized_user,
      uploaded_by_id: @document.uploaded_by_id,
      upload_status: @document.upload_status,
      status: @document.upload_status,
      ai_document_id: @document.ai_document_id,
      ai_job_id: @document.ai_job_id,
      chunks_count: 0,
      created_at: @document.created_at&.iso8601,
      updated_at: @document.updated_at&.iso8601
    }
  end

  private

  def serialized_user
    return nil unless @document.uploaded_by

    UserSerializer.new(@document.uploaded_by).as_json
  end
end
