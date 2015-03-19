// Parse Cloud Code Webhooks example for Express JS

// Require Node Modules
var http = require('http'),
    fs = require('fs'),
    express = require('express'),
    bodyParser = require('body-parser'),
    Parse = require('parse').Parse;

var webhookKey = fs.readFileSync('webhook.key').toString().trim();

// Express middleware to enforce security using the Webhook Key
function validateWebhookRequest(req, res, next) {
  console.log('TOUCHED');
console.log(req.get('X-Parse-Webhook-Key'));
//  if (req.get('X-Parse-Webhook-Key') !== webhookKey) return errorResponse(res, 'Unauthorized Request.');
  next();
}

// Parse middleware to inflate a beforeSave object to a Parse.Object
function inflateParseObject(req, res, next) {
  var object = req.body.object;
  var className = object.className;
  var parseObject = new Parse.Object(className);
  parseObject._finishFetch(object);
  req.body.object = parseObject;
  next();
}

function successResponse(res, data) {
  data = data || true;
  res.status(200).send({ "success" : data });
}

function errorResponse(res, message) {
  message = message || true;
  res.status(500).send({ "error" : message });
}

var app = express();
var jsonParser = bodyParser.json();

app.use(validateWebhookRequest);
app.use(jsonParser);

/*
 * Define routes here
 */

app.post('/success', inflateParseObject, function(req, res) {
console.log(req);
  var requestData = req.body;
  requestData.object.set('extra', 'fizzbuzz');
  successResponse(res, requestData.object);
});

app.post('/error', function(req, res) {
  errorResponse(res, "No thanks.");
});

app.post('/hello', function(req, res) {
  successResponse(res, "Hello!");
});

app.post('/addNumbers', function(req, res) {
  var params = req.body.params;
  successResponse(res, params.a + params.b);
});

app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.end('{"error":"Request Failed."}');
});

/*
 * Launch the HTTPS server
 */
var port = process.env.PORT || 443;
var server = http.createServer(app);
server.listen(port, function() {
  console.log('Cloud Code Webhooks server running on port ' + port + '.');
});

