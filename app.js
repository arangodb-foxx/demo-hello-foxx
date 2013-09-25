(function () {

    /*
      todo: example using underscore templates
      todo: example on how to properly create CRUD using a repository
      todo: example on format middleware
      todo: POST form example
     */
    "use strict";

    var Controller = require("org/arangodb/foxx").Controller;
    var Repository = require("org/arangodb/foxx").Repository;


    var arangodb = require("org/arangodb");
    var db = arangodb.db;
    var actions = require("org/arangodb/actions");
    var helloworld = require("./lib/a").text;

    var controller = new Controller(applicationContext);
    var texts = new Repository(controller.collection("texts"));

    // .............................................................................
    // Example 1.1: Route without parameters & simple text output with static text
    // .............................................................................

    controller.get('/hello', function (req, res) {
        res.set("Content-Type", "text/plain; charset=utf-8");
        res.body = "Hello World!\n";
    });

    // .............................................................................
    // Example 1.2: Route with parameter & simple text output
    // .............................................................................
    controller.get("/hello/:name", function (req, res) {
        res.set("Content-Type", "text/plain");
        res.body = "Hello " + req.params("name");
    });


    // .............................................................................
    // Example 1.3: Accessing the query component, return text
    // .............................................................................
    controller.get("/sum", function (req, res) {
        var sum = parseInt(req.params("a"), 10) + parseInt(req.params("b"), 10);
        res.body = "Result is  " + sum.toString();
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
    });


    // .............................................................................
    // Example 2.1: get an entry from the texts-collection in ArangoDB. The collection is
    // set up and populated in scripts/setup.js
    // .............................................................................

    controller.get('/get_from_db', function (req, res) {
        res.set("Content-Type", "text/plain; charset=utf-8");
        res.body = texts.collection.any().text + "\n";
    });


    // .............................................................................
    // Example 2.2: run AQL query from FOXX
    // .............................................................................

    controller.get('/run_aql', function (req, res) {
        res.set("Content-Type", "text/plain; charset=utf-8");
        var stmt = db._createStatement({ "query": "FOR i IN [ 1, 2 ] RETURN i * 2" });
        var c = stmt.execute();
        res.body = c.toArray().toString();
    });


    // .............................................................................
    // Example 3.1 Init FoxxModel & use method
    // .............................................................................
    controller.get('/createtiger/:name', function (req, res) {
        var Tiger = require("./models/tiger").Model;
        var myTiger = new Tiger({
            name: req.params("name")
        });
        res.set("Content-Type", "text/plain; charset=utf-8");
        res.body = myTiger.growl();
    });

    // .............................................................................
    // Example 3.2 Save FoxxModel in DB
    // .............................................................................
    controller.get('/savetiger/:name', function (req, res) {
        var Tiger = require("./models/tiger").Model;
        var myTiger = new Tiger({
            name: req.params("name")
        });
        if (myTiger.get('size') == null) {
            myTiger.set('size', Math.floor((Math.random() * 190) + 100));
        }
        texts.collection.save(myTiger.forDB());
        res.set("Content-Type", "text/plain; charset=utf-8");
        res.body = "Converted myTiger with myTiger.forDB() and saved it in texts collection";
    });


    // .............................................................................
    // Example 4.1 write to ArangoDB log
    // .............................................................................
    controller.get('/log', function (req, res) {

        try {
            throw new RangeError("[hello-foxx] Division by zero!");
        }
        catch (e) {
            console.log(e.message);
        }
        res.set("Content-Type", "text/plain; charset=utf-8");
        res.body = "division by zero error was triggered and exception message was logged in arangodb log"
    });

    // .............................................................................
    // 5.1 Return http status 303 and an error object
    // .............................................................................
    controller.get('/error',function (req, res) {
        throw new RangeError("[hello-foxx] Division by zero!");
    }).errorResponse(RangeError, 303, "This went completely wrong. Sorry!",
        function (e) {
            return {
                code: 123,
                msg: e.message
            };
        });

    // .............................................................................
    // 6.1 deliver static html file
    // app.js is not involved for this example
    // in this demo app all files in the files folder can be accessed static
    // this is configured in manifest.js in the "files" section
    // .............................................................................


    // .............................................................................
    // 6.2 Using the assets option
    // app.js is not involved for this example
    // manifest.js contains a definition for "layout.css"
    // assets/css/base.css and assets/css/custom.css are combined and accessible
    // under the name "layout.css"
    // the same works for Javascript, too, you can also use wildcards, see
    // the manual for more information on this
    // .............................................................................

    // .............................................................................
    // Example 10.4: convert the response object to text
    // .............................................................................

    controller.get('/response_to_text', function (req, res, next, options) {
        var result = { request: req, options: options };
        res.responseCode = actions.HTTP_OK;
        res.contentType = "text/plain; charset=utf-8";
        res.body = arangodb.inspect(result);
    });


    // .............................................................................
    // Example 10.1 Accessing global variables
    // .............................................................................

    controller.get('/global_var', function (req, res) {
        res.set("Content-Type", "text/plain; charset=utf-8");
        res.body = helloworld + " and accessed through a global variable\n";
    });

    // .............................................................................
    // Example 10.2: local require
    // .............................................................................

    controller.get('/local_require', function (req, res) {
        res.set("Content-Type", "text/plain; charset=utf-8");
        res.body = require("./lib/a").text + " and accessed with a local require\n";
        res.statusCode = actions.HTTP_OK;
    });

    // .............................................................................
    // Example 10.3: echo the response object
    // .............................................................................

    controller.get('/echo_response', function (req, res, next, options) {
        var result = { request: req, options: options };

        res.responseCode = actions.HTTP_OK;
        res.contentType = "application/json; charset=utf-8";
        res.body = JSON.stringify(result);
    });


    //         res.statusCode = actions.HTTP_OK;

    // .............................................................................
    // Example 10.5: return application context as text
    // .............................................................................

    controller.get('/appcontext_as_txt', function (req, res) {
        res.set("Content-Type", "text/plain; charset=utf-8");
        res.body = arangodb.inspect(applicationContext) + " \n";
    });


}());

// -----------------------------------------------------------------------------
// --SECTION--                                                       END-OF-FILE
// -----------------------------------------------------------------------------

/// Local Variables:
/// mode: outline-minor
/// outline-regexp: "/// @brief\\|/// @addtogroup\\|/// @page\\|// --SECTION--\\|/// @\\}\\|/\\*jslint"
/// End:
