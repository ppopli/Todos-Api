const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todos');

const todos = [
  {
    _id : new ObjectID(),
    text : "Something to cook"
  },
  {
    _id : new ObjectID(),
    text : "Something to eat"
  }
];

beforeEach((done) => {
  Todo.remove({}).then(() => {
    return Todo.insertMany(todos);
  }).then(() => done())
  .catch((err) => {
    return err;
  });
});

describe('POST /todos', () => {

  it('Should create a new todo', (done) => {
    let text = 'Test todo text';

    request(app)
      .post('/todos')
      .send({text})
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(text);
      })
      .end((err,res) => {
        if(err) {
          return done(err);
        }

        Todo.find().then((todos) => {
          expect(todos.length).toBe(3);
          expect(todos[2].text).toBe(text);
          done();
        }).catch((e) => done(e));
      });
  });

  it('Should not create a new todo with an empty body', (done) => {

    request(app)
      .post('/todos')
      .send({})
      .expect(400)
      .end((err, res) => {
        if(err) {
          return done(err);
        }
        Todo.find().then((todos) => {
          expect(todos.length).toBe(2);
          done();
        }).catch((e) => done(e));
      });
  });
});

describe('GET /todos', () => {

  it('Should get all todos', (done) => {
    request(app)
      .get('/todos')
      .expect(200)
      .expect((res) => {
        expect(res.body.todos.length).toBe(2);
      })
      .end(() => done());
  });
});


describe('GET /todos/:id', () => {

  it('Should get todo related to id sent', (done) =>{

    request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`)
      .expect((res) => {
        expect(res.body.todo.text).toBe(todos[0].text);
      })
      .end(() => done());
  });

  it('Should get error saying no data', (done) => {

    request(app)
      .get(`/todos/${new ObjectID().toHexString()}`)
      .expect(404)
      .expect((res) => {
        expect(res.body.error).toBe("no data");
      })
      .end(() => done());
  });

  it('Should return 404  and empty response', (done) => {
    request(app)
    .get('/todos/123')
    .expect(404)
    .expect((res) => {
      expect({}).toBe({});
    })
    .end(() => done());
  });
});
