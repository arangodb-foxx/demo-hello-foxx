/*jslint indent: 2, nomen: true, maxlen: 100, white: true, plusplus: true, unparam: true */
/*global require, applicationContext*/
'use strict';

////////////////////////////////////////////////////////////////////////////////
/// @brief A Demo Foxx-Application written for ArangoDB
///
/// @file
///
/// DISCLAIMER
///
/// Copyright 2014-2016 ArangoDB GmbH, Cologne, Germany
/// Copyright 2004-2014 triAGENS GmbH, Cologne, Germany
///
/// Licensed under the Apache License, Version 2.0 (the "License");
/// you may not use this file except in compliance with the License.
/// You may obtain a copy of the License at
///
///     http://www.apache.org/licenses/LICENSE-2.0
///
/// Unless required by applicable law or agreed to in writing, software
/// distributed under the License is distributed on an "AS IS" BASIS,
/// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
/// See the License for the specific language governing permissions and
/// limitations under the License.
///
/// Copyright holder is ArangoDB GmbH, Cologne, Germany
///
/// @author Frank Celler
/// @author Copyright 2014-2016, ArangoDB GmbH, Cologne, Germany
/// @author Copyright 2011-2013, triAGENS GmbH, Cologne, Germany
////////////////////////////////////////////////////////////////////////////////

/*
    todo: example using underscore templates
    todo: example on how to properly create CRUD using a repository
    todo: example on format middleware
    todo: POST form example
*/

// standard ArangoDB modules
const conole = require("console");

const arangodb = require("@arangodb");
const actions = require("@arangodb/actions");
const createRouter = require("@arangodb/foxx/router");

// standard ArangoDB variables
const db = arangodb.db;

// HELLO-FOXX collections and libraries
const texts = module.context.collection('texts');
const helloworld = require("./lib/a").text;

// HELLO-FOXX router
const router = createRouter();
module.exports = router;

// this part is here to generate the examples, DO NOT USE in your code!
const snipplets = {};
const sections = {};

const sectionRouteParameters = "Route parameters, request & response";
const sectionDatabase = "Accessing the database";
const sectionModels = "Using models";
const sectionDebugging = "Debugging";
const sectionError = "Error handling";
const sectionMisc = "Misc";

function executeSourceCode(section, name, desc, code) {
  const func = new Function('router, db, texts, require, module, actions, helloworld', code);
  func(router, db, texts, require, module, actions, helloworld);

  const parts = name.split("|");
  const key = parts[0];
  snipplets[key] = code.trim();

  if (sections[section] === undefined) {
    sections[section] = [];
  }

  if (parts[1] === "NOLINK") {
    sections[section].push([ key, desc, "NOLINK" ]);
  } else {
    sections[section].push([ key, desc, parts.join("") ]);
  }
}

// -----------------------------------------------------------------------------
// Section: Route parameters, request & response
// -----------------------------------------------------------------------------

// .............................................................................
// Example: Route without parameters & simple text output with static text
// .............................................................................

executeSourceCode(
  sectionRouteParameters,
  "hello",
  "Route without parameters, returns plain text",
  `
router.get('/hello', function (req, res) {
  res.set("Content-Type", "text/plain; charset=utf-8");
  res.body = "Hello World!\\n";
});
`);

// .............................................................................
// Example: Route without parameters & simple text output with JSON object
// .............................................................................

executeSourceCode(
  sectionRouteParameters,
  "hello_text",
  "Route without parameters, returns plain text from JSON",
  `
router.get('/hello_text', function (req, res) {
  // default content type is text/plain
  res.body = { result: "Hello World!\\n" };
});
`);

// .............................................................................
// Example: Route without parameters & simple JSON output with JSON object
// .............................................................................

executeSourceCode(
  sectionRouteParameters,
  "hello_json",
  "Route without parameters, returns JSON object",
  `
router.get('/hello_json', function (req, res) {
  res.json({ result: "Hello World!\\n" });
});
`);

// .............................................................................
// Example: Route with parameter & simple text output
// .............................................................................

executeSourceCode(
  sectionRouteParameters,
  "hello_name|/John%20Doe",
  "Route with parameter, returns plain text",
  `
router.get("/hello_name/:name", function (req, res) {
  res.body = "Hello " + req.param("name");
});
`);

// .............................................................................
// Example: Accessing the query component, return text
// .............................................................................

executeSourceCode(
  sectionRouteParameters,
  "sum|?a=40&b=2",
  "Route with query component, returns plain text",
  `
router.get("/sum", function (req, res) {
  const sum = parseInt(req.param("a"), 10) + parseInt(req.param("b"), 10);
  res.body = "Result is " + sum.toString();
}).queryParam("a").queryParam("b");
`);

// -----------------------------------------------------------------------------
// Section: Accessing the database
// -----------------------------------------------------------------------------

// .............................................................................
// Example: get an entry from the texts-collection in ArangoDB. The collection is
// set up and populated in scripts/setup.js
// .............................................................................

executeSourceCode(
  sectionDatabase,
  "get_from_db",
  "Get entry from ArangoDB collection",
  `
router.get('/get_from_db', function (req, res) {
  res.body = texts.any().text + "\\n";
});
`);

// .............................................................................
// Example: run AQL query from FOXX
// .............................................................................

executeSourceCode(
  sectionDatabase,
  "run_aql",
  "Run AQL query from Foxx",
  `
router.get('/run_aql', function (req, res) {
  res.set("Content-Type", "text/plain; charset=utf-8");

  const stmt = db._createStatement({ "query": "FOR i IN [ 1, 2 ] RETURN i * 2" });
  const c = stmt.execute();

  res.json(c.toArray());
});
`);

