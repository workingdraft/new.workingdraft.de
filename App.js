const express = require('express')
const exphbs = require('express-handlebars')

class App {
  constructor() {
    this.express = express()

    const hbs = exphbs.create({
      defaultLayout: 'main'
    })

    // Register `hbs.engine` with the Express app.
    this.express.engine('handlebars', hbs.engine)
    this.express.set('view engine', 'handlebars')

    this.mountRoutes()
  }

  mountRoutes() {
    const router = express.Router()

    router.get('/', (req, res) => res.render('index'))

    router.get(
      '/*',
      (req, res) => {
        const file = req.params[0]

        res.sendFile(file, {
          root: './dist/'
        })
      }
    )

    this.express.use('/', router)
  }
}

module.exports = new App().express
