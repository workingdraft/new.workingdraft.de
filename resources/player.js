class Player {

  constructor(element) {
    this.playing = false
    this.sources = null
    this.audio = null
    this.source = null
    this.type = null

    element.addEventListener('play', this.handlePlay)
    element.addEventListener('pause', this.handlePause)
    element.addEventListener('ended', this.handlePause)

    this.setAudio(element)
    this.setType()
    this.setSources()
    this.findSource()
  }

  setAudio(element) {
    const forAttribute = element.getAttribute('for');
    const sourceElement = document.querySelector(forAttribute);

    this.audio = sourceElement
  }

  setType () {
    this.type = this.audio.canPlayType('audio/mpeg') ? 'mp3' :
      this.audio.canPlayType('audio/ogg') ? 'ogg' : ''
  }

  setSources () {
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

  findSource() {
    this.source = this.sources.filter((source) => {
      source = source.split('.')

      return source[source.length - 1] === this.type
    })[0]
  }
}

export default Player
