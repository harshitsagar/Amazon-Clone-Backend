const express = require('express');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../middlewares/auth');

const authRouter = express.Router();

// Signup Route ......
authRouter.post('/api/signup', async (req, res) => {

    try {

        const {name , email, password} = req.body;

        // check if user already exists ....
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({msg: "User with same email already exists!"});
        }

        // hash the password .....
        const hashedPassword = await bcrypt.hash(password, 8);

        let user = new User({
            name,
            email,
            password: hashedPassword,
        });

        user = await user.save();
        res.json(user);

    } catch (e) {
        res.status(500).json({error: e.message});
    }

});

// Signin Route ......
authRouter.post('/api/signin', async (req, res) => {

    try {

        const {email, password} = req.body;

        const user = await User.findOne({ email });
        if(!user){
            return res.status(400).json({msg: "User with this email does not exists!"});
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({msg: "Incorrect Password!"});
        }

        const token = jwt.sign({id: user._id}, "passwordKey");
        res.json({token, ...user._doc});

    } catch (e) {
        res.status(500).json({error: e.message});
    }

});

// Token Validation Route ......
authRouter.post('/api/tokenIsValid', async (req, res) => {

    try {
        // get the token from header .....
        const token = req.header('x-auth-token');
        // check if token is not present .....
        if(!token) return res.json(false);
        // verify the token .....
        const verified = jwt.verify(token, "passwordKey");
        // if token is not verified .....
        if(!verified) return res.json(false);
        // check if user exists .....
        const user = await User.findById(verified.id);
        if(!user) return res.json(false);
        return res.json(true);

    } catch (e) {
        res.status(500).json({error: e.message});
    }

});

// Get User Data ......
authRouter.get('/userdata',auth, async (req, res) => {

    const user = await User.findById(req.user);
    res.json({...user._doc, token: req.token});

});

module.exports = authRouter;


