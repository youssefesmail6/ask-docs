module Api
  class UsersController < ApplicationController
    def index
      users = User.order(:role, :id)
      render json: { users: users.map { |user| UserSerializer.new(user).as_json } }
    end

    def show_by_role
      user = User.find_by!(role: params[:role].to_s)
      render json: { user: UserSerializer.new(user).as_json }
    end
  end
end
