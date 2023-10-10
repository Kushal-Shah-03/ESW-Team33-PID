
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
    // {
    //   name: 'RPM #2',
    //   type: 'line',
    //   color: '#00A6A6',
    //   marker: {
    //     symbol: 'square',
    //     radius: 3,
    //     fillColor: '#00A6A6',
    //   }
    // },
    // {
    //   name: 'RPM #3',
    //   type: 'line',
    //   color: '#8B2635',
    //   marker: {
    //     symbol: 'triangle',
    //     radius: 3,
    //     fillColor: '#8B2635',
    //   }
    // },
    // {
    //   name: 'RPM #4',
    //   type: 'line',
    //   color: '#71B48D',
    //   marker: {
    //     symbol: 'triangle-down',
    //     radius: 3,
    //     fillColor: '#71B48D',
    //   }
    // },
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

// var chartM = new Highcharts.Chart({
//   chart: {
//     renderTo: 'chart-moisture',
//     backgroundColor: '#e4d4c6'
//   },
//   series: [
//     {
//       name: 'Moisture',
//       type: 'line',
//       color: '#101D42',
//       marker: {
//         symbol: 'circle',
//         radius: 3,
//         fillColor: '#101D42',
//       },
//     }
    // {
    //   name: 'RPM #2',
    //   type: 'line',
    //   color: '#00A6A6',
    //   marker: {
    //     symbol: 'square',
    //     radius: 3,
    //     fillColor: '#00A6A6',
    //   }
    // },
    // {
    //   name: 'RPM #3',
    //   type: 'line',
    //   color: '#8B2635',
    //   marker: {
    //     symbol: 'triangle',
    //     radius: 3,
    //     fillColor: '#8B2635',
    //   }
    // },
    // {
    //   name: 'RPM #4',
    //   type: 'line',
    //   color: '#71B48D',
    //   marker: {
    //     symbol: 'triangle-down',
    //     radius: 3,
    //     fillColor: '#71B48D',
    //   }
    // },
//   ],
//   title: {
//     text: undefined
//   },
//   xAxis: {
//     type: 'datetime',
//     dateTimeLabelFormats: { second: '%H:%M:%S' }
//   },
//   yAxis: {
//     title: {
//       text: 'Moisture (In Percentage)'
//     }
//   },
//   credits: {
//     enabled: false
//   }
// });


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
// function plotMoisture(jsonValue) {

//   var keys = Object.keys(jsonValue);
//   console.log(keys);
//   console.log(keys.length);

//   for (var i = 0; i < keys.length; i++) {
//     const date = new Date();
//     console.log("current Time", date);
//     var ISToffSet = 330; //IST is 5:30; i.e. 60*5+30 = 330 in minutes 
//     offset = ISToffSet * 60 * 1000;
//     var ISTTime = new Date(date.getTime() + offset);
//     console.log("IST Date", ISTTime);
//     // var x = (new Date()).getTime();
//     var x = ISTTime.getTime();
//     const key = keys[i];
//     var y = Number(jsonValue[key]);
//     console.log(y);

//     if (chartM.series[i].data.length > 40) {
//       chartM.series[i].addPoint([x, y], true, true, true);
//     } else {
//       chartM.series[i].addPoint([x, y], true, false, true);
//     }

//   }
// }

var data1=0;
var data2=0;

setInterval(sendReadings, 1000);
function sendReadings() {
  fetch("http://127.0.0.1:5000/RPM_P1")
    .then(response => response.json())
    .then(data => {
      console.log(data);
      data1=data['RPM']
      console.log(data1);
      plotRPM(data);
    }
    );
}

// setInterval(getMoisture, 1000);
// function getMoisture() {
//   fetch("http://127.0.0.1:5000/moisture_P1")
//     .then(response => response.json())
//     .then(data => {
//       console.log(data);
//       data2=data['moisture']
//       plotMoisture(data);
//     }
//     );
// }

// setInterval(getWaterPumpStatus, 1000);
// function getWaterPumpStatus() {
//   fetch("http://127.0.0.1:5000/pumpstatus_P1")
//     .then(response => response.json())
//     .then(data => {
//       var keys = Object.keys(data);
//       console.log(keys);
//       var key = keys[0];
//       console.log(key);
//       console.log(data[key]);
//       if (data[key] == 1) {
//         document.getElementById("pump_status").innerHTML = "ON";
//         document.getElementById("pump_status").style.color = "green";
//       }
//       else {
//         document.getElementById("pump_status").innerHTML = "OFF";
//         document.getElementById("pump_status").style.color = "red";
//       }
//     }
//     );
// }

// setInterval(getWaterUsage, 1000);
// function getWaterUsage() {
//   fetch("http://127.0.0.1:5000/waterusage_P1")
//     .then(response => response.json())
//     .then(data => {
//       var keys = Object.keys(data);
//       console.log(keys);
//       var key = keys[0];
//       console.log(key);
//       console.log(data[key]);
//       document.getElementById("water_usage").innerHTML = data[key];
//     }
//     );
    
//     if((data1==0 && data2==0) || (data1==0 && data2==100) || (data1>70 && data2==0) || (data1>70 && data2==100)){
//       document.getElementById("failure_status").innerHTML = "Failure, RPM and Moisture Sensors are not working";
//       document.getElementById("failure_status").style.color = "red";
//     }
//     if(data2==0 && data2==100){
//       document.getElementById("failure_status").innerHTML = "Failure, Moisture Sensor is not working";
//       document.getElementById("failure_status").style.color = "red";
//     }
//     if(data1==0 && data1>70){
//       document.getElementById("failure_status").innerHTML = "Failure, RPM Sensor is not working";
//       document.getElementById("failure_status").style.color = "red";
//     }
//     document.getElementById("failure_status").innerHTML = "No Failure";
//     document.getElementById("failure_status").style.color = "green";
// }


// Function to get current readings on the webpage when it loads for the first time
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
