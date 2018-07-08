const auth = require('basic-auth');

const username = process.env.username;
const admins = { [username]: { password: (process.env.password || 'password') } };

module.exports = function (request, response, next) {
  var user = auth(request);
  if (!user || !admins[user.name] || admins[user.name].password !== user.pass) {
    response.set('WWW-Authenticate', 'Basic realm="example"');
    return response.status(401).send();
  }
  return next();
};