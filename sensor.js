var sensor = require('ds18x20');
var sensorList = sensor.list();

do {
  var temp = sensor.get(sensorList);
  console.log('Data: ' + temp);
}
while (temp < 26);
