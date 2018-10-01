import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
  padding: 8px;
  border: 1px solid lightgrey;
  border-radius: 8px;
  width: 400px;
  margin-top: 10px;

  display: flex;
  align-items: center;
`

const AudioTitle = styled.span`
  padding: 8px;
`

const PlayBtn = styled.a`
  padding: 8px;
  cursor: pointer;
`

export default class AudioPlayer extends React.Component {
  constructor(props) {
    super(props)
    this.intervalId = null
    this.state = {
      curAudio: null,

      progress: 0,
      duration: 0,
      playing: false,
      loading: false,
    }
  }

  convertSeconds = (seconds) => {
    if (seconds <= 0) return '--'

    let mins = Math.floor(seconds / 60)
    let secs = seconds % 60
    if (mins < 10) {
      mins = `0${mins}`
    }
    if (secs < 10) {
      secs = `0${secs}`
    }
    return `${mins}:${secs}`
  }

  progressStatus = () => {
    const { progress, duration } = this.state
    return `${this.convertSeconds(progress)}/${this.convertSeconds(duration)}`
  }

  //////////////////////////////////////////////////////////////

  onCanPlay = () => {
    console.log('can play')
    // get duration
    const duration = Math.ceil(this.audioElement.duration)
    this.setState({duration, loading: false})
  }

  onPlay = () => {
    console.log('on play')
    this.setState({ playing: true})
    this._setInterval()
  }

  onPause = () => {
    console.log('on pause')
    this.setState({ playing: false })
    this._clearInterval()
  }

  _setInterval() {
    if (this.intervalId === null) {
      this.intervalId = setInterval(() => {
        const progress = Math.ceil(this.audioElement.currentTime)
        this.setState({ progress })
      }, 1000)
    }
  }

  _clearInterval() {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId)
      this.intervalId = null
    }
  }

  //////////////////////////////////////////////////////////////

  playAudioEventHandler = (event) => {
    const audio = event.detail
    console.log('audio', audio)
    if (!audio || !audio.audio_url) {
      console.log('the audio has no url')
      return
    }
    this.playNewAudio(audio)
  }

  playNewAudio = (audio) => {
    this.audioElement.pause()
    this.setState({
      curAudio: audio,
      playing: false,
      duration: 0,
      progress: 0,
      loading: true,
    }, () => this.loadSrc())
  }

  loadSrc = () => {
    const { curAudio } = this.state
    if (curAudio && curAudio.audio_url) {
      this.audioElement.src = curAudio.audio_url
      this.audioElement.load()
      this.audioElement.play().catch(err => {
        console.log(err)
        this.setState({loading: false})
      })
    }
  }

  //////////////////////////////////////////////////////////////

  componentDidMount() {
    if (!window._globalAudioEl) {
      window._globalAudioEl = document.createElement('audio')
    }
    this.audioElement =  window._globalAudioEl

    this.audioElement.addEventListener('canplay', this.onCanPlay)
    this.audioElement.addEventListener('play', this.onPlay)
    this.audioElement.addEventListener('pause', this.onPause)

    window.addEventListener('play-audio', this.playAudioEventHandler)

    // recover state
    if (window._globalAudioState) {
      this.setState(window._globalAudioState, () => {
        this.state.playing && this._setInterval()
      })
    }
    // more: recover from localStorage
  }

  componentWillUnmount() {
    // save current state to window before it is unmounted
    window._globalAudioState = this.state
    // more: store to localStorage

    window.removeEventListener('play-audio', this.playAudioEventHandler)

    this._clearInterval()

    this.audioElement.removeEventListener('canplay', this.onCanPlay)
    this.audioElement.removeEventListener('play', this.onPlay)
    this.audioElement.removeEventListener('pause', this.onPause)

    // don't pause it
    // this.audioElement.pause()
    this.audioElement = null
  }

  //////////////////////////////////////////////////////////////

  clickPlay = () => {
    const { playing } = this.state
    if (playing) {
      this.audioElement.pause()
    } else {
      this.audioElement.play()
    }
  }

  render() {
    const { curAudio, progress, playing, loading } = this.state

    return (
      <Container>
        <img src={curAudio && curAudio.cover_url}
             width={64}
             height={64}/>
        <AudioTitle>{curAudio ? curAudio.title : '???'}</AudioTitle>
        <span>{this.progressStatus()}</span>
        {
          progress > 0 &&
          <PlayBtn onClick={this.clickPlay}>{playing ? 'pause' : 'play'}</PlayBtn>
        }
        {
          loading &&
          <span>Loading...</span>
        }
      </Container>
    )
  }
}
