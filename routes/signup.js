var fs = require('fs');
var path = require('path');
var sha1 = require('sha1');

var express = require('express');
var router = express.Router();

var UserModel = require('../models/users');
var checkNotLogin = require('../middlewares/check').checkNotLogin;

// GET /signup
router.get('/', checkNotLogin, function(req, res, next) {
    res.render('signup');
});

// POST /signup
router.post('/', checkNotLogin, function(req, res, next) {
    console.log("router.post");
    var name = req.fields.name;
    var gender = req.fields.gender;
    var bio = req.fields.bio;
    var avatar = req.files.avatar.path.split(path.sep).pop();
    var password = req.fields.password;
    var repassword = req.fields.repassword;

    // Check the parameters
try {
    if (!(name.length >= 1 && name.length <= 10)) {
        throw new Error('名字需介於1-10個字符');
    }
    if (['m', 'f', 'x'].indexOf(gender) === -1) {
        throw new Error('性別只能是男、女或保密');

    }
    if (!(bio.length >= 1 && bio.length <= 30)) {
        throw new Error('個人簡介需介於1-30個字符');
    }
    if (!req.files.avatar.name) {
        throw new Error('缺少頭像');
    }
    if (password.length < 6) {
        throw new Error('密碼至少6個字符');
    }
    if (password != repassword) {
        throw new Error('兩次密碼輸入不一致');
    }
} catch (e) {
    // Fail to signup. 異步刪除上傳的頭像
    fs.unlink(req.files.avatar.path);
    req.flash('error', e.message);
    return res.redirect('/signup');
}

// 明文密碼加密
password = sha1(password);

// 待寫入資料庫的用戶資訊
var user = {
    name: name,
    password: password,
    gender: gender,
    bio: bio,
    avatar: avatar
}

// 將用戶資訊寫入資料庫
UserModel.create(user)
    .then(function(result) {
        user = result.ops[0];
        delete user.password;
        req.session.user = user;
        req.flash('success', '註冊成功');
        res.redirect('/posts');
    })
    .catch(function(e) {
        fs.unlink(req.files.avatar.path);
        if (e.message.match('E1100 duplicate key')) {
            req.flash('error', '用戶名稱已有人使用');
            return res.redirect('/signup');
        }
        next(e);
    })
});

module.exports = router;