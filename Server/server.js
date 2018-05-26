const express = require('express');
const bodyParser = require('body-parser');
const _  = require('lodash');
const {ObjectID} = require('mongodb');

const {mongoose} = require('./db/mongoose');
const {Todo}     = require('./models/todos');
const {User}     = require('./models/users');
const {authenticate} = require('./middleware/authenticate');

var app = express();

app.use(bodyParser.json());


app.post('/todos', (req, res) => {
    console.log(req.body);
    let todo = new Todo({
      text : req.body.text,
      // completed : req.body.completed
    });

    todo.save().then((doc) => {
      res.send(doc);
    }).catch((err) => {
      res.status(400).send(err);
    });
});

app.get('/todos', (req, res) => {

  Todo.find().then((todos) => {
    res.send({todos});
  }).catch((err) => {
    res.status(400).send(err);
  });
});

app.get('/todos/:id', (req, res) => {
    let id = req.params.id;
    if(!ObjectID.isValid(id)) {
      return res.status(404).send({});
    }

    Todo.findById(id).then((todo) => {
      if(!todo) {
        return res.status(404).send({"error" : "no data"});
      }
      res.status(200).send({todo});
    }).catch((err) => {
      res.status(404).send(err);
    });
});

app.delete('/todos/:id', (req, res) => {
  let id = req.params.id;

  if(!ObjectID.isValid(id)) {
    return res.status(404).send({});
  }

  Todo.findByIdAndRemove(id).then((todo) => {
    if(!todo) {
      return res.status(404).send({"error":"no data"});
    }
    res.status(200).send({todo});
  }).catch((err) => {
    res.status(404).send(err);
  });
});

app.patch('/todos/:id', (req, res) =>{
   let id = req.params.id;
   let body = _.pick(req.body, ['text', 'completed']);

   if(!ObjectID.isValid(id)) {
     return res.status(404).send({});
   }

   if(_.isBoolean(body.completed) && body.completed) {
     body.completedAt = new Date().getTime();
   }else {
     body.completed = false;
     body.completedAt = null;
   }

   Todo.findByIdAndUpdate(id, {$set : body}, {new :true})
    .then((todo) => {
      if(!todo) {
        return res.status(404).send({"error" : "no data"});
      }
      res.status(200).send({todo});
    }).catch((err)=> {
       return res.status(404).send();
    });

});

app.post('/users', (req, res) => {
  let body = _.pick(req.body, ['email', 'password']);

  let user = new User(body);

  user.save().then(() => {
    return user.getAuthToken();
  }).then((token) => {
    res.header('x-auth', token).send(user);
  }).catch((err)=>{
    res.status(400).send({
      'code' : err.code,
      'message' : err.errmsg
    });
  });
});

app.get('/users/me', authenticate, (req, res) =>{
  res.send(req.user);
});

app.listen(3000, () => {
  console.log('server started on port 3000');
});

module.exports = {app};
