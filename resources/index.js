import Player from './player'

const elements = document.querySelectorAll('[data-audio]')

Array.from(elements).map((element) => new Player(element))
