const passport = require('passport');
const router = require('express').Router();
const User = require('../models/user-model');
const Checkmark = require('../models/checkmark-model');
const authCheck = (req,res,next) =>{
    if(!req.body==""){
        res.redirect('/');
    }
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


router.post('/',(req,res)=>{
    var code = req.body.checkmarkcode;
    var usercode = req.user.checkmarkcode;
    if(code == usercode){
        res.redirect('/');
    }
    else{
        User.find({checkmarkcode:code},(err,result)=>{
            if(result!=""){
                Checkmark.find({checkmarkcode:code},(err,data)=>{
                    res.render('other',{name: result[0].username,lists:data,code:code});
                });
                
            }
            else{
                res.render('other',{name:"Invalid Code"});
            }
        });
    }
});

router.post('/requestfromfriend',(req,res)=>{
    console.log(req.body);
    req.io.in(req.body.code).emit('Update List','Nakuha mo ba?');
    req.io.in('foobar').emit('Update List', 'anyone in this room yet?');
});



module.exports = router;