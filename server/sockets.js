const { io } = require("./server");
const game = require("./game-logic/game.server");
const { getUser } = require("./db/users");
const users = require("./db/users");

const TIME_STEP = 50;

var estajugando=0;

function validation(username) {

  let user = getUser(username);

  if(user){
    console.log("El usuario ya existe en la base de datos");


      if(game.isPlaying(username)==true){
        console.log("El usuario ya está jugando");
        return false;
      }else{

        return true;
      }

  }else{

    users.addUser(username);
    return true;

  }


  
}

//Middleware para autenticacion
io.use((client, next) => {
  let username = client.handshake.query.username;
  console.log("Middleware: validando conexion ", username);
  if (validation(username)) {
    return next();
  }

  //client.disconnect();
  return next(new Error("authentication error"));
});

io.on("connection", (client) => {
  let username = client.handshake.query.username;
  let user = users.getUser(username);
  console.log("Usuario Conectado", username); 
  if(user){
    game.spawnPlayer(client.id,user.score, username);
  }else{

    game.spawnPlayer(client.id,0, username);
  }
  client.emit("welcomeMessage", {
    message: "Bienvenido al juego",
    id: client.id,
    state: game.STATE,
  });

  client.on("move", (axis) => {
    game.setAxis(client.id, axis);
  });
  client.broadcast.emit("userConnection", {
    message: "Se ha conectado un nuevo usuario",
  });

  //Listeners
  client.on("broadcastEmit", (data, callback) => {
    console.log("Cliente:", data);
    client.broadcast.emit("broadcastEmit", data);
    callback({ message: "El mensaje fue recibido correctamente" });
  });
  client.on("disconnect", () => {
    console.log("Usuario desconectado");
    game.guardarScore(username);

    game.removePlayer(client.id);
    client.broadcast.emit("userDisconnection", {
      message: "Se ha desconectado un usuario",
    });
  });
});

setInterval(() => {
  io.emit("updateState", { state: game.STATE });
}, TIME_STEP);
