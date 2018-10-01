Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  resources :songs, only: %i[index show]
  get  'songs_query', to: 'songs#query'
  post 'songs_query', to: 'songs#query'
  root 'songs#index'
end
