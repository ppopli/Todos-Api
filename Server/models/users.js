let mongoose = require('mongoose');
let validator = require('validator');
let jwt = require('jsonwebtoken');
let _ = require('lodash');
let bcrypt = require('bcryptjs');

let userSchema = new mongoose.Schema( {
  email : {
    type : String,
    required : true,
    trim : true,
    minlength : 1,
    unique : true,
    validate : {
      validator : validator.isEmail,
      message   : '{VALUE} is not a valid Email'
    }
  },

  password : {
    type : String,
    required : true,
    minlength : 8
  },

  tokens : [{
    access : {
      type : String,
      required : true
    },
    token : {
      type : String,
      required : true
    }
  }]
});

userSchema.methods.getAuthToken = function() {
  let user = this;
  let access = 'auth';
  let token = jwt.sign({_id : user._id.toHexString(), access}, 'pulkit').toString();
  user.tokens.push({access, token});

  return user.save().then(() => {
    return token;
  });

};

userSchema.methods.toJSON = function() {
  let user = this;
  let userObject = user.toObject();

  return _.pick(userObject,['_id', 'email']);
};

userSchema.methods.removeToken = function(token) {
  let user = this;

  return user.update({
    $pull: {
      tokens: {token}
    }
  });
};

userSchema.statics.findByToken = function(token) {
  let user = this;
  let decoded;

  try {
    decoded = jwt.verify(token, 'pulkit');
  }catch(e) {
    return Promise.reject();
  }

  return User.findOne({
    '_id' : decoded._id,
    'tokens.token' : token,
    'tokens.access' : 'auth'
  });
};

userSchema.statics.findByCredentials = function(email, password) {
  let User = this;

  return User.findOne({email}).then((user) => {
    if(!user) {
      return Promise.reject();
    }
    return new Promise((resolve, reject) => {
      bcrypt.compare(password, user.password,(err, res) => {
        if(res) {
          resolve(user);
        } else{
          reject();
        }
      });
    });
  });
};

userSchema.pre('save', function(next) {
  let user = this;
  if(user.isModified('password')) {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt, (err, hash) => {
        user.password = hash;
        next();
      });
    });
  }else {
    next();
  }
});

let User = mongoose.model('user', userSchema);

module.exports = {
  User
};
