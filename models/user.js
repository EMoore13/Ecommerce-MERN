const mongoose = require('mongoose');
const crypto = require('crypto');
const uuidv1 = require('uuid/v1');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
        maxlength: 50
    },
    email: {
        type: String,
        trim: true,
        required: true,
        unique: true,
        maxlength: 75
    },
    hashed_password: {
        type: String,
        required: true
    },
    info: {
        type: String,
        trim: true,
        maxlength: 200
    },
    salt: String,
    role: {
        type: Number,
        default: 0
    },
    history: {
        type: Array,
        default: []
    }
}, {timestamps: true});

//virtual field
userSchema.virtual('password')
.set(function(password) {
    this._password = password;
    this.salt = uuidv1();
    this.hashed_password = this.encryptPassword(password);
})
.get(function() {
    return this._password
});

//methods
userSchema.methods = {
    //Encrypts password to a Hmac hash
    encryptPassword: function(password) {
        if (!password) {
            return '';
        }

        try {
            return crypto.createHmac('sha1', this.salt)
                    .update(password)
                    .digest('hex');
        } catch(e) {
            return '';
        }
    },

    //authenticate
    authenticate: function(pText) {
        return this.encryptPassword(pText) === this.hashed_password;
    }
}

//export
module.exports = mongoose.model("User", userSchema);