(function () {
    "use strict";

    var Controller = require("org/arangodb/foxx").Controller;
    var Repository = require("org/arangodb/foxx").Repository;

    var arangodb = require("org/arangodb");
    var db = arangodb.db;
    var actions = require("org/arangodb/actions");
    var helloworld = require("a").text;

    var controller = new Controller(applicationContext);
    var texts = new Repository(controller.collection("texts"));

   // .............................................................................
   // Example 1.1: Route without parameters & simple text output with static text
   // .............................................................................

    controller.get('/hello', function (req, res) {
        res.set("Content-Type", "text/plain; charset=utf-8");
        res.body = "Hello World!\n";
        res.statusCode = actions.HTTP_OK;
    });

    // .............................................................................
    // Example 1.2: Route with parameter & simple text output
    // .............................................................................
    controller.get("/hello/:name", function(req, res) {
        res.set("Content-Type", "text/plain");
        res.body = "Hello "+req.params("name");
        res.statusCode = actions.HTTP_OK;
    });


    // .............................................................................
    // Example 1.3: Accessing the query component, return text
    // .............................................................................
    controller.get("/sum", function(req,res) {
        var sum = parseInt(req.params("a"),10) + parseInt(req.params("b"),10);
        res.body = "Result is  "+sum.toString();
        res.statusCode = actions.HTTP_OK;
    });


    // .............................................................................
    // Example 1.4: getting the application context as JSON
    // .............................................................................

    controller.get('/appcontext', function (req, res) {
        res.contentType = "application/json; charset=utf-8";

        var c = applicationContext._shallowCopy;
        delete c.foxxes;
        delete c.routingInfo;
        delete c.appModule;

        res.body = JSON.stringify(c) + " \n";
        res.statusCode = actions.HTTP_OK;
    });


    // .............................................................................
    // Example 2.1: get an entry from the texts-collection in ArangoDB. The collection is
    // set up and populated in scripts/setup.js
    // .............................................................................

    controller.get('/get_from_db', function (req, res) {
        res.set("Content-Type", "text/plain; charset=utf-8");
        res.body = texts.collection.any().text + "\n";
        res.statusCode = actions.HTTP_OK;
    });


    // .............................................................................
    // Example 2.2: run AQL query from FOXX
    // .............................................................................

    controller.get('/run_aql', function (req, res) {
        res.set("Content-Type", "text/plain; charset=utf-8");
        var stmt = db._createStatement( { "query": "FOR i IN [ 1, 2 ] RETURN i * 2" } );
        var c = stmt.execute();
        res.body = c.toArray().toString();
        res.statusCode = actions.HTTP_OK;
    });


    // .............................................................................
   // Example 3.1 Accessing global variables
   // .............................................................................

    controller.get('/global_var', function (req, res) {
        res.set("Content-Type", "text/plain; charset=utf-8");
        res.body = helloworld + " and accessed through a global variable\n";
        res.statusCode = actions.HTTP_OK;
    });

   // .............................................................................
   // Example 3.2: local require
   // .............................................................................

    controller.get('/local_require', function (req, res) {
        res.set("Content-Type", "text/plain; charset=utf-8");
        res.body = require("a").text + " and accessed with a local require\n";
        res.statusCode = actions.HTTP_OK;
    });

    // .............................................................................
    // Example 3.3: echo the response object
    // .............................................................................

    controller.get('/echo_response', function (req, res, next, options) {
        var result = { request: req, options: options };

        res.responseCode = actions.HTTP_OK;
        res.contentType = "application/json; charset=utf-8";
        res.body = JSON.stringify(result);
    });


    // .............................................................................
    // Example 3.4: convert the response object to text
    // .............................................................................

    controller.get('/response_to_text', function (req, res, next, options) {
        var result = { request: req, options: options };

        res.responseCode = actions.HTTP_OK;
        res.contentType = "text/plain; charset=utf-8";
        res.body = arangodb.inspect(result);
    });

   // .............................................................................
   // Example 3.5: return application context as text
   // .............................................................................

    controller.get('/appcontext_as_txt', function (req, res) {
        res.set("Content-Type", "text/plain; charset=utf-8");
        res.body = arangodb.inspect(applicationContext) + " \n";
        res.statusCode = actions.HTTP_OK;
    });






}());

// -----------------------------------------------------------------------------
// --SECTION--                                                       END-OF-FILE
// -----------------------------------------------------------------------------

/// Local Variables:
/// mode: outline-minor
/// outline-regexp: "/// @brief\\|/// @addtogroup\\|/// @page\\|// --SECTION--\\|/// @\\}\\|/\\*jslint"
/// End:
