// Setup basic express server
var express = require('express');
var bodyParser = require('body-parser');
var debug = require('debug')('cloud');
var namespaces = require('./namespaces');

var app = express();

app.use(bodyParser.json());

app.post('/update', function(req,res) {
  var body = req.body;
  var type = body.type;
  debug('type is:' + type); 
  var id = 'ns1';
  var payload = body.payload;
  debug('Payload is:' +payload);
  // TODO: error checks for invalid id, empty id, empty request -- and add unit tests

  var subDomain= req.hostname;
  debug('Domain is '  + subDomain);
  subDomain = subDomain.substring(0,subDomain.indexOf("."));
  debug('Sub Domain is '  + subDomain);
  var nsp = namespaces[id];
  //nsp.emit(type, payload);
  
  //console.dir(nsp);  
  //debug(type + ' action had payload: ' + payload);
 
  var i;
  for ( i=0; i <nsp.sockets.length ; i++)
  {
	  var hostName = nsp.sockets[i].handshake.headers.host;
	  hostName = hostName.split(".")[0]; 
	  if ( hostName == subDomain)
	   {
		   debug("Emitting:" + payload);
		   nsp.sockets[i].encode(true,type,myEncodingFunc(payload)).emit();
           console.log("Temp:"+ nsp.sockets[i].temp);
	   }
	   debug("Hostname and subdomain" + hostName + " " + subDomain);
  }
 
  /*res.json({
    payload: payload
  });*/
 

});


function myEncodingFunc(data)/*Defined by the user*/
{
  return data.replace(/\s+/g, ", ");
}

module.exports = app;
