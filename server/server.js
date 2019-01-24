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




  var message  = data["Body"].toUpperCase().split("-");
  
  var  main_menu = `Welcome to SMS portal.\n
  Thanks for reaching out. Type \n
  T for TICKET \n
  P for PRODUCT \n
  C for CONTRACT \n`

  var  ticket_menu = `You have selected Ticket Menu.\n
  Type\n 
  TC for Creating a ticket\n
  TV for Viewing a ticket\n`


  var  product_menu = `You have selected Product Menu.\n
  Type\n
  PC for Creating a Product\n
  PV for Viewing a Product\n`


  var  contract_menu = `You have selected Contract Menu.\n
  Type\n
  CC for Creating a contract\n
  CV for Viewing a contract\n`

var tc_menu = `You have selected creating a new ticket.  \n Please Fill The Below Format without double quotes:\n tcreate-"email"-"subject"-"description" `
var tv_menu = `You have selected viewing a ticket.  \n Please Follow The Format:\n`



  switch(message[0])
  {
    case "T": sendMsg(ticket_menu);
               break;
    
    case "P": sendMsg(product_menu);
               break;

    case "C": sendMsg(contract_menu);
               break;         
  }


  switch(message[0]){
    case "TC": sendMsg(tc_menu); break;
    case "TV":sendMsg(tv_menu); break;
    
    case "CC": sendMsg();break;
    case "CV":sendMsg(); break;
    
    case "PC": sendMsg();break;
    case "PV":sendMsg(); break;

    case "TCREATE":createTicket();break;

    default: sendMsg(main_menu);
               break;  
    
  }
  function createTicket(){
    var m=`{
      "helpdesk_ticket":{
          "description":"${message[3]}",
          "subject":"${message[2]}",
          "email":"${message[1]}",
          "priority":1, "status":2, "source":2,"ticket_type":"Incident"
      },
      "cc_emails":"superman@marvel.com,avengers@marvel.com"
    }`;
    console.log(m);
    postapiCall("/helpdesk/tickets.json",m);
  }
  
     
      // function getapiCall(path){
      //   console.log("-------------------------------");
      //   var headers = {"Authorization": "Basic <%= iparam.agent_api_key %>",
      //   'Content-Type': 'application/json'};
      //   var options = { headers: headers};
      //   var url = "https://"+iparams["domain"]+path;
      //   $request.get(url, options)  
      //   .then (
      //   function(data) {
      //     var result= JSON.parse(JSON.stringify(data));
      //     result=JSON.parse(result["response"]);
      //     sendMsg(result["helpdesk_ticket"]["description"]);
      //   },
      //   function(error) {
          // sendMsg("Error");
          // sendMsg(main_menu);
      //     console.log(error); 
      //   });
      // }
      //getapiCall("/helpdesk/tickets/1.json");
      function postapiCall(path,msgjson){
        var headers = {"Authorization": "Basic <%= iparam.agent_api_key %>",
        'Content-Type': 'application/json'};
        var options = { headers: headers,body:msgjson};
        var url = "https://"+iparams["domain"]+path;
        $request.post(url, options)  
        .then (
        function(data) {
          sendMsg("Ticket Successfully Created");
          console.log(data);
        },
        function(error) {
          sendMsg("Error");
          sendMsg(main_menu);
          console.log(error); 
        });
      }


    

      function sendMsg(msg){
      return t.messages.create({
        body: msg,
        to: data["From"],
        from: data["To"]
      },function(error,message){
        if(!error){
          console.log("Success"+message);
        }else{
          sendMsg("Error");
          sendMsg(main_menu);
          console.log(error);
        }
      });
    }
      
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
