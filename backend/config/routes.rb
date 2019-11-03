Rails.application.routes.draw do
  resources :matches
  resources :users
  resources :game_configurations
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
