require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express()

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extend:true}));
app.use(express.static(path.join(__dirname, '/public')));

// ######### Mongo DB ###########
mongoose.set('strictQuery', false);

const mongoAtlasUser = process.env.MONGO_ATLAS_USERNAME;
const mongoAtlasPassword = process.env.MONGO_ATLAS_PASSWORD;
const mongoConnection = "mongodb+srv://"+ mongoAtlasUser + ":" + mongoAtlasPassword + "@cluster0.eieruug.mongodb.net/simon-says-db";

// Unsure if second paramenter is needed.
mongoose.connect(mongoConnection, {useNewUrlParser: true});

// Schema 
const recordsSchema = {
	name: String,
	score: Number
}

// Model.
const Record = mongoose.model("Record", recordsSchema);

// Get top 5 records.
app.get('/API/get-records', (req, res) => {
	Record.find({}).sort({"score":-1}).limit(5).exec(function(err, foundRecords){
		res.send(foundRecords);
	});
});

// Save to Database.
app.post('/API/post-record', (req, res) => {

	const name = req.body.name;
	const score = req.body.score;
	
	const record = new Record({
		name: name,
		score: score
	});
	
	record.save();
});

app.listen(process.env.PORT || 3001, function() {
	console.log('Server running...');
})

