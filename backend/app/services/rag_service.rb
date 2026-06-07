require "json"
require "net/http"
require "uri"
require "timeout"

class RagService
  class Error < StandardError
    attr_reader :status

    def initialize(message, status: nil)
      super(message)
      @status = status
    end
  end

  DEFAULT_BASE_URL = "http://localhost:8000"

  def initialize(base_url: ENV.fetch("AI_SERVICE_URL", DEFAULT_BASE_URL))
    @base_url = base_url.to_s.chomp("/")
  end

  def upload_document(document:, content:)
    post_form(
      "/api/v1/documents",
      {
        "document_id" => document.ai_document_id,
        "title" => document.title,
        "filename" => document.filename,
        "content" => content.to_s
      }
    )
  end

  def job_status(job_id)
    get_json("/api/v1/jobs/#{job_id}")
  end

  def query(question:, document: nil)
    body = { question: question.to_s }
    body[:document_id] = document.ai_document_id if document

    post_json("/api/v1/query", body)
  end

  def delete_document(document:)
    return {} if document.ai_document_id.blank?

    delete_json("/api/v1/documents/#{document.ai_document_id}")
  end

  private

  def get_json(path)
    request = Net::HTTP::Get.new(uri_for(path))
    perform(request)
  end

  def post_json(path, body)
    request = Net::HTTP::Post.new(uri_for(path))
    request["Content-Type"] = "application/json"
    request.body = JSON.generate(body)
    perform(request)
  end

  def post_form(path, form)
    request = Net::HTTP::Post.new(uri_for(path))
    request.set_form(form.compact, "multipart/form-data")
    perform(request)
  end

  def delete_json(path)
    request = Net::HTTP::Delete.new(uri_for(path))
    perform(request)
  end

  def perform(request)
    response = http_for(request.uri).request(request)
    parsed_body = parse_body(response.body)

    return parsed_body if response.is_a?(Net::HTTPSuccess)

    message = parsed_body["error"] || parsed_body["detail"] || "AI service request failed"
    raise Error.new(message, status: response.code.to_i)
  rescue Errno::ECONNREFUSED, SocketError, Net::OpenTimeout, Net::ReadTimeout, Timeout::Error => error
    raise Error.new("AI service is unavailable: #{error.message}", status: :service_unavailable)
  end

  def parse_body(body)
    return {} if body.blank?

    JSON.parse(body)
  rescue JSON::ParserError
    {}
  end

  def http_for(uri)
    Net::HTTP.new(uri.host, uri.port).tap do |http|
      http.use_ssl = uri.scheme == "https"
      http.open_timeout = 5
      http.read_timeout = 60
    end
  end

  def uri_for(path)
    URI("#{@base_url}#{path}")
  end
end
