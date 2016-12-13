const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({extended:true}))

mongoose.connect('mongodb://Gethyl:mongo123@ds061206.mlab.com:61206/tododb')

var db = mongoose.connection;
db.on('error', ()=> {console.log( 'Gethyl FAILED to connect to mongoose')})
db.once('open', () => {
	console.log( 'Gethyl connected to mongoose')
})

var Schema = mongoose.Schema;

	// create a schema
	var toDoSchema = new Schema({
	  itemId: Number,
	  item: String,
	  completed: Boolean
	}, {collection:"TodoList"});

	// the schema is useless so far
	// we need to create a model using it
	var ToDo = mongoose.model('ToDo', toDoSchema);

	
	// Select an item from TodoList collection
	// ToDo.find({item:"Gethyl"},(err,res)=>{
	// 	if (err){console.log("---Gethyl not found in ToDo" + err)}
	// 	else console.log("+++Gethyl fetched ==> " + res)
	// })	


app.listen(3000,()=> {console.log("Gethyl Express Running!!!")})

app.get('/',(req,res)=>{
	res.sendFile(__dirname + '/index.html')
})

app.post('/quotes',(req,res)=>{
	// Insert into TodoList Collection
	var todoItem = new ToDo({
		itemId:1,
		item:req.body.item,
		completed: false
	})

	todoItem.save((err,result)=> {
		if (err) {console.log("---Gethyl todoItem save failed " + err)}
		console.log("+++Gethyl todoItem saved successfully "+todoItem.item)

		res.redirect('/')
	})
})
