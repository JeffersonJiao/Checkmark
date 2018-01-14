const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const LocalStrategy = require('passport-local').Strategy;
const keys = require('./keys');
const User = require('../models/user-model');
const flash = require('connect-flash');

passport.serializeUser((user,done)=>{
    done(null,user.id);
})

passport.deserializeUser((id,done)=>{
    User.findById(id).then((user)=>{
        done(null,user);
    });
})

passport.use(new GoogleStrategy({
    callbackURL: '/auth/google/redirect',
    clientID: keys.google.clientID,
    clientSecret: keys.google.clientSecret,
},(accessToken,refreshToken,profile,done)=>{
    var email = profile.emails[0].value;
    User.findOne({googleId:profile.id}).then((currentUser)=>{
        
        if(currentUser){
            console.log("current user");
            done(null,currentUser);
        }
        else{
            new User({
                username: profile.displayName,
                googleId: profile.id,
                email: email,
                password: null,
                checkmarkcode: null,

            }).save().then((newUser)=>{
                console.log('new user created:' + newUser)
                done(null,newUser);
            })
        }
    })
})
)


passport.use(new LocalStrategy(
    (username,password,done)=>{
        User.getUserByEmail(username,(err,user)=>{
            if(err) throw err;
            if(!user){
                return done(null,false,{message: 'Unknown'});
            }
            if(user.password == null){
                return done(null,false,{message: 'Password not set. Please log in using google plus'});
            }
            User.comparePassword(password,user.password,(err,isMatch)=>{
                if(isMatch){
                    return done(null,user);
                }
                else{
                    return done(null,false,{message: 'Invalid Password'});
                }
            });
        });
    }));

