const serialPort = require('serialport');

const config = require('../../config/serialPort');
const readLine = serialPort.parsers.Readline;
const port = new serialPort(config.port_RX, {
    baudRate: config.baudRate_RX,
});

const delay = time => new Promise(res=>setTimeout(res,time));
port.on('open', async function() {
    console.log('RX___connected!!!');
    port.write('AT\r\n'); await delay(50);
    port.write('AT+MODE=TEST\r\n'); await delay(50);
    port.write('AT+TEST=RFCFG,433\r\n'); await delay(50);
    port.write('AT+TEST=RXLRPKT\r\n'); await delay(50);
});

const parser = port.pipe(new readLine({ delimiter: '\r\n' }));

parser.on('error', (err) => console.log('[RX]: ', err));
port.on('error', (err) => console.log('[RX]: ', err));
port.on('close', function() {
    console.log('RX disconnect!');
});

function hex_to_ascii(str1) {
    let hex = str1.toString();
    let str = '';
    for (let n = 0; n < hex.length; n += 2) {
        str += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
    }
    return str;
}

function dataParse(str) {
    // console.log(str);
    let data = str.split("_");
    return {
        sub_id: data[0],
        T1: data[2],
        H1: data[3],
        L1: data[4], //Dew point
        PH1: data[5], //PIN
        SM1: data[1],
        sensor_1: {
            id: 123456,
            RF_signal: "Tốt",
        },
        sensor_2: {
            RF_signal: "Tốt",
            id: 12566,
            name: "Humidity",
            EOC: 34,
            value: data[3],
            battery: 98
        },
        sensor_3: {
            RF_signal: "Tốt",
            id: 23456,
            name: "Soil moisture",
            EOC: 45,
            value: data[1],
            battery: 90
        },
        time: Date.now()
    }
}


// function dataParse(str) {
//     let data_buffer;
//     data_buffer = {
//         id: str.slice(str.search('id') + 'id'.length, str.search('t')),
//         T1: Number(str.slice(str.search('t') + 't'.length, str.search('h'))),
//         H1: Number(str.slice(str.search('h') + 'h'.length, str.search('l'))),
//         L1: Number(str.slice(str.search('l') + 'l'.length, str.search('p'))),
//         PH1: Number(str.slice(str.search('p') + 'p'.length, str.search('s'))),
//         SM1: Number(str.slice(str.search('s') + 's'.length)),
//     };
//     return data_buffer;
// }
module.exports = {
    port,
    parser,
    hex_to_ascii,
    dataParse
};