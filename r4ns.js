var https = require("https");
var querystring = require("querystring");
var host = "secure.rage4.com";
var basePath = "/RAPI";
var timeOut = 5000;

function handleError(res) {
  var err = new Error(res.message);
  err.name = "r4nsError";
  err.code = res.id;
  return err;
}

function guard(fn) {
  var called = false;
  return function() {
    if (called) return;
    called = true;
    fn.apply(this, arguments);
  }
}

function r4ns(email, apiKey) {
  if (email === '' || typeof email !== 'string') {
    throw new Error("Valid Rage4 user email address needed!");
  }
  this.email = email;
  if (apiKey === '' || typeof apiKey !== 'string') {
    throw new Error("Valid Rage4 DNS API Key neded!");
  }
  this.apiKey = apiKey;
  this.req = function (opt, callback) {
    callback = guard(callback);
    var req = https.request(opt, function(res) {
      var body = '';
      res.setEncoding('utf8');
      res.on('data', function (chunk) {
        body += chunk;
      });
      res.on('end', function() {
        callback(null, body);
      });
    });
    req.on('error', function(e) {
      callback(e);
    });
    req.on('timeout', function () {
      callback(err( { message: "Timeout", id: 100 } ));
      req.abort();
    });
    req.setTimeout(timeOut);
    req.end();
  } 
  this.buildOptions = function (ep, params) {
    params = params || {};
    return {
      host: host,
      port: '443',
      path: basePath + '/' + ep + '/?' + querystring.stringify(params),
      method: 'GET',
      auth: email + ':' + apiKey,
    }
  }
}
r4ns.prototype.query = function (action, params, callback) {
  if (typeof params === "function") {
    callback = params;
    params = {};
  }
  params = params || {};
  return this.req(this.buildOptions(action, params), function(err, res) {
    if (err) return callback(err);
    callback(null, res);
  });
}

module.exports = r4ns;
