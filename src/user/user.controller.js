
var User = require('./user.model');
let bcrypt = require('bcrypt');
let config = require('../config/config');
let jwt = require('jsonwebtoken');
const generator = require('generate-password');
const mongoose = require('mongoose');
const nodemailer = require("nodemailer");



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

exports.resetPassword = async(req,res) => {
    try {
        if(req.body.email){
            let user = await User.findOne({
                email: req.body.email
            }) 
            if(user) {
                let code = generator.generate({
                    length: 4,
                    numbers: true,
                    symbols: false,
                    exclude: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
                    strict: false,
                });
                user.resetPasswordCode = code;
                user = await User.findByIdAndUpdate(mongoose.Types.ObjectId(user._id), {$set: user}, {new:true})
                

                    // Generate test SMTP service account from ethereal.email
                    // Only needed if you don't have a real mail account for testing
                    let testAccount = await nodemailer.createTestAccount();
                  
                    // create reusable transporter object using the default SMTP transport
                    let transporter = nodemailer.createTransport({
                      host: "smtp.gmail.com",
                      port: 587,
                      secure: false, // true for 465, false for other ports
                      auth: {
                        user: "lxcocan@gmail.com", // generated ethereal user
                        pass: "Google!1", // generated ethereal password
                      },
                    });
                  
                    // send mail with defined transport object
                    let info = await transporter.sendMail({
                    from: '"BeerApp 👻" <lxcocan@gmail.com>', // sender address
                      subject: "Reset password code", // Subject line
                      to: user.email, // list of receivers
                     subject: "Your reset password code is: "+ code  , // Subject line
                     text: "Your reset password code is: "+ code, // plain text body
                     html: "Hi<b>, " + user.username + "</b>. Your reset password is <b>"+ code + "</b>. Please, go do to application and enter this code to confirm.", // html body
                     
                    });
                  
                    console.log("Message sent: %s", info.messageId);
                    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
                  
                    // Preview only available when sending through an Ethereal account
                    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
                    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...

                  //main().catch(console.error);
                  
                // let testAccount = await nodemailer.createTestAccount();
                // let transporter = nodemailer.createTransport({
                //     host: "smtp.ethereal.email",
                //     port: 587,
                //     secure: false, // true for 465, false for other ports
                //     auth: {
                //       user: testAccount.user, // generated ethereal user
                //       pass: testAccount.pass, // generated ethereal password
                //     },
                //   });
                
                //   // send mail with defined transport object
                //   let info = await transporter.sendMail({
                //     from: '"Fred Foo 👻" <alexcocan@gmail.com>', // sender address
                //     to: "alexcocan@gmail.com", // list of receivers
                //     subject: "Your reset password code is: "+ code  , // Subject line
                //     text: "Your reset password code is: "+ code, // plain text body
                //     html: "Hi<b>, " + user.username + "</b>. Your reset password is <b>"+ code + "</b>. Please, go do to application and enter this code to confirm.", // html body
                //   });
                
                  console.log("Message sent: %s", info.messageId);
                
                res.status(200).send({message: "Please check your email address and follow the steps!"});
                
            }else {
                res.status(400).send({message: "User not found!"})
            }

        } else {
            res.status(400).json({"message": "Valid email is required!"})
        }
        
        
    } catch (error) {
        return res.status(400).send({"message": error.message})
    }



}


exports.confirmResetPassword = async (req,res) =>{
    try{
        const email = req.body.email;
        const newPassword = req.body.password;
        const code = req.body.code;

        let userId = req.params.id // from URL
        let user = await User.findOne({email:email}).select('+resetPasswordCode')

        user.password = user.updatePassword(newPassword);
        
        if(user){
            if(user.resetPasswordCode == code){
                user = await User.findByIdAndUpdate(mongoose.Types.ObjectId(user._id), { $set: user}, { new: true });
                return res.status(200).json({message:"Code confirmed"})
            }else {
                return res.status(400).json({message:"Codes don't match!"})
            }
        }else {
            return res.status(400).json({message:"User not found!"})
        }

        

        // if (userUpdated) {
        //     return res.status(202).json({ message: "User Updated", data: userUpdated });
        // } else {
        //     return res.status(400).json({ message: "An error has occured! User not updated!"});
        // }눀

    }catch (error) {
        console.log(error)
        return res.status(400).json(error)
    }


}





