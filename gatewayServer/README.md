# IOT Project Gateway Server
###### tags: `Node.js` `IOT` `CoAP` `MongoDB`

## Implementation
- Node.js 7.8.0
- dependencies:
    - express 4.15.3
    - mongoose 4.10.6
    - coap 0.21.0
    - cors 2.8.3
    - body-parser 1.17.2
    - bl 1.2.1
    - config-lite 2.0.0

## Description
A simple gateway server that hosts a server for IOT devices sending data by CoAP protocol.
It also provides HTTP API for mobile application to get the data from the IOT device.

## Installation
- clone the repository
- install Node.js v7.8.0 (or later version)
- run`npm install`
- modify the mongoDB dbpath at `config/default.js`

## Usage
- run the server `node Server/server.js`
- run the mockup client (IOT device) `node clientMockup.js`
- go to `http://localhost:3030/arduinoData/0`
    - to see recent 20 records
- go to `http://localhost:3030/temperature/lowest/0`
    - to see record lowest temperature
- go to `http://localhost:3030/temperature/highest/0`
    - to see record highest temperature
- go to `http://localhost:3030/temperature/lowestHours/:hours/0`
    - to see lowest temperature in past :hours
- go to `http://localhost:3030/temperature/highestHours/:hours/0`
    - to see highest temperature in past :hours

- to change LED state with HTTP API
    - uri: `http://localhost:3030/LED`
    - method: `PUT`
    - body: `{"LEDstate": "YYYYYY / NNNNNN / AAAAAA"}` in JSON format
    - response is `ON / OFF / AUTO`
    - Postman screenshot ![](http://i.imgur.com/iup53YU.png)

## Communication Between Client and Server
- Client sends CoAP request
    - uri: `coap://localhost/0/`
        - The pathname `/0/` means Machine No.0
    - header:
        - `"Accept": "application/json"`
        - `"Content-Format": "application/json"`
    - method: `PUT`
    - payload: A JSON object `requestPayload` consisted of
        - `sensorData`
            - Number `temperature`
        - int `LEDstate`(only 0 or 1)

- Server reads the request, sending back response
    - header: `"Content-Format" , "application/json"`
    - payload: A JSON object `responsePayload` consisted of
        - string `LED` (YYYYYY / NNNNNN / AAAAAA)

- Client reacts according to `LED`
    - `YYYYYY` -> turning on LED
    - `NNNNNN` -> turning off LED
    - `AAAAAA` -> turing auto detect mode (default)

## License
MIT © Kirintw
