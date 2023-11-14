// Import required modules
const express = require('express');
const bodyParser = require('body-parser');

var rpm = 0;
var kp = 0;
var ki = 0;
var kd = 0;
var count = 0;
var currrpm = 0;
var count1=0;
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
    const full_path = path.join(__dirname, '../public/index.html');
    res.sendFile(full_path);
}
);

app.get('/graph', (req, res) => {
    const path = require('path');
    const full_path = path.join(__dirname, '../public/graph.html');
    res.sendFile(full_path);
}
);

app.post('/api/updateRPM', (req, res) => {
    console.log(req.body);
    rpm = req.body.rpm;
    console.log("RPM:", rpm);
    kp = req.body.kp;
    ki = req.body.ki;
    kd = req.body.kd;
    console.log("Kp:", kp);
    console.log("Ki:", ki);
    console.log("Kd:", kd);
    count++;
    res.send("OK");
});

app.get('/api/getRPM', (req, res) => {
    if (count > 0) {
        res.send(rpm);
    }
    else {
        res.send("No data");
    }
}
);

app.get('/api/getkp', (req, res) => {
    if (count > 0) {
        res.send(kp);
    }
    else {
        res.send("No data");
    }
});

app.get('/api/getki', (req, res) => {
    if (count > 0) {
        res.send(ki);
    }
    else {
        res.send("No data");
    }
}
);

app.get('/api/getkd', (req, res) => {
    if (count > 0) {
        res.send(kd);
    }
    else {
        res.send("No data");
    }
}
);

app.post('/api/updatecurrRPM', (req, res) => {
    console.log(req.body);
    currrpm = req.body.rpm;
    console.log("RPM:", currrpm);
    count1++;
    res.send("OK");
}
);


app.get('/api/getCurrRPM', (req, res) => {
    if(count1>0)
    {
        const data = {
            RPM: currrpm
        };
        res.send(data);
    }
    else
    {
        res.send("0");
    }
}
);

// Start the server
app.listen(3000, () => {
    console.log('Server started on port 3000');
});
