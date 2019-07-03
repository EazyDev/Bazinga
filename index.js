const express = require('express');
const app = express();
const mongoose = require('mongoose');
const parser = require('body-parser');



app.set('view engine','ejs');

app.use(parser.urlencoded({extended:true}));
app.use(parser.json());

app.use((req,res,next) => {
    res.header('Access-Control-Allow-Origin','*');
    res.header('Access-Control-Allow-Headers','*');

    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods','PUT,POST,PATCH,DELETE,GET');
        return res.status(200).json({});
    }
    next();
});

const orderBazingaModel = require('../Bazinga/models/orderBazinga');


mongoose.connect("mongodb+srv://Salman:qwerty123@victorcluster-6cqju.mongodb.net/test?retryWrites=true",function(err){
    if(err){
        console.log(err);
    }
    else{
        console.log("Atlas is connected");
    }
});


//This is for the main page, 
// fetches all the orders
app.get('/',function(req,res){
    // res.sendFile(__dirname + '/views/index.html');

    orderBazingaModel.find()
    .exec()
    .then(orders => {
        // console.log(orders);
        // res.json(orders).status(200);
        res.render('watch',{ordersBaz : orders})
    });
})

//For the Edit page, where the order displayed according to ID
app.get('/edit/:id',function(req,res){
    const ID = req.params.id
    console.log(ID);
    orderBazingaModel.find({orderID :ID})
    .exec()
    .then(orders => {
        // console.log(orders);
        // res.json(orders).status(200);
         res.render('edit',{ordersID : orders})
    });
})

//Pagekit or ngrok for exposing localserver to the WWW
// the webhook will send this post request with a large body
// we are taking the following data for storage
app.post('/',function(req,res){
    const newOrder = new orderBazingaModel({
        _id : new mongoose.Types.ObjectId(),
        email : req.body.email,
        phone : req.body.phone,
        ordercreated : req.body.created_at,
        country : req.body["shipping_address"]["country"],
        province : req.body["shipping_address"]["province"],
        orderID : req.body.id,
        firstname : req.body["customer"]["first_name"],
        lastname : req.body["customer"]["last_name"],
        quantity : req.body["line_items"]["quantity"]

    });

    newOrder.save(function(err,newEntry){
        if(err)
            res.json(err).status(400);
        else   
            res.json(newEntry).status(201);
    });
})

app.put('/edit/:id',function(req,res){
    const id = req.params.id;
    const newEmail = req.body.email;
    const newPhone = req.body.phone;

    if(newEmail)
    {
        orderBazingaModel.updateOne({orderID:id},{$set:{email:newEmail}})
        .exec()
        .then(data => {
            res.json(data).status(200);
        })
    }

    if(newPhone)
    {
        orderBazingaModel.updateOne({orderID:id},{$set:{phone:newPhone}})
        .exec()
        .then(data => {
            res.json(data).status(200);
        })
    }

});

app.get('/watch',function(req,rep){
    rep.sendFile(__dirname + '/views/watch.html');
})

app.get('/edit',function(req,rep){
    rep.sendFile(__dirname + '/views/edit.html');
})

app.listen(process.env.PORT || 3000,function () {
    console.log("our server is live on port %d in %s mode",this.address().port,app.settings.env);
})