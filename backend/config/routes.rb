Rails.application.routes.draw do
  resources :matches do
    resources :messages, only: [:index, :create]
    patch 'join', on: :member
    patch 'play', on: :member
  end
  resources :users
  resources :game_configurations

  delete '/drop/all', to:'matches#dropAll'
  delete '/drop/matches', to:'matches#drop'
  delete '/drop/users', to:'users#drop'
  delete '/drop/game_configurations', to:'game_configurations#drop'
  delete '/drop/messages', to:'messages#drop'
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
