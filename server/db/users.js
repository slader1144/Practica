const fs = require("fs");

let users = [];

const loadUserDB = () => {
  try {
    users = require("./users.json");
  } catch (error) {
    users = [];
  }
};
loadUserDB();

const getUser = (username) => {
  const user = users.find((user) => user.username == username);
  return user;
};



const saveUsersBD = () => {
  const promesa = new Promise((resolve, reject) => {
    console.log(users);
    let data = JSON.stringify(users);
    fs.writeFile("server/db/users.json", data, (err) => {
      if (err) {
        console.log(err);
        reject("Error gudardando el archivo de usuarios");
      } else {
        console.log("Save ok");
        resolve(true);
      }
    });
  });
  return promesa;
};

const guardarScoreBD = (username,score) =>{

  const user = users.find((user) => user.username == username);
  if(user){

    user.score = score;
    saveUsersBD();

  }
  

}
const addUser = (username) => {
  const user = users.find((user) => user.username === username);
  if (user) {
    throw new Error(`El nombre de usuario ${username} ya esta registrado`);
  }
  console.log("New User " + username);
  let newUser = {
    id: users.length + 1,
    username,
    score: 0,
  };

  users.push(newUser);
  saveUsersBD();
  
  return newUser;
};

const getUsers = async (limit = 10) => {
  let query = users.slice(0, limit);
  return JSON.stringify(query);
};
module.exports = {
  guardarScoreBD,
  addUser,
  getUsers,
  getUser,
};
