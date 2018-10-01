import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

const SongsList = styled.ul`
  list-style-type: none;
  border: 1px solid lightgrey;
  width: 400px;
`

const SongItem = styled.li`
  border-bottom: 1px solid lightgrey;

  display: flex;
  align-items: center;
`

const SongTitle = styled.h3`
  margin-left: 8px;
`

const SongLink = styled.a`
  text-decoration: none;
  padding: 8px;
`

const PlayBtn = styled.a`
  padding: 8px;
  cursor: pointer;
`

const CaseContainer = styled.div`
  padding: 8px;
  border: 1px solid lightgrey;
  width: 424px;
`

export default class SongsPage extends React.Component {
  playAudio = (song) => {
    window.dispatchEvent(new CustomEvent('play-audio', {detail: song}))
  }

  songClick1 = (e) => {
    // will stop event propagate to window, so turbolinks can't handle this link
    e.stopPropagation()
  }

  songClick2 = (e) => {
    // not necessary, because turbolinks won't handle the event which has prevented default
    e.stopPropagation()

    // necessary
    e.preventDefault()
    window.Turbolinks.visit(e.target.getAttribute('href') + '?click')
  }

  render() {
    const { songs } = this.props
    const firstSong = songs[0]
    return (
      <React.Fragment>
        <SongsList>
          {
            songs.map(song =>
              <SongItem key={song.id}>
                <img src={song.cover_url} width={48} height={48}/>
                <SongTitle>{song.title}</SongTitle>
                <SongLink href={`/songs/${song.id}`}>detail</SongLink>
                <span>&nbsp;|&nbsp;</span>
                <PlayBtn onClick={()=>this.playAudio(song)}>play</PlayBtn>
              </SongItem>
            )
          }
        </SongsList>
        <CaseContainer>
          <span>special case 1 - event.stopPropagation()</span><br/><br/>
          <span>this link execute event.stopPropagation() :</span>
          <SongLink href={`/songs/${firstSong.id}`}
                    onClick={this.songClick1}>
            {firstSong.title}
          </SongLink>
          <br/><br/>
          <span>resolution :</span>
          <SongLink href={`/songs/${firstSong.id}`}
                    onClick={this.songClick2}>
            {firstSong.title}
          </SongLink>
          <code>window.Turbolinks.visit(e.target.getAttribute('href') + '?click')</code>
        </CaseContainer>
      </React.Fragment>
    )
  }
}

SongsPage.propTypes = {
  songs: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string,
    cover_url: PropTypes.string,
    audio_url: PropTypes.string
  }))
}
