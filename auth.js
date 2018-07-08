const auth = require('basic-auth');

const username = (process.env.username || 'admin');
const secret = (process.env.password || 'admin');

const admins = { [username]: { password: secret } };

module.exports = function (request, response, next) {
  var user = auth(request);
  if (!user || !admins[user.name] || admins[user.name].password !== user.pass) {
    response.set('WWW-Authenticate', 'Basic realm="example"');
    return response.status(401).send();
  }
  return next();
};