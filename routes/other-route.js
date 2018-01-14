const passport = require('passport');
const router = require('express').Router();
const User = require('../models/user-model');
const authCheck = (req,res,next) =>{
    if(!req.user){
        res.redirect('/auth/login');
    }
    else{
        next();
    }
}
 
router.get('/',authCheck,(req,res)=>{
    res.render('other',{user:req.user});
});
router.post('/',authCheck,(req,res)=>{
    console.log(req.body);
});

module.exports = router;