import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

const Container = styled.div`
  display: flex;

  align-items: flex-start;
`

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
  margin: 16px;
  padding: 8px;
  border: 1px solid lightgrey;
  width: 424px;
`

export default class SongsPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      queryStr: ''
    }
  }

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

  queryUrl = () => {
    return `/songs?q=${this.state.queryStr}`
  }

  submitQuery = (e) => {
    e.preventDefault()
    window.Turbolinks.visit(this.queryUrl())
  }

  render() {
    const { songs } = this.props
    const firstSong = songs[0]
    return (
      <Container>
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
          <span>Special Case 1 - event.stopPropagation()</span><br/><br/>
          <span>This link execute event.stopPropagation() :</span>
          <SongLink href={`/songs/${firstSong.id}`}
                    onClick={this.songClick1}>
            {firstSong.title}
          </SongLink>
          <br/><br/>
          <span>Resolution :</span>
          <SongLink href={`/songs/${firstSong.id}`}
                    onClick={this.songClick2}>
            {firstSong.title}
          </SongLink>
          <code>window.Turbolinks.visit(e.target.getAttribute('href') + '?click')</code>

          <p>-----------------------------</p>
          <span>Speical Case 2 - Get Form</span><br/><br/>
          <span>Origin Get Form :</span>
          <form action='/songs'>
            <input type='text' name='q' placeholder='song title'></input>
            <input type='submit' value='search'></input>
          </form>

          <span>Resolution 1 :</span>
          <form action='/songs' onSubmit={this.submitQuery}>
            <input type='text'
                   name='q'
                   placeholder='song title'
                   value={this.state.queryStr}
                   onChange={e=>this.setState({queryStr:e.target.value})}></input>
            <input type='submit' value='search'></input>
          </form>

          <span>Resolution 2 :</span>
          <div>
            <input type='text'
                   placeholder='song title'
                   value={this.state.queryStr}
                   onChange={e=>this.setState({queryStr:e.target.value})}></input>
            <a href={this.queryUrl()}>search</a>
          </div>

          <p>-----------------------------</p>
          <span>Speical Case 3 - Post Form</span><br/><br/>
          <span>data-remote Form :</span>
          {/* the method must be 'post', can't be 'get' */}
          <form action='/songs/1' data-remote={true} method='post'>
            <input type='text'
                   name='title'
                   placeholder='new song title'
                   defaultValue={firstSong.title}>
            </input>
            <input type='submit' value='update'></input>
          </form>
        </CaseContainer>
      </Container>
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
