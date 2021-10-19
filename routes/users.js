const bcrypt = require('bcrypt');
const _ = require('lodash');
const { User, validate } = require('../models/user');
const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
    // sorovni validatsiya qilish
    const { error } = validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    // yangi foydalanuvchini tekshirish
    let user = await User.findOne({ email: req.body.email });
    if (user) {
        return res.status(400).send('Siz allaqachon ro`yxatdan o`tgansiz');
    } else {
        // yangi foydalanuvchi
        user = new User(_.pick(req.body, ['name', 'email', 'password']));
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        await user.save();
        res.send(_.pick(user, ['_id', 'name', 'email']));
    }
});

module.exports = router;