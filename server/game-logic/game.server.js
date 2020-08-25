const { guardarScoreBD } = require("../db/users");

const CANVAS_WIDTH = 500;
const CANVAS_HEIGHT = 400;
const LOOP_PERIOD = 10;
const STATE = {
  players: [],
  coins: [],
  boosts: [],
};

let axes = [];
let time=0;
const spawnPlayer = (id,score, username) => {
 
  STATE.players.push(
    new Player(
      id,
      score,
      username,
      Math.floor(Math.random() * (CANVAS_WIDTH - 10)) + 10,
      Math.floor(Math.random() * (CANVAS_HEIGHT - 10)) + 10
    )
    
  );
  axes[id] = {
    horizontal: 0,
    vertical: 0,
  };
};


class Player {
  
   
  constructor(id,score, username, x, y) {
    
    
    console.log(`New Player at (${x},${y})`);
    this.id = id;
    this.username = username;
    this.x = x;
    this.y = y;
    this.radius = 10;
    this.speed = 1;
    this.color = "#" + Math.floor(Math.random() * 16777215).toString(16);
    
      this.score = score;

    
    
  }


}
class Coin {
  constructor() {
    this.x = Math.floor(Math.random() * (CANVAS_WIDTH - 10)) + 10;
    this.y = Math.floor(Math.random() * (CANVAS_HEIGHT - 10)) + 10;
    this.points = 1;
    this.radius = Math.floor(Math.random() * 15) + 5;
    this.taken = false;
  }
  take(player) {
    if (!this.taken) {
      let dx = player.x - this.x;
      let dy = player.y - this.y;
      let rSum = this.radius + player.radius;

      return dx * dx + dy * dy <= rSum * rSum;
    }
  }
}

class Boost {
  constructor() {
    this.x = Math.floor(Math.random() * (CANVAS_WIDTH - 10)) + 10;
    this.y = Math.floor(Math.random() * (CANVAS_HEIGHT - 10)) + 10;
    this.points = 1;
    this.radius = 5;
    this.taken = false;
  }
  take(player) {
    if (!this.taken) {
      let dx = player.x - this.x;
      let dy = player.y - this.y;
      let rSum = this.radius + player.radius;

      return dx * dx + dy * dy <= rSum * rSum;
    }
  }
}
function setAxis(id, axis) {
  axes[id] = axis;
}
function spawnCoin() {
  if (STATE.coins.length <= 50) {
    let newCoin = new Coin();
    STATE.coins.push(newCoin);
  }
}
function spawnBoost() {
  if (STATE.boosts.length <= 50) {
    let newBoost = new Boost();
    STATE.boosts.push(newBoost);
  }
}


const update = () => {
  if (STATE.players) {
    STATE.players.forEach((player) => {
      let axis = axes[player.id];

      if (axis.horizontal > 0 && player.x < CANVAS_WIDTH - player.radius) {
        player.x += player.speed;
      } else if (axis.horizontal < 0 && player.x > 0 + player.radius) {
        player.x -= player.speed;
      }
      if (axis.vertical > 0 && player.y < CANVAS_HEIGHT - player.radius) {
        player.y += player.speed;
      } else if (axis.vertical < 0 && player.y > 0 + player.radius) {
        player.y -= player.speed;
      }

      STATE.coins = STATE.coins.filter((coin) => {
        if (!coin.take(player)) {
          return coin;
        } else {
          player.score += coin.radius;
        }
      });

      STATE.boosts = STATE.boosts.filter((boost) => {

        
        
        if (!boost.take(player)) {
          
          if(time==51){

            player.speed=1;
            time=0;
          }
          time++;
          return boost;
        } else{
          if(time !=50){

            player.speed =3;

          }
            

        }
          
        
       
      });
    });
  }
};

const removePlayer = (id) => {
  STATE.players = STATE.players.filter((player) => player.id != id);
};

const isPlaying = (username) =>{
  
  let user = STATE.players.find((player) => player.username == username);
  
  if(user){

    return true;

  }else{return false;}
}

const guardarScore =(username) =>{

  let user = STATE.players.find((player) => player.username == username);

  if(user){

      guardarScoreBD(user.username,user.score);
      

  }


}
setInterval(update, LOOP_PERIOD);
setInterval(spawnCoin, Math.floor(Math.random() * 2000) + 1000);
setInterval(spawnBoost, Math.floor(Math.random() * 5000) + 2000);

module.exports = {
  guardarScore,
  isPlaying,
  spawnPlayer,
  STATE,
  setAxis,
  removePlayer,
};
