var express = require("express");
var app     = express();
var path    = require("path");
var bodyParser = require("body-parser");
var router = express.Router();
const nodemailer = require("nodemailer");
var exec = require("child_process").exec, child;





const sqlite3 = require("sqlite3").verbose();
let db = new sqlite3.Database("./resources/DrugPorter.db",(err)=>{
	if(err){
		console.error(err.message);
	}else{
		console.log("connected to database");
	}
});


var transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'danis.cao.xuan@gmail.com',
    pass: '554daniscaoxuan'
  }
});

app.use(express.static( "publicFile" ));
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json())
//app.use(express.static(path.join(__dirname, "HTML_Layout")));
app.set('view engine', 'ejs')



// Main routes

app.get("/",function(req,res){
    //res.sendFile(path.join(__dirname+"/HTML_Layout/mainPage.html"));
    res.render("mainPage");
})

app.get("/prediction",function(req,res){
	var data = [
		{ result: 'null' },
  		{ result: 'null' },
  		{ result: 'null' },
  		{ result: 'null' },
  		{ result: 'null' },
  		{ result: 'null' },
  		{ result: 'null' },
  		{ result: 'null' },
  		{ result: 'null' },
  		{ result: 'null' }
	];
	res.render("Prediction",{data:data});
})

// callback function for all prediction
function getResult(smileString,callback){
	var smileString = smileString.replace("\t","");
	var smileString = "'"+ String(smileString) +"'";
	child = exec('java -jar ./resources/DrugPorter/test.jar '+ smileString,
	function(err,stdout,stderr){
		if(err){
			//console.log(err);
			return callback(err);
		}
		else{
			return callback(stdout);
		}
	})
};

app.post("/prediction",function(req,res){
	var smileString = req.body.smileString;
	var transporter = ["MDR1", "ABCG2", "SLC22A6", "SLCO1B1", "SLC22A8", "ABCC2", "SLC22A1", "SLCO1A2", "SLC22A2", "ABCC1"];
	var data =[];

	
	var reuslt = getResult(smileString,function(response){
		//console.log(response); // this return the value from getResult
		if (typeof response != "string"){
			res.render("SMILESerror",{response:response});

		}

		var separate_result = response.split(",");
		for(var i = 0; i < separate_result.length; i++){
			prediction_result = separate_result[i].replace(/\n|\r/g, "");
			var temp = {result: prediction_result};

			data.push(temp);
		}
		data.push({smiles:smileString});
		res.render("Prediction",{data:data});
	});
});


app.get("/database",function(req,res){
	var data = [];

	db.serialize(() => {
		
  		db.each(`SELECT * FROM Transporter`, function(err, row){
    		if (err) {
      			console.error(err.message);
    		}

    		var TransporterID = row.TransporterID;
    		var TransporterProteinName = row.TransporterProteinName;
    		var TransporterGeneName = row.TransporterGeneName;
    		//var Synonyms = row.Synonyms;
    		var temp = {TransporterID,TransporterProteinName,TransporterGeneName};
    		
    		data.push(temp);
    		// console.log(data);

  		},function(){
  			res.render("Database",{data:data});
  			//console.log(data);
  		});
  		
	});
})

//SHOW Routes
//Callback function for TransporterPage




app.get("/database/:TransporterID", function(req,res){
	var TransporterID = req.params.TransporterID;
	var TransporterName = undefined;
	var metabolites = undefined;
	var data = [];


	function getChemicalData(TransporterID,Type,callback){
		// console.log("getMetabolite TransporterID"+TransporterID);
		db.all(`SELECT * FROM Compound where TransporterID = ? and CompoundType = ?`,[TransporterID,Type],function(err,rows){
			callback(rows);
		});
	};

	function finishedRequest(metabolites,data,TransporterName){
		res.render("SingleTransporter",{data:data,TransporterName:TransporterName,metabolites:metabolites});
	}
	//var Metabolite = null;
	//console.log(TransporterID);
	db.all("SELECT TransporterProteinName FROM Transporter where TransporterID = ?",TransporterID, function(err, rows){
        rows.forEach((row) => {
            TransporterName = row.TransporterProteinName;
        });
	});

	getChemicalData(TransporterID,"Metabolite",function(response){
		metabolites = response;
		getChemicalData(TransporterID,"Drug",function(drug_response){
			var data = drug_response;
			
			finishedRequest(metabolites,data,TransporterName);
		});

	});

	// db.serialize(() => {
		
 //  		db.each(`SELECT * FROM Compound where TransporterID = ? and CompoundType = 'Drug'`,TransporterID, function(err, row){
 //    		if (err) {
 //      			console.error(err.message);
 //    		}

 //    		var CompoundName = row.CompoundName;
 //    		var CompoundSMILES = row.CompoundSMILES;
 //    		var CompoundFunction = row.CompoundFunction;
 //    		var CompoundType =row.CompoundType
 //    		var Reference = row.Reference;
 //    		var temp = {CompoundName,CompoundFunction,CompoundType,Reference};
    		
 //    		data.push(temp);


    		

 //  		},function(){
  			
 //  			res.render("SingleTransporter",{data:data,TransporterName:TransporterName});
  			
 //  			//console.log(data);
 //  		});
  		
	// });

})


// download page : route for downloading stuff
app.get("/downloads",function(req,res){
	res.render("Downloads");
})
app.get("/resources/TrainingSet_DrugPorter.zip", function(req,res){
	var resumeFileName = __dirname + "/resources/TrainingSet_DrugPorter.zip";
	res.download(resumeFileName);
})
app.get("/resources/DrugPorter.db", function(req,res){
	var resumeFileName = __dirname + "/resources/DrugPorter.db";
	res.download(resumeFileName);
})
app.get("/resources/DrugPorter_Windows.zip",function(req,res){
	var resumeFileName = __dirname + "/resources/DrugPorter_Windows.zip";
	res.download(resumeFileName);
})
app.get("/resources/DrugPorter_macOS.zip",function(req,res){
	var resumeFileName = __dirname + "/resources/DrugPorter_macOS.zip";
	res.download(resumeFileName);
})






app.get("/contactus",function(req,res){
	res.render("ContactUs");
})
app.post("/contactus",function(req,res){
	var obj = req.body;
	var firstname = obj.firstname;
	var lastname = obj.lastname;
	var email = obj.email;
	var message = obj.message;
	var mailOptions = {
		from: email,
		to:'danis.cao.xuan@gmail.com',
		subject:'from DrugPorter',
		text:message
	}
	transporter.sendMail(mailOptions,function(err,info){
		if(err){
			console.log(err);
			res.redirect("/contactus");
		}else{
			console.log("mails has been sent");
			res.redirect("/contactus");
		}
	})
	
})

app.get("/modelStats",function(req,res){
	res.render("ModelStats");
})

app.listen(3000,function(){
    console.log("server started");
})

