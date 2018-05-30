const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');
const {Todo} = require('./../../models/todos');
const {User} = require('./../../models/users');

const userOneID = new ObjectID();
const userTwoID = new ObjectID();

const users = [
  {
    _id : userOneID,
    email : 'ade@gmail.com',
    password : 'userOnePass',
    tokens : [{
      access: 'auth',
      token : jwt.sign({_id: userOneID, access:'auth'}, 'pulkit').toString()
    }]
  },
  {
    _id : userTwoID,
    email : 'def@gmail.com',
    password : 'userTwoPass',
    tokens : [{
      access: 'auth',
      token : jwt.sign({_id: userTwoID, access:'auth'}, 'pulkit').toString()
    }]
  }
];

const todos = [
  {
    _id : new ObjectID(),
    text : "Something to cook",
    _creator : userOneID
  },
  {
    _id : new ObjectID(),
    text : "Something to eat",
    completed : true,
    completedAt : 3333,
    _creator : userTwoID
  }
];


const populateData = (done) => {
  Todo.remove({}).then(() => {
    return Todo.insertMany(todos);
  }).then(() => done())
  .catch((err) => {
    return err;
  });
};

const populateUsers = (done) => {
  User.remove({}).then(() => {
    let userOne = new User(users[0]).save();
    let userTwo = new User(users[1]). save();

    return Promise.all([userOne, userTwo]);
  }).then(() => done());
};

module.exports = {todos, populateData, users, populateUsers};
