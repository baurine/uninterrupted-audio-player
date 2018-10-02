class SongsController < ApplicationController
  def index
    q = (params[:q] || '').strip
    if q.present?
      @songs = Song.where("title LIKE '%#{q}%'")
    else
      @songs = Song.all
    end
  end

  def show
    @song = Song.find params[:id]
  end

  def update
    @song = Song.find params[:id]
    @song.update(title: params[:title])
    redirect_to @song
  end

  # def query
  #   @song = Song.find_by(id: params[:song_id])
  #   if @song
  #     # must use redirect_to, can't user render 'show'
  #     # redirect_to will generate following response for xhr request
  #     # Turbolinks.clearCache()
  #     # Turbolinks.visit("http://localhost:3000/songs/2", {"action":"replace"})
  #     redirect_to @song
  #     # render 'show'
  #     return
  #   end
  #   redirect_to songs_path
  # end
end
