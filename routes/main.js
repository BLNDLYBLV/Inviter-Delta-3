var express = require('express');
var app = express();
var {ensureAuthenticated}=require('../config/auth');

var Event=require('../models/Event');
var User= require('../models/User');

var suberror;



app.get('/', (req,res) => {
    res.render('entry.ejs',{message: ""});
});

app.get('/notification',ensureAuthenticated,(req,res) =>{
    var i=0;
    var notifevents=[];
    // console.log(req.user.notification.length);    
    for(i=0;i<req.user.notification.length;i++)
    {
        // console.log(req.user.notification[i]);        
        Event.findOne({name: req.user.notification[i]},(err,eve) =>{
                // console.log(eve); 
                // if(eve.maxguest== null || eve.maxguest== undefined || eve.maxguest>eve.noofguest)
                    notifevents.push(eve);
                // console.log(notifevents[i]);  
                // console.log(notifevents[0]);
                 
        })
        // console.log(notifevents);   
    }
    // console.log(notevents);    
    Event.find({organiser: req.user.username},(err,eve)=>{
        if(err)
        {
            console.log(err)
        }
        // console.log(notifevents);        
        res.render('notification.ejs',{user: req.user, events: notifevents});
    });
});

app.get('/dashboard',ensureAuthenticated,(req,res) =>{
    var evjoined=[];
    var i;
    // console.log(evjoined.length);    
    // console.log(req.user.events_signed.length);    
    for(i=0;i<req.user.events_signed.length;i++)
    {
        Event.findOne({name: req.user.events_signed[i]},(err,even) =>{
            if(err)
            {
                console.log(err);                
            }
            else
            {
                evjoined.push(even);
                // console.log(evjoined.length);
            } 
        });
        
    }

    Event.find({organiser: req.user.username},(err,eve)=>{
        if(err)
        {
            console.log(err);
        }
        else
        {
            // console.log(evjoined.length);
            res.render('dashboard.ejs',{user: req.user, eventc:eve, eventj: evjoined}); 
        }
    });
})

app.get('/create',ensureAuthenticated,(req,res)=>{
    // console.log(suberror);    
    res.render('create.ejs',{user: req.user, error: suberror});
})

app.get('/invite/:evname',ensureAuthenticated,(req,res) =>{
    var evname = req.params.evname;
    evname=evname.replace('&',' ');
    Event.findOne({name: evname},(err,event)=>{
        if(err){
            console.log(err);            
        }
        else
        {
            if(event){
                // res.render('invite.ejs',{event: event});
                res.send(event.invite);
            }
            else{
                res.redirect('/dashboard');
            }    
        }
    });
});

app.post('/not/:msg',(req,res) =>{
    var msg=req.params.msg;
    // console.log(msg)
    msg=msg.split('&').join(' ');
    // console.log(msg);
    User.findOneAndUpdate({username: req.user.username},{$pull: {notifmsg: msg}},{useFindAndModify: false},(err,user) =>{
        if(err){
            console.log(err);            
        }
        else{
            console.log(user.notifmsg);
        }
    });
    res.redirect('/notification');
});

app.post('/create',(req,res) =>{
    
    var i;
    var j;
    var im=0;
    var n=0;
    var peoples=[];
    var name   =req.body.name;
    var date   =req.body.date;
    var invite =req.body.invit;
    console.log(req.body.invit);    
    var people =req.body.people;
    if(!name || !date || !invite || !people)
    {
        suberror="Enter all fields!!";
        // console.log(name);
        // console.log(date);
        // console.log(invite);
        // console.log(people);
        
        // res.render('create.ejs',{user: req.user,error: suberror});
        res.redirect('/create');
    }
    else
    {
        var newEvent= new Event({
            name: name,
            date: date,
            invite: invite,
            organiser: req.user.username,
            noofguest: 0
        });
        // console.log(newEvent.name);
        
        for(i=0;i<people.length;i++)
        {
            if(people[i]==',' || i==people.length-1)
            {
                for(j=im;j<i;j++)
                {
                    if(j==im){
                        peoples[n]=people[j];
                    }
                    else{
                        peoples[n]=peoples[n]+people[j];
                    }
                }
                im=i+1;
                n++;
            }
        }
        console.log(peoples);
        
        User.findOneAndUpdate({username: req.user.username},{$push:{events_created: newEvent.name}},{useFindAndModify: false},(err,user)=>{
            if(err){
                console.log(err);
            }
            else{
                // console.log(user);
                
            }
        });
        for(i=0;i<n;i++)
        {    
            User.findOneAndUpdate({username: peoples[i] },{$push:{notification: newEvent.name}},{useFindAndModify: false},(err,user)=>{
                if(err){
                    console.log(err);
                }
                else{
                    // console.log(user);
                }
            });
        }    
        newEvent.save();

        // req.user.events_created.push(newEvent.name);
        // req.session.save();
        res.redirect('/dashboard');
    }
}); 

app.post('/notification/:event/:decision', (req,res) =>{
    var evename=req.params.event;
    var decision=req.params.decision;
    var nog;
    evename=evename.replace('&',' ');
    console.log(evename);    
    console.log(decision);    
    if(decision=='accept')
    {
        User.findOneAndUpdate({username: req.user.username},{$push: {events_signed: evename}},{useFindAndModify: false}, (err,user)=>{
            if(err){
                console.log(err);                
            }
            else{
                Event.findOne({name: evename},(err,eve)=>{
                    if(err){
                        console.log(err);                        
                    }
                    else
                    {
                        User.findOneAndUpdate({username: eve.organiser},{$push: {notifmsg: req.user.username+' has accepted your request'}},{useFindAndModify: false},(err,user)=>{
                            if(err){
                                console.log(err);                               
                            }
                            else{
                                console.log(user.notifmsg);                                
                            }
                        })

                        nog=eve.noofguest;
                        nog++;
                        Event.findOneAndUpdate({name: evename},{noofguest: nog},{useFindAndModify: false},(err,eve)=>{
                            if(err){
                                console.log(err);                        
                            }
                            else
                            {
                                // console.log(eve.noofguest);                        
                                console.log(nog);                        
                            }
                        });
                    }
                });
                

                console.log(user.events_signed);                
            }
        });
    }
    User.findOneAndUpdate({username: req.user.username},{$pull: {notification: evename}},{useFindAndModify: false},(err,user) =>{
        if(err){
            console.log(err);            
        }
        else{
            console.log(user.notification);            
        }
    });
    res.redirect('/notification');
});

module.exports =app;