const express = require("express");
const path = require("path"); 
const app = express();
const mongoose = require('mongoose');
const MongoClient = require('mongodb').MongoClient; //npm i mongodb
const bodyparser = require("body-parser");

mongoose.connect('mongodb://localhost/contactDance', {useNewUrlParser: true});
const port = 8000;


// Define mongoose schema
var contactSchema = new mongoose.Schema({
    name: String,
    phone: String,
    email: String,
    address: String,
    desc: String
  });

var Contact = mongoose.model('Contact', contactSchema);

// EXPRESS SPECIFIC STUFF
app.use('/static', express.static('static')) // For serving static files
app.use(express.urlencoded())

// PUG SPECIFIC STUFF
app.set('view engine', 'pug') // Set the template engine as pug
app.set('views', path.join(__dirname, 'views')) // Set the views directory
 
// ENDPOINTS
app.get('/', (req, res)=>{ 
    const params = { }
    res.status(200).render('home.pug', params);
})

app.get('/contact', (req, res)=>{ 
    const params = { }
    res.status(200).render('contact.pug', params);
})


app.post('/contact', (req, res)=>{ 
    var myData = new Contact(req.body);
    myData.save().then(()=>{
        res.send("This item has been saved to the database")
    }).catch(()=>{
        res.status(400).send("Item was not saved to the database")
    });
    

app.get('/members', (req, res, next) => {
    MongoClient.connect('mongodb://localhost:27017/', function(err, db) {
        if (err) throw err;
        var dbo = db.db("Contact");
        dbo.collection("contacts").find({}).toArray(function(err, result) {
          if (err) throw err;
          //console.log(result);
          res.status(200).render('members.pug', {result:result})  
          db.close();
        });
      }); 
});   

    // res.status(200).render('contact.pug');
})

// START THE SERVER
app.listen(port, ()=>{
    console.log(`The application started successfully on port ${port}`);
});
