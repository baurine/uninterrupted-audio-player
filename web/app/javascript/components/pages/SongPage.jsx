import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

const SongItem = styled.div`
  padding: 8px;
  border: 1px solid lightgrey;
  border-radius: 8px;
  width: 200px;
`

const SongTitle = styled.h3`
`

const BtnContainer = styled.div`
  display: flex;
`

const SongsLink = styled.a`
  text-decoration: none;
  padding: 8px;
`

const PlayBtn = styled.a`
  padding: 8px;
  cursor: pointer;
`

export default class SongPage extends React.Component {
  playAudio = (song) => {
    window.dispatchEvent(new CustomEvent('play-audio', {detail: song}))
  }

  render() {
    const { song } = this.props
    return (
      <SongItem>
        <img src={song.cover_url} width={128} height={128}/>
        <SongTitle>{song.title}</SongTitle>
        <BtnContainer>
          <SongsLink href='/songs'>back to list</SongsLink>
          <PlayBtn onClick={()=>this.playAudio(song)}>play</PlayBtn>
        </BtnContainer>
      </SongItem>
    )
  }
}

SongPage.propTypes = {
  song: PropTypes.shape({
    title: PropTypes.string,
    cover_url: PropTypes.string,
    audio_url: PropTypes.string
  })
}
