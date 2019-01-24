var twilio = require("twilio");
const { parse } = require('querystring');

exports = {

  events: [
    { event: "onAppInstall", callback: "onAppInstallHandler"},
    {event: "onExternalEvent", callback: "onExternalEventHandler" },
  ],

  onExternalEventHandler: function(payload) {
      console.log(payload);
      var string = JSON.stringify(payload);
      var parsed=JSON.parse(string);
      var iparams = parsed["iparams"];
      var data = parsed["data"];
      data=parse(data);
      console.log(data);
      const accountSid =iparams["account_sid"];
      const authToken = iparams["auth_token"];
      const t = twilio(accountSid, authToken);
      ///////


      ///////
      return t.messages.create({
        body: data["Body"],
        to: data["From"],
        from: data["To"]
      })
      .done();
      // var headers = {"Authorization": "Basic <%= encode("+iparams.api_key+") %>"};
      // var options = { headers: headers, body: "Hello world"};
      // var url = "https://vaasan.freshservice.com/tickets.json";
      // $request.post(url, options)  
      // .then (
      // function(data) {
      //   console.log(data); 
      // },
      // function(error) {
      //   console.log(error); 
      // });
  },

  onAppInstallHandler: function(payload) {
    var string = JSON.stringify(payload);
    var iparams = JSON.parse(string)["iparams"];
    generateTargetUrl()
    .then(function(url) {
          //Include API call to the third party to register your webhook
          const Sms_client = twilio(iparams["account_sid"], iparams["auth_token"]);
          Sms_client.messaging.services
                    .create({friendlyName: iparams["messaging_service_name"], inboundRequestUrl: url})
                    .then(service => console.log(service.sid))
                    .done();
                    
    })
    .fail(function(err) {
        // Handle error
        console.log("kkvout"+err);
        renderData({
          message: 'Error generating target Url'
        });
    })
    renderData();
  }

};
