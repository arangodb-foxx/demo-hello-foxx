'use strict';

var FoxxApplication = require("org/arangodb/foxx").Application;
var app = new FoxxApplication(applicationContext);

var arangodb = require("org/arangodb");
var actions = require("org/arangodb/actions");
var halloworld = require("a").text;

var texts = app.createRepository("texts");

// .............................................................................
// a simple text output with static text
// .............................................................................

app.get('/hallo-world.txt', function(req, res) {
  res.set("Content-Type", "text/plain; charset=utf-8");
  res.body = "Hallo World (static)\n";
  res.statusCode = actions.HTTP_OK;
});

// .............................................................................
// a simple text output from global variable
// .............................................................................

app.get('/hallo-world-global.txt', function(req, res) {
  res.set("Content-Type", "text/plain; charset=utf-8");
  res.body = halloworld + " (global)\n";
  res.statusCode = actions.HTTP_OK;
});

// .............................................................................
// a simple text output from local require
// .............................................................................

app.get('/hallo-world-local.txt', function(req, res) {
  res.set("Content-Type", "text/plain; charset=utf-8");
  res.body = require("a").text + " (local)\n";
  res.statusCode = actions.HTTP_OK;
});

// .............................................................................
// a simple text output from repository
// .............................................................................

app.get('/hallo-world-repo.txt', function(req, res) {
  res.set("Content-Type", "text/plain; charset=utf-8");
  res.body = texts.collection.any().text + " (repo)\n";
  res.statusCode = actions.HTTP_OK;
});

// .............................................................................
// application context
// .............................................................................

app.get('/application-context.txt', function(req, res) {
  res.set("Content-Type", "text/plain; charset=utf-8");
  res.body = arangodb.inspect(applicationContext) + " \n";
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

// -----------------------------------------------------------------------------
// --SECTION--                                                       END-OF-FILE
// -----------------------------------------------------------------------------

/// Local Variables:
/// mode: outline-minor
/// outline-regexp: "/// @brief\\|/// @addtogroup\\|/// @page\\|// --SECTION--\\|/// @\\}\\|/\\*jslint"
/// End:
