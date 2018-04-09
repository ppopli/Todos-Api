const {Todo} = require('./../Server/models/todos');
const {mongoose} = require('./../Server/db/mongoose');
var id = '5acb99032c36430ed8934f56';

Todo.find({
  _id:id
}).then((todos)=>{
  console.log('Todos ',todos);
});

Todo.findOne({_id:id})
  .then((todo)=> {
    console.log('Todo', todo);
  });

Todo.findById(id)
  .then((todo)=>{
    if(!todo) {
      return console.log('id not found');
    }
    console.log('Todo', todo);
  }).catch((err) => {
    console.log('error occured: - ', err);
  });
