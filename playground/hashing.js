const {SHA256} = require('crypto-js');

const message = "Hello, I am pulkit";
const hash = SHA256(message).toString();

console.log(`Message: ${message}`);
console.log(`Hash: ${hash}`);
