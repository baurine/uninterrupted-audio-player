class CreateSongs < ActiveRecord::Migration[5.2]
  def change
    create_table :songs do |t|
      t.string :title
      t.string :cover_url
      t.string :audio_url

      t.timestamps
    end
  end
end
