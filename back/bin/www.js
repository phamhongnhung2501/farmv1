/** Module dependencies.*/
const app = require('../app');
const http = require('http');
const mqtt = require('mqtt');
const config = require('../config/network');
const logColor = require('../src/untils/logColor');
const service = require('./services/services');
const RX_port = require('./services/RX_serialPort');
const TX_port = require('./services/TX_serialPort');
const fakeData = require('./services/socket_data');

/** Get port from environment and store in Express.*/
let port = normalizePort(process.env.PORT || config.port);
app.set('port', port);

/** Create HTTP server.*/
let server = http.createServer(app);
const io = require('socket.io')(server);

/**Receive*/
RX_port.parser.on('data', async function(data) {
  if (data.substring(0, 9) === '+TEST: RX') {
    let convert_data = RX_port.hex_to_ascii(data.substring(11, data.length - 1));
    let result = RX_port.dataParse(convert_data);
    if(result) {
      // console.log(result.sub_id, result.SM1);
      await service.saveData(result);
      io.sockets.emit("farm_"+result.sub_id, result);
    }
  }
});

/** Socket.io connection.*/
io.on('connection', function (socket) {
  let sub_id = socket.handshake.query.sub_id;
  if(sub_id !=="G04"){
    setInterval(async function(){
      let data = fakeData.farm(sub_id);
      let topic = "farm_"+sub_id;
      socket.emit(topic, data);
    }, 3000);
  }
  // else{
  //   setInterval(async function(){
  //     let data = fakeData.farm_G04(sub_id);
  //     let topic = "farm_"+sub_id;
  //     socket.emit(topic, data);
  //   }, 3000);
  // }
  socket.on("controller", async function (data) {
    let command = data.id+data.status;
    console.log(command);
    await TX_port.transfer(command);
  });
});

/** Listen on provided port, on all network interfaces.*/
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/** Normalize a port into a number, string, or false.*/
function normalizePort(val) {
  let port = parseInt(val, 10);
  if (isNaN(port)) return val; // named pipe
  if (port >= 0) return port; // port number
  return false;
}

/** Event listener for HTTP server "error" event.*/
function onError(error) {
  if (error.syscall !== 'listen') throw error;
  let bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/** Event listener for HTTP server "listening" event.*/
function onListening() {
  let addr = server.address();
  let bind = typeof addr === 'string' ? 'pipe ' + addr : addr.port;
  console.log('Listening on ' + logColor(`color:yellow${config.hostname}:${bind}`));
}

console.log(logColor(`color:pink
███████╗ █████╗ ██████╗ ███╗   ███╗
██╔════╝██╔══██╗██╔══██╗████╗ ████║
█████╗  ███████║██████╔╝██╔████╔██║
██╔══╝  ██╔══██║██╔══██╗██║╚██╔╝██║
██║     ██║  ██║██║  ██║██║ ╚═╝ ██║
╚═╝     ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝     ╚═╝
`));

