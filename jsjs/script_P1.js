
// Create RPM Chart
var chartT = new Highcharts.Chart({
  chart: {
    renderTo: 'chart-RPM',
    backgroundColor: '#e4d4c6'
  },
  series: [
    {
      name: 'RPM',
      type: 'line',
      color: '#101D42',
      marker: {
        symbol: 'circle',
        radius: 3,
        fillColor: '#101D42',
      }
    }
  ],
  title: {
    text: undefined
  },
  xAxis: {
    type: 'datetime',
    dateTimeLabelFormats: { second: '%H:%M:%S' }
  },
  yAxis: {
    title: {
      text: 'RPM Celsius Degrees'
    }
  },
  credits: {
    enabled: false
  },
});

//Plot RPM in the RPM chart
function plotRPM(jsonValue) {

  var keys = Object.keys(jsonValue);
  console.log(keys);
  console.log(keys.length);

  for (var i = 0; i < keys.length; i++) {
    const date = new Date();
    console.log("current Time", date);
    var ISToffSet = 330; //IST is 5:30; i.e. 60*5+30 = 330 in minutes 
    offset = ISToffSet * 60 * 1000;
    var ISTTime = new Date(date.getTime() + offset);
    console.log("IST Date", ISTTime);
    // var x = (new Date()).getTime();
    var x = ISTTime.getTime();
    const key = keys[i];
    var y = Number(jsonValue[key]);
    console.log(y);

    if (chartT.series[i].data.length > 40) {
      chartT.series[i].addPoint([x, y], true, true, true);
    } else {
      chartT.series[i].addPoint([x, y], true, false, true);
    }

  }
}

var data1=0;
var data2=0;

setInterval(sendReadings, 1000);
function sendReadings() {
  fetch("http://127.0.0.1:3000/getCurrRPM")
    .then(response => response.json())
    .then(data => {
      console.log(data);
      data1=data['RPM']
      console.log(data1);
      plotRPM(data);
    }
    );
}

function getReadings() {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      var myObj = JSON.parse(this.responseText);
      console.log(myObj);
      plotRPM(myObj);
    }
  };
  xhr.open("GET", "/readings", true);
  xhr.send();
}

if (!!window.EventSource) {
  var source = new EventSource('/events');

  source.addEventListener('open', function (e) {
    console.log("Events Connected");
  }, false);

  source.addEventListener('error', function (e) {
    if (e.target.readyState != EventSource.OPEN) {
      console.log("Events Disconnected");
    }
  }, false);

  source.addEventListener('message', function (e) {
    console.log("message", e.data);
  }, false);

  source.addEventListener('new_readings', function (e) {
    console.log("new_readings", e.data);
    var myObj = JSON.parse(e.data);
    console.log(myObj);
    plotRPM(myObj);
  }, false);
}
