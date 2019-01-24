$(document).ready( function() {
    app.initialized()
        .then(function(_client) {
          var client = _client;
          client.events.on('app.activated',
            function() {
                client.data.get('requester')
                    .then(function(data) {
                        $('#apptext').text("Ticket created by " + data.requester.name);
                    })
                    .catch(function(e) {
                        console.log('Exception - ', e);
                    });
        });
    });
});

const MessagingResponse = require('twilio').twiml.MessagingResponse;


          app.post('/sms', (req, res) => {
            const twiml = new MessagingResponse();

            twiml.message('The Robots are coming! Head for the hills!');

            res.writeHead(200, {'Content-Type': 'text/xml'});
            res.end(twiml.toString());
          });
