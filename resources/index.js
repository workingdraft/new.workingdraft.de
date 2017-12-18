import Player from './Player'

const elements = document.querySelectorAll('[data-audio]')

Array.from(elements).map((element) => new Player(element))
