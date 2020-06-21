// Variables
let elevators = getRandomInts(5);

// Express
const express = require('express');
const app = express();
app.use(express.static('dist'));

// Middleware
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cors for cross origin allowance
const cors = require('cors');
app.use(cors());

//Functions

//Generate random array with unique integers
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function getRandomInts(num) {
    let ints = [];
    while (ints.length < num) {
      let randNum = getRandomInt(1, 20);
      if(!ints.includes(randNum)){
        ints.push(randNum);
      }
    }
    return ints;
}

app.listen(8083, function () {
    console.log('Server listening on port 8083!');
});

app.post('/post', (req, res) => {
    const data = Number(req.body.value);
    const closest = elevators.reduce((a, b) => {
        let aDiff = Math.abs(a - data);
        let bDiff = Math.abs(b - data);
    
        if (aDiff == bDiff) {
            // Choose largest vs smallest (> vs <)
            return a > b ? a : b;
        } else {
            return bDiff < aDiff ? b : a;
        }
    });
    let index = elevators.indexOf(closest);
    elevators[index] = data;;
    res.json(closest)
    res.end();
});

app.get('/get', (req, res) => {
    res.send(elevators);
    res.end();
});