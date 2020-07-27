Rails.application.routes.draw do
  resources :teams, only: [:create, :update, :show]
  resources :units, only: [:create, :delete]
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end
