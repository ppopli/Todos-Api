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

userSchema.pre('save', function(next){
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
