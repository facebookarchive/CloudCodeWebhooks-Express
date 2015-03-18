// Parse Open Cloud Code example for Node.JS with Express JS

// Require Node Modules
var https = require('https'),
    fs = require('fs'),
    express = require('express'),
    bodyParser = require('body-parser'),
    Parse = require('parse').Parse;

// Load SSL Certificate details, and the apps Webhook key
var privateKey = fs.readFileSync('private-key.pem'),
    certificate = fs.readFileSync('certificate.pem'),
    webhookKey = fs.readFileSync('webhook.key').toString().trim();

var serverOptions = {
  key: privateKey,
  cert: certificate
};

// Express middleware to enforce security using the Webhook Key
function validateWebhookRequest(req, res, next) {
  if (req.get('X-Parse-Webhook-Key') !== webhookKey) return errorResponse(res, 'Unauthorized Request.');
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
  var requestData = req.body;
  requestData.object.set('extra', 'fizzbuzz');
  successResponse(res, requestData.object);
});

app.post('/error', function(req, res) {
  var requestData = req.body;
  errorResponse(res, "No thanks.");
});

app.post('/hello', function(req, res) {
  var requestData = req.body;
  successResponse(res, "Hello!");
});

app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.end('{"error":"Request Failed."}');
});

/*
 * Launch the HTTPS server
 */

var server = https.createServer(serverOptions, app);
server.listen(443, function() {
  console.log('Open Cloud Code Server Running on port 443.');
});

