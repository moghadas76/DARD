var express = require('express');
var mysql = require('mysql');
var db = require('../config/mysql');
var moment = require('moment');


var router = express.Router();

  // var connection = mysql.createConnection({
  //   host     : db.HOST,
  //   user     : db.USER,
  //   password : db.PASSWORD,
  //   database : db.DATABASE
  // });


  // connection.connect();
  
router.get('/', function(req, res, next) {
	res.render('login');
});

router.post('/', function(req, res, next) {
 	var user = req.body.user_name;
 	var pass = req.body.password;
	if (user==="admin" && pass==="admin"){
		res.redirect('/index');	
	}

});


router.post('/filter', function(req, res, next) {
	pageNum = 1;
	PER_PAGE = 10;
	skip = PER_PAGE*pageNum - PER_PAGE;
	console.log(req.body.start_date,req.body.start_time,req.body.stop_date,req.body.stop_time); 	
	var start_date = req.body.start_date + " " + req.body.start_time;
	var stop_date = req.body.stop_date + " " + req.body.stop_time;
	var from = req.body.from;
	var to = req.body.to;
	var impi = req.body.impi;
	var follow_type = req.body.follow_type;
	console.log(follow_type);
	var form_data = {start_date: req.body.start_date, start_time: req.body.start_time, stop_date : req.body.stop_date, stop_time:req.body.stop_time, from : from, to : to,impi : impi}
	var query = "SELECT SIPCallsEvent.From,SIPCallsEvent.DSId,SIPCallsEvent.StatusStr,SIPCallsEvent.To,SIPCallsEvent.CallId,SIPCallsEvent.IMPI,SIPCallsEvent.FollowId,SIPCallsEvent.FollowTypeId,SIPCallsEvent.FollowTypeStr,SIPCallsEvent.StatusCode,SIPCallsEvent.StopTime,SIPCallsEvent.StartTime,SIPCallsEvent.UEIP,SIPCallsEvent.UEPort,SIPCallsEvent.UEAgent,SIPCallsEvent.CreateTime,UNIX_TIMESTAMP(SIPCallsEvent.CreateTime) as utime FROM "+db.TABLE+" WHERE 1=1 AND StartTime between '"+start_date+"' AND '"+stop_date+"' ";
	if (from){
		query += "AND "+db.TABLE+".From LIKE '%"+from+"%' ";	
	}
	if (to){
		query += "AND "+db.TABLE+".To LIKE '%"+to+"%' ";	
	}
	if (impi){
		query += "AND "+db.TABLE+".IMPI LIKE '%"+impi+"%' ";	
	}
	
	if (follow_type=="46"){
		query += "AND "+db.TABLE+".FollowTypeId=46 ";
	}
	else if (follow_type=="1"){
		query += "AND "+db.TABLE+".FollowTypeId=1 ";
	}
	else if (follow_type=="2"){
		query += "AND "+db.TABLE+".FollowTypeId=2 ";
	}
	else if (follow_type=="3"){
		query += "AND "+db.TABLE+".FollowTypeId=3 ";
	}
	else if (follow_type=="4"){
		query += "AND "+db.TABLE+".FollowTypeId=4 ";
	}
	else if (follow_type=="47"){
		query += "AND "+db.TABLE+".FollowTypeId=47 ";
	}
	else if (follow_type=="64"){
		query += "AND "+db.TABLE+".FollowTypeId=64 ";
	}
	var EOQ = " ORDER BY StartTime DESC LIMIT "+PER_PAGE+" OFFSET "+skip +";";
	var AOQ = " ORDER BY StartTime DESC ;";
	var agr = query + AOQ;
	query += EOQ;
 	console.log(query);
	var aggregate_query = agr.replace("SIPCallsEvent.From,SIPCallsEvent.DSId,SIPCallsEvent.StatusStr,SIPCallsEvent.To,SIPCallsEvent.CallId,SIPCallsEvent.IMPI,SIPCallsEvent.FollowId,SIPCallsEvent.FollowTypeId,SIPCallsEvent.FollowTypeStr,SIPCallsEvent.StatusCode,SIPCallsEvent.StopTime,SIPCallsEvent.StartTime,SIPCallsEvent.UEIP,SIPCallsEvent.UEPort,SIPCallsEvent.UEAgent,SIPCallsEvent.CreateTime,UNIX_TIMESTAMP(SIPCallsEvent.CreateTime) as utime","count(*)");

	var connection = mysql.createConnection({
	    host     : db.HOST,
	    user     : db.USER,
	    password : db.PASSWORD,
	    database : db.DATABASE,
		dateStrings : true
	  });
	  connection.connect();
	  connection.query(query, function (error, results, fields) {
	    if (error) throw error;
		var records;
		connection.query(aggregate_query,function(error,rows,fields){
			console.log(rows);
			records = rows[0]['count(*)'];
			console.log(records);				
			res.json({ title: 'Express',item : results,pages:Math.ceil(records/PER_PAGE),current:pageNum,per_page:PER_PAGE});	
		});
	  });
	

});


router.get('/getCurrentTime',function(req, res, next){
	moment.locale();
	var cur_time = moment().format('HH:mm:ss');
	console.log(cur_time);
	res.json({current_time:cur_time});
})


