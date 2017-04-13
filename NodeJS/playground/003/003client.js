var coap = require("coap");
var bl = require('bl');

///////////////////////////////////////////////
var LED = 0;
var temperature = -1;

var getTemp = (callback) => {
    callback(temperature);
}

var randomIntInc = (low, high) => {
    return Math.floor(Math.random() * (high - low + 1) + low);
}

var LEDmonitor = () => {
    getTemp((tempData) => {
        if(tempData >= 35) {
            LED = 1;
        }
        else {
            LED = 0;
        }
    });
}
var senseTemp = () => {
   temperature = randomIntInc(5 , 40);
}
///////////////////////////////////////////////
var sendData = (sensorName) => {
    getTemp((tempData) => {
        var req = coap.request({
            host: "192.168.0.11",
            pathname: `/sensorName/${tempData}`,
            options: {
                "Accept": "application/json"
            }
        });

        req.on("response" , (res) => {
            if (res.code !== "2.05") return process.exit(1);

            res.pipe(bl(function(err, data) {
                var payload = JSON.parse(data);
                console.log("response: " , payload);
                LEDswitch(payload);
            }))
        });
        req.end();
    });
}

var LEDswitch = (payload) => {
    if(payload.LEDchange == "same") {
        console.log("LED remain same value");
    }
    else if(payload.LEDchange == "on") {
        LED = 1;
        console.log("LED turned ON");
    }
    else if(payload.LEDchange == "off") {
        LED = 0;
        console.log("LED turned OFF");
    }
}

var printState = () => {
    var now = new Date().toString();
    console.log(now);
    console.log("LED: " , LED);
    console.log("temperature: " , temperature);
}


setInterval(senseTemp, 1*1000);   //mock temperature sensor , sense temperature every 1 sec
setInterval(LEDmonitor, 10*1000); //LED turns 1 when temperature >= 35 , sense every 10 sec
setInterval(sendData("tempSensor"), 5*1000);  //send temperature data every 5sec through HTTP request , change LED according to response
setInterval(printState, 1*1000);  //print LED and temperature status on screen