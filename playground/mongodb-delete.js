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


  // db.collection('Users').deleteMany({name:"Pulkit"}).then((result)=>{
  //   console.log(JSON.stringify(result, undefined, 2));
  // }).catch((err) => {
  //   console.log(err);
  // });

  // db.collection('Users').deleteOne({name:"Pulkit"}).then((result)=>{
  //   console.log(JSON.stringify(result, undefined, 2));
  // }).catch((err) => {
  //   console.log(err);
  // });

  db.collection('Users').findOneAndDelete({name:"Pulkit"}).then((result)=>{
    console.log(JSON.stringify(result, undefined, 2));
  }).catch((err) => {
    console.log(err);
  });

  client.close();
});
