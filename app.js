// Import required modules
const express = require('express');
const bodyParser = require('body-parser');

var om2mrpm=0;
var cin='0';
var prev_cin='0';

var rpm = 80;
var kp = 5;
var ki = 0.001;
var kd = 0.25;
var count = 0;
var currrpm = 0;
var count1 = 0;
// Create an instance of express
const app = express();

// Set up middleware
app.use(bodyParser.json());

// Import routes

// Catch all other routes and return the index file
app.get('/', (req, res) => {
    // console.log(__dirname);
    // res.send("Hello World");
    const path = require('path');
    const full_path = path.join(__dirname, 'public/index.html');
    res.sendFile(full_path);
}
);

app.get('/graph', (req, res) => {
    const path = require('path');
    const full_path = path.join(__dirname, 'public/graph.html');
    res.sendFile(full_path);
}
);

app.post('/api/updateRPM', (req, res) => {
    console.log(req.body);
    rpm = parseFloat(req.body.rpm);
    kp = parseFloat(req.body.kp);
    ki = parseFloat(req.body.ki);
    kd = parseFloat(req.body.kd);
    if (req.body.rpm == '') {
        rpm = 80;
    }
    if (req.body.kp == '') {
        kp = 5;
    }
    if (req.body.ki == '') {
        ki = 0.001;
    }
    if (req.body.kd == '') {
        kd = 0.25;
    }
    console.log("RPM:", rpm);
    console.log("Kp:", kp);
    console.log("Ki:", ki);
    console.log("Kd:", kd);
    count++;
    res.send("OK");
});

app.get('/api/getdata', (req, res) => {
    res.send({ RPM: rpm, Kp: kp, Ki: ki, Kd: kd });
}
);

// app.get('/api/getkp', (req, res) => {
//     if (count > 0) {
//         res.send(kp);
//     }
//     else {
//         res.send("No data");
//     }
// });

// app.get('/api/getki', (req, res) => {
//     if (count > 0) {
//         res.send(ki);
//     }
//     else {
//         res.send("No data");
//     }
// }
// );

// app.get('/api/getkd', (req, res) => {
//     if (count > 0) {
//         res.send(kd);
//     }
//     else {
//         res.send("No data");
//     }
// }
// );

app.post('/api/updatecurrRPM', (req, res) => {
    console.log(req.body);
    currrpm = parseFloat(req.body.currRPM);
    console.log("RPM:", currrpm);
    count1++;
    res.send("OK");
}
);


app.get('/api/getCurrRPM', (req, res) => {
    if (count1 > 0) {
        const data = {
            RPM: currrpm
        };
        res.send(data);
    }
    else {
        res.send("0");
    }
}
);

app.post('/api/updateOM2MRPM', (req, res) => {
    console.log(req.body);
    om2mrpm=req.body.rpm;
    cin=req.body.cin;
    console.log("CIN:", cin);
    console.log("RPM:", om2mrpm);
    om2mrpm = parseInt(om2mrpm);
    console.log("RPM:", om2mrpm);
    res.send("OK");
}
);

app.get('/api/getOM2MRPM', (req, res) => {
    if (cin==prev_cin){
        om2mrpm=-1;
    }
    res.send({ RPM: om2mrpm , kp: kp, ki: ki, kd: kd});
    prev_cin=cin;
}
);

// Start the server
app.listen(8080, () => {
    console.log('Server started on port 8080');
});
