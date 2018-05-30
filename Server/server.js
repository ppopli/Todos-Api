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


app.post('/todos',authenticate, (req, res) => {
    let todo = new Todo({
      text : req.body.text,
      _creator : req.user._id
    });

    todo.save().then((doc) => {
      res.send(doc);
    }).catch((err) => {
      res.status(400).send(err);
    });
});

app.get('/todos', authenticate, (req, res) => {

  Todo.find({
    _creator: req.user._id
  }).then((todos) => {
    res.send({todos});
  }).catch((err) => {
    res.status(400).send(err);
  });
});

app.get('/todos/:id',authenticate, (req, res) => {
    let id = req.params.id;
    if(!ObjectID.isValid(id)) {
      return res.status(404).send({});
    }

    Todo.findOne({
      _id : id,
      _creator : req.user._id
    }).then((todo) => {
      if(!todo) {
        return res.status(404).send({"error" : "no data"});
      }
      res.status(200).send({todo});
    }).catch((err) => {
      res.status(404).send(err);
    });
});

app.delete('/todos/:id', authenticate, (req, res) => {
  let id = req.params.id;

  if(!ObjectID.isValid(id)) {
    return res.status(404).send({});
  }

  Todo.findOneAndRemove({
    _id : id,
    _creator : req.user._id
  }).then((todo) => {
    if(!todo) {
      return res.status(404).send({"error":"no data"});
    }
    res.status(200).send({todo});
  }).catch((err) => {
    res.status(404).send(err);
  });
});

app.patch('/todos/:id', authenticate, (req, res) =>{
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

   Todo.findOneAndUpdate({
     _id : id,
     _creator : req.user._id
   }, {$set : body}, {new :true})
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

app.post('/users/login', (req, res) => {
  let body = _.pick(req.body, ['email', 'password']);

  User.findByCredentials(body.email, body.password).then((user) => {
    user.getAuthToken().then((token) => {
      return res.header('x-auth', token).send(user);
    });
  }).catch((e) => {
    res.status(400).send();
  });

});

app.delete('/users/me/token', authenticate, (req, res) => {
  req.user.removeToken(req.token).then(() => {
    res.status(200).send();
  }).catch((e) => {
    res.status(400).send();
  });
});
app.listen(3000, () => {
  console.log('server started on port 3000');
});

module.exports = {app};
