const express = require('express');
const path = require('path'); // Module utilitaire pour manipuler les chemins de fichier
const cors = require('cors'); // Module utilitaire pour manipuler les chemins de fichier
const http = require('http');
const { Server } = require('socket.io');

const SerialPort = require('serialport');

const PORT = 3000;

const app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

const server = http.createServer(app);
const io = new Server(server);

const parser = new SerialPort.ReadlineParser({ delimiter: '\r\n' });
const serialport = new SerialPort.SerialPort({
    path: '/dev/ttyACM0', 
    baudRate: 9600,
    dataBits: 8,
    parity: 'none',
    stopBits: 1,
    flowControl: false
});

serialport.pipe(parser);

io.on('connection', (socket) => {

  console.log('Un utilisateur s\'est connecté');

  socket.on('message', (msg) => {
  
    console.log('Message reçu du client :', msg);
    io.emit('message', 'Message reçu : ' + msg);
  });

  socket.on('disconnect', () => {

    console.log('Un utilisateur s\'est déconnecté');
  });
});

// Lecture des données du port série
parser.on('data', (data) => {

  console.log('Donnée reçue sur le port série :', data);
  
  // Envoi des données à tous les clients connectés
  // io.emit('message', 'Donnée série : ' + data);
  io.emit('voiture', data);
});

// Route par défaut pour servir la page d'accueil
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.get('/send', (req, res) => {

  const data = req.query.id ?? 1;
  serialport.write(data.toString(), err => {

    if (err) {

      console.error('Erreur lors de l\'écriture sur le port série :', err.message);
      res.json({ status: 'NOT OK' });
    } else {

      res.send({ status: 'OK' });
    }
  });
});

// Démarrage du serveur
server.listen(PORT, () => {

  console.log(`http://localhost:${PORT}`);
});
