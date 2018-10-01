class Song < ApplicationRecord
  validates :title, :cover_url, :audio_url, presence: true
end
