square = (x) -> x * x

Foxx = require "org/arangodb/foxx"
controller = new Foxx.Controller(applicationContext)

controller.get "/hello", (req, res) ->
   res.set "Content-Type", "text/plain"
   res.body = "Hello from CoffeeScript"

controller.get "/square/:number", (req, res) ->
   res.set "Content-Type", "text/plain"
   res.body = square req.params "number"
