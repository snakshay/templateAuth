const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    userName: { type: 'String', required: true },
    passwordHash: { type: 'String', required: true }
})
const User = userSchema.model('user', userSchema);

module.exports = User;