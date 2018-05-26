const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todos');
const {User} = require('./../models/users');

const {todos, populateData, users, populateUsers} = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateData);

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

describe('DELETE/todos/:id', () =>{

  it('Should remove a todo', (done) => {
    request(app)
      .delete(`/todos/${todos[0]._id.toHexString()}`)
      .expect((res) => {
        expect(res.body.todo.text).toBe(todos[0].text);
      })
      .end(() => done());
    });

  it('Should get error while deleting saying no data', (done) => {

    request(app)
      .delete(`/todos/${new ObjectID().toHexString()}`)
      .expect(404)
      .expect((res) => {
        expect(res.body.error).toBe("no data");
      }).end(() => done());
  });

  it('Should return 404  and empty response while deleting todo', (done) => {
    request(app)
    .delete('/todos/123')
    .expect(404)
    .expect((res) => {
      expect({}).toBe({});
    }).end(() => done());
  });

});

describe('PATCH/todos/:id', () => {

  it('Should update the todo', (done) => {
    let id = todos[0]._id.toHexString();
    let todo = todos[0];
    todo.text = "Something to eat";
    todo.completed = true;

    request(app)
      .patch(`/todos/${id}`)
      .send(todo)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(todo.text);
        expect(res.body.todo.completed).toBe(true);
        expect(res.body.todo.completedAt).toBeA('number');
      })
      .end(() => done());
  });

  it('Should clear completedAt when todo is not completed', (done) => {
    let id = todos[1]._id.toHexString();
    let todo = todos[1];
    todo.completed = false;

    request(app)
      .patch(`/todos/${id}`)
      .send(todo)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(todo.text);
        expect(res.body.todo.completed).toBe(false);
        expect(res.body.todo.completedAt).toNotExits();
      })
      .end(() => done());

  });
});

describe('POST/users', () => {
  it('Should create a new user', (done) => {
    User.remove({}).then(()=>{ console.log('removed users')})
      .catch((err) => {
        return err;
      })

    request(app)
      .post(`/users`)
      .send({
        email : 'abc@123',
        password : 'abc123456'
      })
      .expect(200)
      .expect((res) => {
        console.log(res);
        expect(res.body.message).toBe('successful');
      })
      .end(() => done())
  });

  it('Should return a duplication error', (done) => {

    request(app)
      .post(`/users`)
      .send({
        email : 'abc@123',
        password : 'abc123456'
      })
      .expect(400)
      .end(()=>done());
  });

  it('Should return user if authenticated', (done) => {

    request(app)
      .get('/users/me')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body._id).toBe(users[0]._id.toHexString());
        expect(res.body.email).toBe(users[0].email);
      }).end(done);
  });

  it('Should return 401 if not authenticated', (done) => {

    request(app)
      .get('/users/me')
      .expect(401)
      .expect((res) => {
        expect(res.body).toEqual({});
      }).end(done);
    });
});
