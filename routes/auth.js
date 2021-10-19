
const Joi = require('joi');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const { User } = require('../models/user');
const express = require('express');
const router = express.Router();


router.post('/', async (req, res) => {
    // http so`rovini validatsiya qilish
    const { error } = validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    //  email bo`yicha izlash
    let user = await User.findOne({ email: req.body.email });
    if (!user) {
        return res.status(400).send('email yoki password xato!');
    }


    //passwordni bazadagi bn taqqoslaymiz
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) {
        return res.status(400).send('email yoki password xato!');
    }

    // const token = jwt.sign({ _id: user._id }, 'PrivateKey');
    res.send(token);
});

function validate(req) {
    const schema = Joi.object({
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required()
    });

    return schema.validate(req);
}

module.exports = router; 