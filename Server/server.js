const express = require('express');
const bodyParser = require('body-parser');

const {mongoose} = require('./db/mongoose');
const {Todo}     = require('./models/todos');
const {User}     = require('./models/users');

var app = express();

app.use(bodyParser.json());


app.post('/todos', (req, res) => {
    console.log(req.body);
    let todo = new Todo( {
      text : req.body.text,
      // completed : req.body.completed
    });

    todo.save().then((doc) => {
      res.send(doc);
    }).catch((err) => {
      res.status(400).send(err);
    });
});

app.listen(3000, () => {
  console.log('server started on port 3000');
});
