var email = 'your@email.example.com';
var apiKey = 'yourr4nsAPIKey'

var r4ns = require ('./r4ns');
var cl = new r4ns(email, apiKey);
function callback(err, res) {
  if (err) return console.log(err);
  return console.log(res);
}
//Get Domains
cl.query('getDomains', callback);
//Get Domain
cl.query('getDomain', { id:123 }, callback);
