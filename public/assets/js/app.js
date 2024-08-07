const socket = io();

const generateOrCode = (url, id = "qrcode-test") => {
  return new QRCode(id, {
    text: url,
    width: 256,
    height: 256,
    colorDark: "#000000",
    colorLight: "#ffffff",
    correctLevel: QRCode.CorrectLevel.H,
  });
}

// Écoute des messages du serveur
socket.on('message', (msg) => {
  document.getElementById('messages').innerHTML += `<p>${msg}</p>`;
});

socket.on('voiture', (msg) => {

  try {

    console.log(msg);
    const data = JSON.parse(msg);
    if (data.received == 1) {

      // document.getElementById('qrcode').innerHTML += `<p>QR CODE GENERATE</p>`;
      // Call PayUnit API
      const qrcode = generateOrCode("Hello World");
    } else {

      document.getElementById("qrcode-test").innerHTML = "";
    }
  } catch (error) {

    alert(error.message);
  }
});

// Envoi d'un message au serveur
document.getElementById('sendButton').addEventListener('click', () => {
  socket.send('Bonjour serveur!');
});

document.getElementById('onButton').addEventListener('click', () => {
  generateOrCode("Hello World");
  fetch('/send?id=1')
    .then((response) => response.json())
    .then(data => console.log(data))
});

document.getElementById('offButton').addEventListener('click', () => {
  fetch('/send?id=2')
    .then((response) => response.json())
    .then(data => console.log(data))
});
