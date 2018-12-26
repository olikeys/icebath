var http = require('http');
var url = require('url');
var sensor = require('ds18x20');
var safeZone = 26;

let key = process.env.IFTTT_KEY;


function triggerIftttMakerWebhook (event, key, value1, value2) {
  let iftttNotificationUrl = `https://maker.ifttt.com/trigger/${event}/with/key/${key}`;
  let postData = JSON.stringify({ value1, value2 });

  var parsedUrl = url.parse(iftttNotificationUrl);
  var postOptions = {
    hostname: parsedUrl.hostname,
    port: parsedUrl.port,
    path: parsedUrl.path,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': postData.length
    }
  };

  // Set up the request
  var postReq = http.request(postOptions, function (res) {
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
      console.log('Response: ' + chunk);
    });
  });

  // Trigger a POST to the url with the body.
  postReq.write(postData);
  postReq.end();
}

// grab all sensors connected
var sensorList = sensor.list();

// monitor the temp of the ice bath, when it reaches the unsafe zone
// kick off the notification
// the safe zone IS NOT 26, this has been set for simple testing
do {
  var temp = sensor.get(sensorList);
  console.log('Data: ' + temp);
} while (temp < safeZone);

// get the time of the temp rise
var date = new Date();
var hour = date.getHours();
hour = (hour < 10 ? '0' : '') + hour;
var min = date.getMinutes();
min = (min < 10 ? '0' : '') + min;
var curTime = hour + ':' + min;

triggerIftttMakerWebhook('icebath_temprise', key, temp, curTime);
