const passport = require('passport');
const router = require('express').Router();
const User = require('../models/user-model');
const Checkmark = require('../models/checkmark-model');
const authCheck = (req,res,next) =>{
    if(!req.user){
        res.redirect('/auth/login');
    }
    else{
        next();
    }
}
 

router.get('/',authCheck,(req,res)=>{
    var user_id = (req.session.passport.user);
    User.findOne({_id:user_id},(err,user)=>{
        if(err) throw err;
        userscode = user.checkmarkcode;
        if(userscode != null){
            var query = {checkmarkcode:userscode};
            Checkmark.find(query,(err,result)=>{
                if(result){
                    res.render('home',{user:req.user,lists:result});
                }
                else{
                    res.render('home',{user:req.user});
                }
            });
        }
        else{
            console.log("null");
            var query = {user_id:user_id};
            Checkmark.find(query,(err,result)=>{
                if(result){
                    res.render('home',{user:req.user,lists:result});
                }
                else{
                    res.render('home',{user:req.user});
                }
            });
        }
    });

    
});

router.post('/',(req,res)=>{
    var data = req.body.item;
    
    var user_id = (req.session.passport.user);
    User.findOne({_id:user_id},(err,user)=>{
        if(err) throw err;
        userscode = user.checkmarkcode;
        var newCheckmark = new Checkmark({
            checkmarkcode: userscode,
            user_id: user_id,
            item: data,
            poster_id: user.id,
            poster_name: user.username,
        }).save().then((newitem)=>{
            Checkmark.find({userscode},(err,datas)=>{
                if(err) throw err;
                res.json([datas,user_id]);
            });
        });
    });

});

router.post('/getcode',authCheck,(req,res)=>{
    var user_id = (req.session.passport.user);
    if (user_id.match(/^[0-9a-fA-F]{24}$/)) {
        User.findOne({_id:user_id},(err,user)=>{
       if(err) throw err;
        user.checkmarkcode = user_id + Date.now(),
        user.save((err,result)=>{
            if(err) throw err;
            res.json(result.checkmarkcode);
        });
    });
    }
    
});



//delete item
router.post('/delete',authCheck,(req,res)=>{
    Checkmark.remove({_id: req.body.selecteditem},(err)=>{
        if(err) throw err;
    })
    res.redirect('/');
});


module.exports = router;