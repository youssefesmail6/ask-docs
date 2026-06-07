class Query < ApplicationRecord
  belongs_to :document
  belongs_to :user

  validates :question, presence: true

  def as_api_json
    QuerySerializer.new(self).as_json
  end
end
