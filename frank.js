'use strict';

var Application = require("org/arangodb/foxx").Application;
var Repository = require("org/arangodb/foxx").Repository;

var arangodb = require("org/arangodb");
var actions = require("org/arangodb/actions");
var helloworld = require("a").text;

var app = new Application(applicationContext);
var texts = new Repository(app.collection("texts"));

// .............................................................................
// a simple text output with static text
// .............................................................................

app.get('/hello-world.txt', function(req, res) {
  res.set("Content-Type", "text/plain; charset=utf-8");
  res.body = "Hallo World (static)\n";
  res.statusCode = actions.HTTP_OK;
});

// .............................................................................
// a simple text output from global variable
// .............................................................................

app.get('/hello-world-global.txt', function(req, res) {
  res.set("Content-Type", "text/plain; charset=utf-8");
  res.body = helloworld + " (global)\n";
  res.statusCode = actions.HTTP_OK;
});

// .............................................................................
// a simple text output from local require
// .............................................................................

app.get('/hello-world-local.txt', function(req, res) {
  res.set("Content-Type", "text/plain; charset=utf-8");
  res.body = require("a").text + " (local)\n";
  res.statusCode = actions.HTTP_OK;
});

// .............................................................................
// a simple text output from repository
// .............................................................................

app.get('/hello-world-repo.txt', function(req, res) {
  res.set("Content-Type", "text/plain; charset=utf-8");
  res.body = texts.collection.any().text + " (repo)\n";
  res.statusCode = actions.HTTP_OK;
});

// .............................................................................
// application context as json
// .............................................................................

app.get('/application-context.json', function(req, res) {
  res.contentType = "application/json; charset=utf-8";

  var c = applicationContext._shallowCopy;
  delete c.foxxes;
  delete c.routingInfo;
  delete c.appModule;

  res.body = JSON.stringify(c) + " \n";
  res.statusCode = actions.HTTP_OK;
});

// .............................................................................
// application context as text
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