// -----------------------------------------------------------------------------
// Section: Using models
// -----------------------------------------------------------------------------

// .............................................................................
// Example: use method
// .............................................................................

executeSourceCode(
  sectionModels,
  "tiger|/Roy",
  "Use a method",
  `
router.get('/tiger/:name', function (req, res) {
  const Tiger = require("./models/tiger").Tiger;
  const myTiger = new Tiger(req.param("name"));

  res.set("Content-Type", "text/plain; charset=utf-8");
  res.body = myTiger.growl();
});
`);

// .............................................................................
// Example: Save FoxxModel in DB
// .............................................................................

executeSourceCode(
  sectionModels,
  "save_tiger|NOLINK",
  "Validate a model",
  `
const TigerModel = require("./models/tiger").Model;

router.post('/save_tiger/:name', function (req, res) {
  texts.save(req.body);

  res.set("Content-Type", "text/plain; charset=utf-8");
  res.body = "Validated and saved it in texts collection";
}).body(TigerModel);
`);

// -----------------------------------------------------------------------------
// Section: Debugging
// -----------------------------------------------------------------------------

// .............................................................................
// Example: write to ArangoDB log
// .............................................................................

executeSourceCode(
  sectionDebugging,
  "log",
  "Write to ArangoDB log",
  `
router.get('/log', function (req, res) {
  try {
    throw new RangeError("[hello-foxx] Division by zero!");
  }
  catch (e) {
    console.warn(e.message);
  }

  res.body = "division by zero error was triggered and an "
    + "exception message was logged in arangodb log";
});
`);

// .............................................................................
// Example: echo the response object
// .............................................................................

executeSourceCode(
  sectionDebugging,
  "echo_response",
  "Echo the request object ",
  `
router.get('/echo_response', function (req, res, options, next) {
  const result = { request: req };
  res.json(result);
});
`);

// .............................................................................
// Example: convert the response object to text
// .............................................................................

executeSourceCode(
  sectionDebugging,
  "inspect_response",
  "Inspect the request object ",
  `
router.get('/inspect_response', function (req, res, next) {
  const result = { request: req };
  res.body = require("@arangodb").inspect(result);
});
`);

// .............................................................................
// Example: getting the context
// .............................................................................

executeSourceCode(
  sectionDebugging,
  "context",
  "Show the module context",
  `
router.get('/context', function (req, res) {
  res.set("Content-Type", "text/plain");
  res.body = require("@arangodb").inspect(module.context) + " \\n";
});
`);

// -----------------------------------------------------------------------------
// Section: Error handling
// -----------------------------------------------------------------------------

// .............................................................................
// Example: Return http status 303 and an error object
// .............................................................................

executeSourceCode(
  sectionError,
  "error",
  "Return HTTP status 403 and an error object",
  `
router.get('/error',function (req, res) {
  try {
    throw new RangeError("[hello-foxx] Division by zero!");
  } catch (e) {
    if (!(e instanceof RangeError)) {
      throw e;
    }

    res.throw(403, "This went completely wrong. Sorry!");
  }
}).error(403, "throw an forbidden as example");
`);

// -----------------------------------------------------------------------------
// Section: Misc
// -----------------------------------------------------------------------------

// .............................................................................
// Example: Deliver static file
// .............................................................................

executeSourceCode(
  sectionMisc,
  "static.html",
  "Show static html file",
  `
/* no special code required, the manifest contains

  "files": {
    "/": "files"
  },

*/
`);

// .............................................................................
// Example: Accessing global variables
// .............................................................................

executeSourceCode(
  sectionMisc,
  "global_var",
  "Accessing a global variable",
  `
router.get('/global_var', function (req, res) {
  res.set("Content-Type", "text/plain; charset=utf-8");
  res.body = helloworld + " and accessed through a global variable\\n";
});
`);

// .............................................................................
// Example: local require
// .............................................................................

executeSourceCode(
  sectionMisc,
  "local_require",
  "Accessing a module locally",
  `
router.get('/local_require', function (req, res) {
  res.set("Content-Type", "text/plain; charset=utf-8");
  res.body = require("./lib/a").text + " and accessed with a local require\\n";
  res.statusCode = actions.HTTP_OK;
});
`);

// .............................................................................
// Example: around
// .............................................................................

executeSourceCode(
  sectionMisc,
  "log_request",
  "Middleware to log all requests",
  `
router.get('/log_request', function (req, res) {
  const result = { a: 1, b: 2, c: "Hallo World" };
  res.responseCode = actions.HTTP_OK;
  res.body = result;
});

router.use('/log_request', function (req, res, next) {
  let start = Date.now();
  next();
  console.log('Request handled in', Date.now() - start, 'ms');
});
`);

// .............................................................................
// Helper function to retrieve the source code of the defined routes
// .............................................................................

router.get('/source', function (req, res) {
  const normalize = function (url) {
    return url.replace(/^\/?([a-zA-Z0-9_]+).*$/, '$1');
  };

  const source = {};

  for (let key in snipplets) {
    if (snipplets.hasOwnProperty(key)) {
      source[normalize(key)] = snipplets[key];
    }
  }

  const secs = [];

  Object.keys(sections).forEach(function(key) {
    secs.push({ name: key, routes: sections[key] });
  });  

  res.json({ sources: source, sections: secs });
});
