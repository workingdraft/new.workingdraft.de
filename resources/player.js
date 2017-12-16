import PubSub from 'vanilla-pubsub'

import Progress from './Progress'

class Player {
  constructor(element) {
    this.element = element
    this.audio = null
    this.duration = 0

    this.togglePlay = this.togglePlay.bind(this)
    this.toggleVolume = this.toggleVolume.bind(this)
    this.handleProgress = this.handleProgress.bind(this)
    this.updateProgress = this.updateProgress.bind(this)

    this.setAudio(element)

    this.progress = new Progress(
      element.querySelector('[data-audio-progress]')
    )

    PubSub.subscribe('progress.update', this.updateProgress)

    const playElement = element.querySelector('[data-audio-play]')
    playElement.addEventListener('click', this.togglePlay)

    this.time = {
      stringElement: element.querySelector('[data-audio-time]')
    }

    const volumeElement = element.querySelector('[data-audio-volume]')
    volumeElement.addEventListener('click', this.toggleVolume)
  }

  setAudio(element) {
    this.audio = element.querySelector('[data-audio-player]')
    this.duration = this.audio.duration

    this.audio.addEventListener('timeupdate', this.handleProgress)
  }

  updateProgress(percentage) {
    this.setTime(percentage)
  }

  handleProgress(event) {
    const currentTime = Math.floor(this.audio.currentTime)

    this.setTimeString(currentTime)

    this.progress.update(currentTime / this.duration)
  }

  togglePlay() {
    this.element.classList.toggle(`is-playing`)

    if (this.audio.paused) {
      this.audio.play()
    } else {
      this.audio.pause()
    }
  }

  toggleVolume() {
    this.element.classList.toggle(`is-muted`)

    if (this.audio.volume > 0) {
      this.oldVolume = this.audio.volume
      this.audio.volume = 0
    } else {
      this.audio.volume = this.oldVolume
    }
  }

  setVolume(volume) {
    this.audio.volume = volume / 100
  }

  setTime(timePercent) {
    const time = this.audio.duration * (timePercent / 100)

    this.audio.currentTime = parseFloat(time, 10).toFixed(2)
  }

  getTimeFromSeconds(seconds) {
    const time = []
    seconds = parseInt(seconds, 10);
    time[0] = `0${Math.floor(seconds / 3600)}`
    time[1] = `0${Math.floor((seconds - (time[0] * 3600)) / 60)}`
    time[2] = `0${seconds - (time[0] * 3600) - (time[1] * 60)}`

    return time.map(t => t.substr(-2)).join(':')
  }

  setTimeString(time) {
    this.time.stringElement.innerText = this.getTimeFromSeconds(time)
  }
}

export default Player