router.get('/search', function(req, res, next) {
	pageNum = req.query.page;
	PER_PAGE = Number(req.query.per_page);
	skip = PER_PAGE*pageNum - PER_PAGE; 	
	var start_date = req.query.start_date + " " + req.query.start_time;
	var stop_date = req.query.stop_date + " " + req.query.stop_time;
	var from = req.query.from;
	var to = req.query.to;
	var impi = req.query.impi;
	var follow_type = req.query.follow_type;
	var form_data = {start_date: req.query.start_date, start_time: req.query.start_time, stop_date : req.query.stop_date, stop_time:req.query.stop_time, from : from, to : to,impi : impi}
	var query = "SELECT SIPCallsEvent.From,SIPCallsEvent.DSId,SIPCallsEvent.StatusStr,SIPCallsEvent.To,SIPCallsEvent.CallId,SIPCallsEvent.IMPI,SIPCallsEvent.FollowId,SIPCallsEvent.FollowTypeId,SIPCallsEvent.FollowTypeStr,SIPCallsEvent.StatusCode,SIPCallsEvent.StopTime,SIPCallsEvent.StartTime,SIPCallsEvent.UEIP,SIPCallsEvent.UEPort,SIPCallsEvent.UEAgent,SIPCallsEvent.CreateTime,UNIX_TIMESTAMP(SIPCallsEvent.CreateTime) as utime FROM "+db.TABLE+" WHERE 1=1 AND StartTime between '"+start_date+"' AND '"+stop_date+"' ";
	if (from){
		query += "AND "+db.TABLE+".From LIKE '%"+from+"%' ";	
	}
	if (to){
		query += "AND "+db.TABLE+".To LIKE '%"+to+"%' ";	
	}
	if (impi){
		query += "AND "+db.TABLE+".IMPI LIKE '%"+impi+"%' ";	
	}
	if (follow_type=="46"){
		query += "AND "+db.TABLE+".FollowTypeId=46 ";
	}
	else if (follow_type=="1"){
		query += "AND "+db.TABLE+".FollowTypeId=1 ";
	}
	else if (follow_type=="2"){
		query += "AND "+db.TABLE+".FollowTypeId=2 ";
	}
	else if (follow_type=="3"){
		query += "AND "+db.TABLE+".FollowTypeId=3 ";
	}
	else if (follow_type=="4"){
		query += "AND "+db.TABLE+".FollowTypeId=4 ";
	}
	else if (follow_type=="47"){
		query += "AND "+db.TABLE+".FollowTypeId=47 ";
	}
	else if (follow_type=="64"){
		query += "AND "+db.TABLE+".FollowTypeId=64 ";
	}
	var EOQ = " ORDER BY StartTime DESC LIMIT "+PER_PAGE+" OFFSET "+skip +";";
	var AOQ = " ORDER BY StartTime DESC ;";
	var agr = query + AOQ;
	query += EOQ;
 	console.log(query);
	var aggregate_query = agr.replace("SIPCallsEvent.From,SIPCallsEvent.DSId,SIPCallsEvent.StatusStr,SIPCallsEvent.To,SIPCallsEvent.CallId,SIPCallsEvent.IMPI,SIPCallsEvent.FollowId,SIPCallsEvent.FollowTypeId,SIPCallsEvent.FollowTypeStr,SIPCallsEvent.StatusCode,SIPCallsEvent.StopTime,SIPCallsEvent.StartTime,SIPCallsEvent.UEIP,SIPCallsEvent.UEPort,SIPCallsEvent.UEAgent,SIPCallsEvent.CreateTime,UNIX_TIMESTAMP(SIPCallsEvent.CreateTime) as utime","count(*)");


	var connection = mysql.createConnection({
	    host     : db.HOST,
	    user     : db.USER,
	    password : db.PASSWORD,
	    database : db.DATABASE,
		dateStrings : true
	  });
	  connection.connect();
	  connection.query(query, function (error, results, fields) {
	    if (error) throw error;
		var records;
		connection.query(aggregate_query,function(error,rows,fields){
			console.log(rows);
			records = rows[0]['count(*)'];
			console.log(records);				
			res.json({ title: 'Express',item : results,pages:Math.ceil(records/PER_PAGE),current:pageNum,per_page:PER_PAGE});	
		});
	  });
});


/* GET home page. */
router.get('/index', function(req, res, next) {
	/*pageNum = req.params.page;
	PER_PAGE = 5;
	skip = PER_PAGE*pageNum - PER_PAGE;
	var connection = mysql.createConnection({
    host     : db.HOST,
    user     : db.USER,
    password : db.PASSWORD,
    database : db.DATABASE,
	dateStrings : true
  });


  connection.connect();

  connection.query('SELECT * from ' + db.TABLE + ' LIMIT '+PER_PAGE+' OFFSET '+skip, function (error, results, fields) {
    if (error) throw error;
	var records;
	connection.query('SELECT count(*) FROM '+db.TABLE,function(error,rows,fields){
		console.log(rows);
		records = rows[0]['count(*)'];
		console.log(records);				
		res.render('index', { title: 'Express',item : results});	
	});
    
  });
 */
	var form = {start_date:'' , stop_date:'' , from:'' , to:'',impi:''}
	res.render('index',{item:null,form:form});
  
});

router.post('/',function(req, res, next) {
  var connection = mysql.createConnection({
    host     : db.HOST,
    user     : db.USER,
    password : db.PASSWORD,
    database : db.DATABASE
  });

  connection.connect();
  
  console.log(req.body.name);
for(var i=0;i<10000;i++)
	  connection.query("INSERT INTO `person` (`name`, `length`) VALUES ('"+i+"','"+i+"');", function (error, results) {
	    if (error) throw error;
	    console.log("ok:)");
	  });
	    res.redirect('/1');
 connection.end();


});
  
 
module.exports = router;

