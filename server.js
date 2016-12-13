const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const autoIncrement = require('mongoose-auto-increment')

const app = express();

const todoModel = require('./models/todoModel')  //todo model

app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())

// MONGOOSE CONNECT
// ===========================================================================
mongoose.connect('mongodb://Gethyl:mongo123@ds061206.mlab.com:61206/tododb')

var db = mongoose.connection
db.on('error', ()=> {console.log( '---Gethyl FAILED to connect to mongoose')})
db.once('open', () => {
	console.log( '+++Gethyl connected to mongoose')
})

autoIncrement.initialize(db)

todoModel.schema.plugin(autoIncrement.plugin, { model: 'ToDo', field: 'itemId' })

// ROUTES FOR OUR API
// ===========================================================================
var router = express.Router()

// middleware to use for all requests
router.use(function(req, res, next) {
    // do logging
    console.log('+++Gethyl entering the middleware');
    next(); // make sure we go to the next routes and don't stop here
});

router.route('/')
		.get((req,res)=>{
			todoModel.find((err,result)=>{
				if (err){res.json({message:"---Gethyl GET worked!!",err:err})}
				else res.json({message:"+++Gethyl GET worked!!",result:result})
			})
		  });
router.route('/additem')
		.post((req,res)=>{
			var todoItem = new todoModel({
				item:req.body.item,
				completed: req.body.completed
			})

			todoItem.save((err,result)=> {
				if (err) {res.send("---Gethyl todoItem save failed " + err)}
				else res.json({message:"+++Gethyl SAVED new todo Item!!",result:result})
			})
	    });

app.use('/api',router)

app.listen(3000,()=> {console.log("+++Gethyl Express Running!!!")})
