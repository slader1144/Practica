var divPlayers = document.getElementById("divPlayers");
var lblScore = document.getElementById("score");
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

var coins = [];
var players = [];
var boosts = [];

let playerId;

function drawPlayer(player) {
  ctx.beginPath();
  ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
  ctx.fillStyle = player.color;
  ctx.fill();
  ctx.closePath();
}
function drawCoin(coin) {
  ctx.beginPath();
  ctx.arc(coin.x, coin.y, coin.radius, 0, Math.PI * 2);
  ctx.fillStyle = "#f5d142";
  ctx.fill();
  ctx.closePath();
}
function drawBoost(boost) {
  ctx.beginPath();
  ctx.arc(boost.x, boost.y, boost.radius, 0, Math.PI * 2);
  ctx.fillStyle = "#f54842";
  ctx.fill();
  ctx.closePath();
}
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  //player.draw(ctx);
  players.forEach((player) => {
    drawPlayer(player);
    if (player.id == playerId) lblScore.innerHTML = player.score;
  });
  coins.forEach((coin) => {
    drawCoin(coin);
  });
  boosts.forEach((boost) => {
    drawBoost(boost);
  });
}

function showScores() {
  divPlayers.innerHTML = "";
  let leaderBoard = [...players].sort((a, b) => b.score - a.score); //.slice(0,limit);
  leaderBoard.forEach((player) => {
    divPlayers.innerHTML +=
      "<div>" + player.username + " | " + player.score + "</div>";
  });
}

export function startGame(data) {
  console.log(data.message);
  playerId = data.id;
  updateState(data.state);
}

export function updateState(state) {
  players = state.players;
  coins = state.coins;
  boosts = state.boosts;
  showScores();
}

setInterval(draw, 10);

//spawnCoin();
