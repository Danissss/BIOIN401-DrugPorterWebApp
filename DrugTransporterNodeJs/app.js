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

//TODO: need to create the promises to pending for the java program to finish
let calculateResult = function(smileString){
	// console.log(smileString); smiles passed into
	child = exec('java -jar ./resources/DrugPorter/test.jar '+smileString,
	function callback(err,stdout,stderr){

		return callback(stdout);
	})

}
function getResult(smileString,callback){
	var smileString = smileString.replace("\t","");
	var smileString = "'"+ String(smileString) +"'";
	child = exec('java -jar ./resources/DrugPorter/test.jar '+ smileString,
	function(err,stdout,stderr){
		if(err){
			console.log(err);
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
		
  		db.each(`SELECT * FROM Drugs`, function(err, row){
    		if (err) {
      			console.error(err.message);
    		}
    		
    		// data.push(row.drugName);
    		var drugName = row.drugName;
    		var drugsmiles = row.drugsmiles;
    		var drugAction = row.action;
    		var transporter = row.transporter;
    		var temp = {drugName,drugsmiles,drugAction,transporter};
    		//data.push(temp);
    		data.push(temp);

    		//console.log(row.drugName + "\t" + row.drugsmiles + "\t"+row.action+"\t"+row.transporter);
  		},function(){
  			res.render("Database",{data:data});

  		});
  		
	});
	
	

	//res.render("Database");	
})



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

