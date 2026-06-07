class User < ApplicationRecord
  ROLES = %w[admin employee].freeze

  has_many :uploaded_documents,
    class_name: "Document",
    foreign_key: :uploaded_by_id,
    dependent: :destroy,
    inverse_of: :uploaded_by
  has_many :queries, dependent: :destroy

  validates :name, presence: true
  validates :email, presence: true, uniqueness: true
  validates :role, inclusion: { in: ROLES }

  before_validation :normalize_email

  def admin?
    role == "admin"
  end

  def employee?
    role == "employee"
  end

  def as_api_json
    UserSerializer.new(self).as_json
  end

  private

  def normalize_email
    self.email = email.to_s.strip.downcase
  end
end
