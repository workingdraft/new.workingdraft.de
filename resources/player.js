class Player {

  constructor(element) {
    this.element = element
    this.audio = null
    this.duration = 0

    this.handleMousedown = this.handleMousedown.bind(this)
    this.handleMousemove = this.handleMousemove.bind(this)
    this.handleMouseup = this.handleMouseup.bind(this)
    this.togglePlay = this.togglePlay.bind(this)
    this.toggleVolume = this.toggleVolume.bind(this)
    this.handleProgress = this.handleProgress.bind(this)

    this.setAudio(element)

    const progressElement = element.querySelector('[data-audio-progress]')
    const elementRect = progressElement.getBoundingClientRect(element)

    this.progress = {
      element: progressElement,
      inner: element.querySelector('[data-audio-progress-inner]'),
      preloader: element.querySelector('[data-audio-progress-preloader]'),
      button: element.querySelector('[data-audio-progress-button]'),
      width: elementRect.width,
      offset: elementRect.left,
    }

    this.progress.button.addEventListener('mousedown', this.handleMousedown)

    const playElement = element.querySelector('[data-audio-play]')
    playElement.addEventListener('click', this.togglePlay)

    this.time = {
      stringElement: element.querySelector('[data-audio-time]')
    }

    const volumeElement = element.querySelector('[data-audio-volume]')
    volumeElement.addEventListener('click', this.toggleVolume)
  }

  handleMousedown() {
    document.addEventListener('mousemove', this.handleMousemove)
    document.addEventListener('mouseup', this.handleMouseup)
  }

  handleMousemove(event) {
    const left = event.clientX - this.progress.offset
    const percentage = this.getPercentage(left / this.progress.width * 100)

    this.setWidth(this.progress.inner, percentage)
    this.setTime(percentage)
  }

  handleMouseup() {
    document.removeEventListener('mousemove', this.handleMousemove)
    document.removeEventListener('mouseup', this.handleMouseup)
  }

  setAudio(element) {
    this.audio = element.querySelector('[data-audio-player]')
    this.duration = this.audio.duration

    this.audio.addEventListener('timeupdate', this.handleProgress)
  }

  handleProgress(event) {
    const currentTime = Math.floor(this.audio.currentTime)
    const percentage = this.getPercentage(currentTime / this.duration)

    this.setTimeString(currentTime)
    this.setWidth(this.progress.inner, percentage)
  }

  togglePlay() {
    this.element.classList.toggle(`is-playing`)

    if (this.audio.paused) {
      this.audio.play()
    } else {
      this.audio.pause()
    }
  }

  getPercentage(percentage) {
    if (percentage > 100) {
      return 100
    }

    if (percentage < 0) {
      return 0
    }

    return percentage
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

  setWidth(element, width) {
    element.style.width = `${width}%`
  }
}

export default Player
