const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');
const userSchema = new Schema({
    username: String,
    email: String,
    checkmarkcode: {type: String,required:false},
    googleId: String,
    password: String,
})

const User = mongoose.model('user',userSchema);

module.exports = User;


module.exports.createUser = (newUser,callback)=>{
    bcrypt.genSalt(10,(err,salt)=>{
        bcrypt.hash(newUser.password,salt,(err,hash)=>{
            newUser.password = hash;
            newUser.save(callback);
        });
    });
}

module.exports.getUserByEmail = (username,callback)=>{
    var query = {email: username};
    User.findOne(query,callback);
}

module.exports.getUserById = (id,callback)=>{
    User.findById(id,callback);
}

module.exports.comparePassword = (candidatePassword,hash,callback)=>{
    bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
        if(err) throw err;
        callback(null,isMatch);
    });
}