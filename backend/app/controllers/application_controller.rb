class ApplicationController < ActionController::API
  rescue_from ActiveRecord::RecordNotFound, with: :render_not_found
  rescue_from ActiveRecord::RecordInvalid, with: :render_unprocessable_entity
  rescue_from ActionController::ParameterMissing, with: :render_unprocessable_entity

  private

  def render_not_found(error)
    render json: { error: error.message }, status: :not_found
  end

  def render_unprocessable_entity(error)
    message = error.respond_to?(:record) ? error.record.errors.full_messages : [error.message]
    render json: { errors: Array(message) }, status: :unprocessable_entity
  end
end
