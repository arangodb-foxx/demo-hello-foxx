'use strict';

var Controller = require("org/arangodb/foxx").Controller;
var Repository = require("org/arangodb/foxx").Repository;

var arangodb = require("org/arangodb");
var actions = require("org/arangodb/actions");
var helloworld = require("a").text;

var controller = new Controller(applicationContext);
var texts = new Repository(controller.collection("texts"));

// .............................................................................
// a simple text output with static text
// .............................................................................

controller.get('/hello-world.txt', function(req, res) {
  res.set("Content-Type", "text/plain; charset=utf-8");
  res.body = "Hallo World (static)\n";
  res.statusCode = actions.HTTP_OK;
});

// .............................................................................
// a simple text output from global variable
// .............................................................................

controller.get('/hello-world-global.txt', function(req, res) {
  res.set("Content-Type", "text/plain; charset=utf-8");
  res.body = helloworld + " (global)\n";
  res.statusCode = actions.HTTP_OK;
});

// .............................................................................
// a simple text output from local require
// .............................................................................

controller.get('/hello-world-local.txt', function(req, res) {
  res.set("Content-Type", "text/plain; charset=utf-8");
  res.body = require("a").text + " (local)\n";
  res.statusCode = actions.HTTP_OK;
});

// .............................................................................
// a simple text output from repository
// .............................................................................

controller.get('/hello-world-repo.txt', function(req, res) {
  res.set("Content-Type", "text/plain; charset=utf-8");
  res.body = texts.collection.any().text + " (repo)\n";
  res.statusCode = actions.HTTP_OK;
});

// .............................................................................
// application context as json
// .............................................................................

controller.get('/application-context.json', function(req, res) {
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

controller.get('/application-context.txt', function(req, res) {
  res.set("Content-Type", "text/plain; charset=utf-8");
  res.body = arangodb.inspect(applicationContext) + " \n";
  res.statusCode = actions.HTTP_OK;
});

// .............................................................................
// echo the response object
// .............................................................................

controller.get('/echo.json', function(req, res, next, options) {
  var result = { request : req, options : options };

  res.responseCode = actions.HTTP_OK;
  res.contentType = "application/json; charset=utf-8";
  res.body = JSON.stringify(result);
});

// .............................................................................
// convert the response object to text
// .............................................................................

controller.get('/echo.txt', function(req, res, next, options) {
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
