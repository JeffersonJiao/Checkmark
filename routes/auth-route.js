const express = require('express');
const router = require('express').Router();
const passport = require('passport');
const User = require('../models/user-model');
const LocalStrategy = require('passport-local').Strategy;
const flash = require('connect-flash');
router.get('/login',(req,res)=>{
    if(req.user){
        res.redirect('/')
    }
    else{
        res.render('login',{user:req.user});
    }
});

router.post('/login', passport.authenticate('local',{successRedirect: '/', failureRedirect:'/auth/login',failureFlash:true,}),(req, res)=>{
        res.redirect('/',{user:req.user});
  });

router.get('/logout',(req,res)=>{
    req.logout();
    res.redirect('/');
});

router.get('/google',passport.authenticate('google',{
    scope: ['profile','email']
}));

router.get('/google/redirect',passport.authenticate('google'),(req,res)=>{
    // res.send(req.user);
    res.redirect('/');
});

router.get('/register',(req,res)=>{
    res.render('register');
});
router.post('/register',(req,res)=>{
    var name = req.body.name;
    var email = req.body.email;
    var password = req.body.pwd;
    var cpassword = req.body.cpwd;
 
    req.checkBody('name','Name is required').notEmpty();
    req.checkBody('email','Email is required').notEmpty();
    req.checkBody('email','Email is not valid').isEmail();
    req.checkBody('pwd','Password is required').notEmpty();
    req.checkBody('cpwd','Passwords do not match').equals(req.body.pwd);

    var errors = req.validationErrors();

    if(errors){
        res.render('register',{
            errors: errors
        });
    }
    else{
        User.findOne({'email':email}).then((foundUser)=>{
            if(foundUser){
                req.flash('error_msg','Email address is already registered');
                res.render('register');
            }
            else{
                var newUser = new User({
                    username:name,
                    email:email,
                    password:password,
                    checkmarkcode: null,
                });

                User.createUser(newUser,(err,user)=>{
                    if(err) throw err;
                    console.log(User);
                });
                req.flash('success_msg','You are now registered and can now login');
                res.redirect('/auth/login');
            }
        });
        
    }
})

module.exports = router;