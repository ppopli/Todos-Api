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


  db.collection('Todos').find({completed:true}).toArray().then((docs)=>{
    console.log(JSON.stringify(docs, undefined, 2));
  }).catch((err) => {
    console.log(err);
  });

  //to query using _id, we need to use ObjectID constructor as _id is an Object
  //and not a string.
  db.collection('Todos').find({_id:ObjectID('5aaab86fa0873c36dc4449ec')}).toArray().then((docs)=>{
    console.log(JSON.stringify(docs, undefined, 2));
  }).catch((err) => {
    console.log(err);
  });

  db.collection('Todos').find().count().then((count)=>{
    console.log(JSON.stringify(count, undefined, 2));
  }).catch((err) => {
    console.log(err);
  });

  db.collection('Users').find().count().then((count)=>{
    console.log('Number of Users',JSON.stringify(count, undefined, 2));
  }).catch((err) => {
    console.log(err);
  });
  client.close();
});
