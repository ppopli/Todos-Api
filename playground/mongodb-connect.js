const {MongoClient, ObjectID} = require('mongodb');


//for mongo v2
// MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
//
//   if(err) {
//     return console.log('unable to connect to database');
//   }
//     console.log('connect to TodoApp database');
//
//   db.close();
// });

//for mongo v3

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {

  if(err) {
    return console.log('unable to connect to database');
  }
  console.log('Connected to database ');

  const db = client.db('TodoApp');

  // db.collection('Todos').insertOne({
  //   text : "Something to do",
  //   completed : false
  // }, (err, result) => {
  //   if(err) {
  //       return console.log('Unable to insert todo', err);
  //   }
  //
  //   console.log(JSON.stringify(result.ops, undefined, 2));
  // });

  db.collection('Users').insertOne({
    name : "Pulkit",
    age : 24,
    location :  "New Delhi"
  }, (err, result) => {
    if(err) {
      return console.log('Unable to insert todo', err);
    }
    //result.ops is the array of documents inserted in a collection
    console.log(JSON.stringify(result.ops, undefined, 2));
    console.log(result.ops[0]._id.getTimestamp());
  });

  client.close();
});
