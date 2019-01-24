exports = {

  events: [
    { event: "onAppInstall", callback: "onAppInstallHandler"},
    {event: "onExternalEvent", callback: "onExternalEventHandler" }
  ],

  onExternalEventHandler: function(payload) {
    //console.log("Logging arguments from onExternalEvent: " +  JSON.stringify(payload));
  },

  onAppInstallHandler: function(payload) {
    var string = JSON.stringify(payload);
    var iparams = JSON.parse(string)["iparams"];
    generateTargetUrl()
    .then(function(url) {
          //Include API call to the third party to register your webhook
          const Sms_client = require('twilio')(iparams["account_sid"], iparams["auth_token"]);
          Sms_client.messaging.services
                    .create({friendlyName: 'SMSFreshService', inboundRequestUrl: url+"/sms"})
                    .then(service => console.log(service.sid))
                    .done();
                    renderData({
                      message: 'S'
                    });
    })
    .fail(function(err) {
        // Handle error
        console.log("kkvout"+err);
        renderData({
          message: 'Error generating target Url'
        });
    })
  }

};
