require "securerandom"

class Document < ApplicationRecord
  STATUSES = %w[pending processing ready failed].freeze

  belongs_to :uploaded_by, class_name: "User", inverse_of: :uploaded_documents
  has_many :queries, dependent: :destroy

  validates :title, presence: true
  validates :filename, presence: true
  validates :uploaded_by, presence: true
  validates :upload_status, inclusion: { in: STATUSES }
  validates :ai_document_id, presence: true, uniqueness: true

  before_validation :assign_ai_document_id

  def as_api_json
    DocumentSerializer.new(self).as_json
  end

  private

  def assign_ai_document_id
    self.ai_document_id ||= SecureRandom.uuid
  end
end
