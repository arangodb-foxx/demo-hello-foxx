var FoxxApplication = require("org/arangodb/foxx").Application;
var app = new FoxxApplication();

app.requires = {
  "arangodb": "org/arangodb",
  "actions": "org/arangodb/actions"
};

// .............................................................................
// a simple text output
// .............................................................................

app.get('/hallo-world.txt', function(req, res) {
  res.set("Content-Type", "text/plain; charset=utf-8");
  res.body = require("a").text + "\n";
  res.statusCode = actions.HTTP_OK;
});

// .............................................................................
// echo the response object
// .............................................................................

app.get('/echo.json', function(req, res, next, options) {
  var result = { request : req, options : options };

  res.responseCode = actions.HTTP_OK;
  res.contentType = "application/json; charset=utf-8";
  res.body = JSON.stringify(result);
});

// .............................................................................
// convert the response object to text
// .............................................................................

app.get('/echo.txt', function(req, res, next, options) {
  var result = { request : req, options : options };

  res.responseCode = actions.HTTP_OK;
  res.contentType = "text/plain; charset=utf-8";
  res.body = arangodb.inspect(result);
});

// .............................................................................
// GO, Foxx, GO
// .............................................................................

app.start(applicationContext);
