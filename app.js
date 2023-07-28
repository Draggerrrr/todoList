const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
const _ = require("lodash");



const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static("public"));

//Connect to mongodb
mongoose.connect('mongodb+srv://admin-sushil:Secure%40456@cluster0.rc7ufzv.mongodb.net/todoListDB');

// Schema Creation Default item schema

const listSchema = new mongoose.Schema({
    name : String
});

// Model creation / collection creation using listschema

const model = mongoose.model('Item', listSchema);

const item1 = new model({
    name : "Welcome to your To Do List"
});

const item2 = new model({
    name : "Hit + to add a new item"
})

const item3 = new model({
    name : "<== Hit this to delete an item"
})

const itemsArray = [item1, item2, item3];  // Pushing/Adding items to Item collection

const customlistSchema = new mongoose.Schema({
    name : String,
    items : [listSchema]
});

const listModel = mongoose.model("customList", customlistSchema);


app.get("/", function( req, res){

    model.find().then(function(data){

        if(data.length === 0){                          // Inorder to insert only once and redirect to change the list after addition of items.
            model.insertMany(itemsArray)
                .then(function() {
                    console.log("Successfully saved the items to DB");
                })
                .catch(function(err){
                    console.log(err);
                });

                res.redirect("/");
            }

            else{
                res.render("list", { listTitle : "Today" , newItems : data});
            }

    })

})





app.post("/", function(req, res){

    let item = req.body.newItem;
    let listName = req.body.button;

    const newItemFromWeb =  new model({
        name : item
    })

    if(listName == "Today"){
        newItemFromWeb.save();
        res.redirect("/");
    }
    else{
        listModel.findOne({name : listName})
         .then(function(foundListName){
            foundListName.items.push(newItemFromWeb);
            foundListName.save();
            res.redirect("/"+ listName);
         });
    }
    
   


})



app.post("/delete",  function(req, res){
    const checkedItemCheckBox =  req.body.checkedItem;
    const listName =  req.body.listName;

   

    if(listName === "Today"){

        model.findByIdAndRemove(checkedItemCheckBox)
        .then(function(err){
            if(err){
                console.log(err);
            }
        })
        res.redirect("/");
    }
    else{
       
        listModel.findOneAndUpdate(
            { name: listName },
            { $pull: { items : { _id: checkedItemCheckBox } } }
        )
            .then(function () {
                res.redirect("/" + listName);
            })
            .catch(function (err) {
                console.log(err);
            });

    }
});

// Custom List Generation

app.get("/:customListname", function(req, res){
    const customListName = _.capitalize(req.params.customListname);


    listModel.findOne({name : customListName})
     .then(function(foundList){
        if(foundList){

            // Show an existing list 
            res.render("list", {listTitle : foundList.name , newItems : foundList.items});
        }
        else{
            // Create a new List
             const list = new listModel({
                name : customListName,
                items : itemsArray
            });

            list.save();

            res.redirect("/" + customListName);
            
        }
     })

   
});



app.listen(process.env.PORT ||3000,() =>{
    console.log("The server has started ");
});