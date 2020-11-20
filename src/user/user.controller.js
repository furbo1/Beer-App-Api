
var User = require('./user.model');
let bcrypt = require('bcrypt');
let config = require('../config/config');
let jwt = require('jsonwebtoken');

exports.getUsers = async (req, res) => {
    try{
        let users;
        if(req.query.login) {
            users = await User.find({login: req.query.login});
        }else {
            users = await User.find({});
        }

        if(users) {
            return res.status(202).json(users);
        }else {
            return res.status(400).json({message: 'An error has occured!'});
        }
    }catch (error) {
        return res.status('400').send(error);
    }

};



exports.getUser = async (req, res) => {
    try {
        let user = await User.findById({_id: req.params.id});

        if(user) {
            return res.status(202).json(user);
        }else {
            return res.status(400).json({message:'An error has occured.'});
        }
    } catch (error) {
        return res.status(400).send({message: "User not found."});
    }
};


exports.getUsersByName = async (req, res) => {
    try {
        let names =  await User.find(
            { name: { '$regex': `.*${req.query.name}.*`, '$options': 'i' }}
        );

        if(names) {
            return res.status(202).json(names);
        }else {
            return res.status(400).json({message:'An error has occured.'});
        }
    } catch (error) {
        return res.status(400).send(error);
    }
};


exports.createUser = async (req, res) => {
    try {
        let { username, email, password} = req.body;

        const newUser = await User.create({username, email, password});
        newUser.password = undefined;
        if(newUser) {
            return res.status(201).send({ message: "User created!", data: newUser });
        } else {
            return res.status(400).send({ message: "An error has occured! User not created!" });
        }
    } catch (error) {
        return res.status(400).send(error.message);
    }
};


exports.updateUser = async (req,res) =>{
    try{
        let {username, email, password} = req.body; // from BODY
        let userId = req.params.id // from URL

        let userFromReq = {
            username,
            email,
            password
        }

        const userUpdated = await User.findByIdAndUpdate(mongoose.Types.ObjectId(userId), { $set: userFromReq}, { new: true });

        if (userUpdated) {
            return res.status(202).json({ message: "User Updated", data: userUpdated });
        } else {
            return res.status(400).json({ message: "An error has occured! User not updated!"});
        }눀

    }catch (error) {
        return res.status(400).json(error.message);
    }


}

exports.deleteUser = async (req,res) =>{

    try {
        let userDeleted = await User.deleteOne({_id: req.params.id})
        if(userDeleted.n > 0){
            return res.status(200).json({message: 'User was deleted!'})
        }else {
            return res.status(400).json({message: "Error message!"})
        } 
    } catch(error){
        return res.status(400).json(error.message)
    }
}

function generateToken(params = {}) {
    return jwt.sign({ params }, config.secret, {
        expiresIn: config.timer
    });
};


exports.login = async (req,res) =>{
    try{
        const { email, password } = req.body;
        const user = await User.findOne({ email }).select('+password');
        if(!user) {
            return res.status(404).send({ message: "User not found!" });
        }
        if (!await bcrypt.compare(password, user.password)) {
            return res.status(400).send({ message: 'Invalid password! Try again!' });
        }
        user.password = undefined;
        return res.send({ message: "Welcome "+ user.username, data: user, token: generateToken({ id: user.id }) });
    }catch(error) {
        return res.status(400).json(error.message)
    }
}



