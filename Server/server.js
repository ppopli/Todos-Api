const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

const {mongoose} = require('./db/mongoose');
const {Todo}     = require('./models/todos');
const {User}     = require('./models/users');

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
    let id = req.params.id
    console.log(id);
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

app.listen(3000, () => {
  console.log('server started on port 3000');
});

module.exports = {app};
