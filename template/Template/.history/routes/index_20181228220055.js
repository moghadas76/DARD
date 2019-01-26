var express = require('express');
var mysql = require('mysql')


var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'm13761376',
    database : 'size'
  });


  connection.connect();
  
  connection.query('SELECT * from person ORDER BY dick_length DESC', function (error, results, fields) {
    if (error) throw error;
    console.log('The solution is: ', results[0]['id']);
    res.render('index', { title: 'Express',item : results});
  });
  connection.end();
  
});

router.post('/',function(req, res, next) {
  var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'm13761376',
    database : 'size'
  });
  connection.connect();
  console.log(req.body.name);
  connection.query("INSERT INTO `person` (`name`, `dick_length`) VALUES ('"+req.body.name+"','"+req.body.size+"');", function (error, results) {
    if (error) throw error;
    console.log("ok:)");
    res.redirect('/');
  });
  connection.end();


});
  

module.exports = router;

