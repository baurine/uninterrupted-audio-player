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

export default class AudioPlayer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      curAudio: null,

      progress: null,
      duration: null,
      playing: false
    }
  }

  progressStatus = () => {
    const { progress, duration } = this.state
    return `${progress > 0 ? progress : '--'}/${duration > 0 ? duration : '--'}`
  }

  render() {
    const { curAudio, progress, playing } = this.state

    return (
      <Container>
        <img src={curAudio && curAudio.cover_url}
             width={64}
             height={64}/>
        <AudioTitle>{curAudio ? curAudio.title : '???'}</AudioTitle>
        <span>{this.progressStatus()}</span>
        {
          progress > 0 &&
          <span>{playing ? 'pause' : 'play'}</span>
        }
      </Container>
    )
  }
}
