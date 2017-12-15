class Player {

  constructor(element) {
    this.playing = false
    this.sources = null
    this.audio = null
    this.source = null
    this.type = null


    this.handleMousedown = this.handleMousedown.bind(this)
    this.handleMousemove = this.handleMousemove.bind(this)
    this.handleMouseup = this.handleMouseup.bind(this)
    this.handlePlay = this.handlePlay.bind(this)
    this.handlePause = this.handlePause.bind(this)


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

    element.addEventListener('play', this.handlePlay)
    element.addEventListener('pause', this.handlePause)
    element.addEventListener('ended', this.handlePause)

    this.setAudio(element)
    this.setType()
    this.setSources()
    this.findSource()
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
    const forAttribute = element.getAttribute('for');
    const sourceElement = document.querySelector(forAttribute);

    this.audio = sourceElement
  }

  setType() {
    this.type = this.audio.canPlayType('audio/mpeg') ? 'mp3' :
      this.audio.canPlayType('audio/ogg') ? 'ogg' : ''
  }

  setSources() {
    const sourceElements = this.audio.querySelectorAll('[src]')
    const sources = Array.from(sourceElements).map((element) => element.getAttribute('src'))

    this.sources = sources
  }

  handlePlay() {
    this.playing = true
  }

  handlePause() {
    this.playing = false
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

  setVolume(volume) {
    this.audio.volume = volume / 100
  }

  setTime(timePercent) {
    timePercent = this.audio.duration * (timePercent / 100)

    this.audio.currentTime = parseFloat(timePercent, 10).toFixed(2)
  }

  setWidth(element, width) {
    element.style.width = `${width}%`
  }

  findSource() {
    this.source = this.sources.filter((source) => {
      source = source.split('.')

      return source[source.length - 1] === this.type
    })[0]
  }
}

export default Player
