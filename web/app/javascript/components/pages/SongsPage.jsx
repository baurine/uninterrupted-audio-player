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
      queryStr: '',
      authenToken: ''
    }
  }

  componentDidMount() {
    const authenToken = 
      document.querySelector('meta[name="csrf-token"]').getAttribute('content')
    this.setState({authenToken})
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
          <br/>
          <code>window.Turbolinks.visit(e.target.getAttribute('href') + '?click')</code>

          <p>-----------------------------</p>
          <p>Speical Case 2 - Get Form</p>

          <span>Origin Get Form :</span>
          <form action='/songs'>
            <input type='text' name='q' placeholder='song title'></input>
            <input type='submit' value='search'></input>
          </form>

          <br/>

          <span>Resolution 1 : use window.Turoblinks.visit API</span>
          <form action='/songs' onSubmit={this.submitQuery}>
            <input type='text'
                   name='q'
                   placeholder='song title'
                   value={this.state.queryStr}
                   onChange={e=>this.setState({queryStr:e.target.value})}></input>
            <input type='submit' value='search'></input>
          </form>

          <br/>

          <span>Resolution 2 : convert form to link</span>
          <div>
            <input type='text'
                   placeholder='song title'
                   value={this.state.queryStr}
                   onChange={e=>this.setState({queryStr:e.target.value})}></input>
            <a href={this.queryUrl()}>search</a>
          </div>

          <p>-----------------------------</p>
          <p>Speical Case 3 - Post Form</p>

          <span>Origin Post Form :</span>
          <form action={`/songs/${firstSong.id}`} method='post'>
            {/* https://stackoverflow.com/questions/8054165/using-put-method-in-html-form */}
            <input type="hidden" name="_method" value="put"></input>
            <input type="hidden"
                   name="authenticity_token"
                   value={this.state.authenToken}/>
            <input type='text'
                   name='title'
                   placeholder='new song title'
                   defaultValue={firstSong.title}>
            </input>
            <input type='submit' value='update'></input>
          </form>

          <br/>

          <span>Resolution: data-remote Form</span>
          <form action={`/songs/${firstSong.id}`} data-remote={true} method='post'>
            <input type="hidden" name="_method" value="put"></input>
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
