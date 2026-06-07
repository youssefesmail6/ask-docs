Rails.application.routes.draw do
  namespace :api do
    resources :users, only: [:index]
    get "users/role/:role", to: "users#show_by_role"

    resources :documents, only: [:index, :show, :create, :destroy] do
      post :sync_status, on: :member
    end

    resources :queries, only: [:index, :show]

    post "ask", to: "ask#create"
    post "search", to: "search#create"
  end

  get "up" => "rails/health#show", as: :rails_health_check
end
