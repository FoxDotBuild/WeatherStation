var pull = require('pull-stream')
var Client = require('ssb-client')

var stubPost = {
  type: 'post',
  text: 'This is me testing the fancy new ssb-client module :) #test'
};

Client(function (err, server) {
  if (err) throw err
  server.publish(stubPost, function (err, msg) {
    if (err) throw err
    console.dir(msg);
  })
});
