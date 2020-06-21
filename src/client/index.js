// Imports
import './styles.scss'
import './elevator-icon-vector.jpg'

// Variables
let input = {};
let total;
let floors = document.getElementsByClassName('floor');

//Functions

// Send value to server
async function postData (url, data){
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    };
    const response = await fetch(url, options);
    const json = await response.json();
    let index = total.indexOf(json);
    updateUI(index, Number(data.value));
    total[index] = Number(data.value);
}

// UpdateUI
function updateUI(index, floor) { 
    let i = setInterval(function(){
        if (Number(floors[index].innerHTML) === floor) {
            clearInterval(i);
        } else if (Number(floors[index].innerHTML) < floor){
            floors[index].innerHTML = Number(floors[index].innerHTML) + 1;
        } else {
            floors[index].innerHTML = Number(floors[index].innerHTML) - 1;
        }
    }, 2000);
}

// Get elevators floor level
async function getInfo() {
    const res = await fetch('http://localhost:8083/get');
    const data = await res.json();
    let i = 0;
    for (const floor of floors){
        floor.innerHTML = data[i];
        i++;
    }
    total = data;
    return null;
}

// Function to check if elevator is on input value (floor)
function checkDoublet(array, value){
    for (const index of array){
        if (value == index){
            return true;
        }
    }
    return false;
}

// Check if value is outside 1-20
function greaterOrLesser (value) {
    if (value < 1 || value > 20){
        return true;
    }
    else {
        return false;
    }
}

// Eventlistener for form submit
document.getElementById('form').addEventListener('submit', (e) => {
    e.preventDefault();
    input.value = document.getElementById('destination').value;
    if (checkDoublet(total, input.value)) {
        console.log("Elevator is already on this floor. Please choose another floor.");
        return null;
    }
    else if (greaterOrLesser(input.value)) {
        console.log("There's only floor 1-20. Please choose another floor.");
        return null;
    }
    else {
    postData('http://localhost:8083/post', input);
    }
});

getInfo();