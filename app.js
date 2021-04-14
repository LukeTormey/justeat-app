var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

//security
var SqlString = require('sqlstring');
var sanitizeHtml = require('sanitize-html');
const bcrypt = require('bcrypt');
const saltRounds = 10;

var session = require('express-session')
var mysql = require('mysql')
var app = express();



app.use(session({ secret: 'keyboard cat', cookie: { maxAge: 60000 }}))
 
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);



app.get('/getSomething', function(req, res, next) {
  res.send('hello' + req.body.username);
});



app.post('/login',function(req,res){
	
    // catching the data from the POST
    var user_name=req.body.username;
    var pass = req.body.password;
    
    
	console.log("User name = "+ user_name);
    console.log("Password = "+ pass);
    
    // Connect to the database
    var mysql = require('mysql')
    var connection = mysql.createConnection({
      host     : 'localhost',
      user     : 'root',
      password : '',
      port : 3306,
      database : 'justeat'
    });

    connection.connect()

    connection.query('SELECT * from users WHERE username = "'+user_name+'" AND password = "'+pass+'"', function (err, rows, fields) {
      if (err) throw err
      for(var i=0; i< rows.length; i++){
           console.log('Acc type: ', rows[i].acctype)
           res.send(rows[i].acctype); // send the account type back to jQuery mobile.
      }
    })

    connection.end()

    
    
	
});

//get order data
app.post('/getData',function(req,res){
 
 
 
    // Connect to the database
    var mysql = require('mysql')
    var connection = mysql.createConnection({
      host     : 'localhost',
      user     : 'root',
      password : '',
      port : 3306,
      database : 'justeat'
    });
 
    connection.connect()
 
    connection.query('SELECT * from orders', function (err, rows, fields) {
      if (err) throw err
      var output = '';
      for(var i=0; i< rows.length; i++){
 
           output = output + rows[i].ordercontent  + '<br>'; 
	       var order = rows[i].ordercontent  + '<br>';
      }
      res.send(output);
 
    })
 
    connection.end()
 
 
 
 
});

//get user accounts 
app.post('/getDataUser',function(req,res){
 
 
 
    // Connect to the database
    var mysql = require('mysql')
    var connection = mysql.createConnection({
      host     : 'localhost',
      user     : 'root',
      password : '',
      port : 3306,
      database : 'justeat'
    });
 
    connection.connect()
 
    connection.query('SELECT * from users', function (err, rows, fields) {
      if (err) throw err
      var output = '';
      for(var i=0; i< rows.length; i++){
 
           output = output + rows[i].username  + '<br>'; 
	       var user = rows[i].username  + '<br>';
      }
      res.send(output);
 
    })
 
    connection.end()
 
 
 
 
});

//get stock info
app.post('/getDataStock',function(req,res){
 
 
 
    // Connect to the database
    var mysql = require('mysql')
    var connection = mysql.createConnection({
      host     : 'localhost',
      user     : 'root',
      password : '',
      port : 3306,
      database : 'justeat'
    });
 
    connection.connect()
 
    connection.query('SELECT * from products', function (err, rows, fields) {
      if (err) throw err
      var output = '';
	  var output2 = '';
      for(var i=0; i< rows.length; i++){
 
           output = output + rows[i].product  + '<br>'; 
	       var prod = rows[i].product  + '<br>';
      }
      res.send(output);
 
    })
 
    connection.end()
 
 
 
 
});

//register query 
app.post('/register',function(req,res){


  // catching the data from the POST

  var RegUser = req.body.username;

  var RegPass = req.body.password;

  var RegAccT = 'customer';
	
	var error = '';
	
	// user checks 
	if(RegUser == "" || RegUser == null){
		error = error + "Please enter a username "; 
		}
		if(RegUser.length < 8){
		error = error + "Please enter a username with at least 8 characters";
		}
		if(RegUser.length > 25){
		error = error + "Please enter a username with less than 25 characters";
		}
		
	// password checks 
	if(RegPass == "" || RegPass == null){
		error = error + "Please enter a password "; 
		}
		if(RegPass.length < 8){
		error = error + "Please enter a password with at least 8 characters";
		}
		if(RegPass.length > 25){
		error = error + "Please enter a password with less than 25 characters";
		}
	// security cleaning 
	RegUser = sanitizeHtml(RegUser);
	//cleans javascript so that cannot be registed as a username 
	
	if(error) {
		res.send(error);
	}
	else{
		password hashing
        bcrypt.hash(RegPass, saltRounds, function(err, hash) {
			if(err) { throw err; }
	else{
	RegPass = hash;
	
    console.log("Username = "+ RegUser);

    console.log("Password = "+ RegPass);


  // Connect to the database

  var mysql = require('mysql')

  var connection = mysql.createConnection({

    host     : 'localhost',

    user     : 'root',

    password : '',

    port : 3306,

    database : 'justeat'

  });


  connection.connect()

  var sql = "INSERT INTO users (username, password, acctype) VALUES ('"+RegUser+"' , '"+RegPass+"', '"+RegAccT+"')";

  console.log(sql);

  connection.query(sql);
			}
		});
	}
}); //end of regis




//update query 
app.post('/updatedstock',function(req,res){


  // catching the data from the POST

  var order = req.body.order;

  var qty = req.body.qty;

  // Connect to the database

  var mysql = require('mysql')

  var connection = mysql.createConnection({

    host     : 'localhost',

    user     : 'root',

    password : '',

    port : 3306,

    database : 'justeat'

  });


  connection.connect()

  var sql = "UPDATE `justeat`.`products` SET `qty`='"+qty+"' WHERE  `product`='"+order+"';";

  console.log(sql);

  connection.query(sql);

}); //end of regis
//save order query 
app.post('/saveOrder',function(req,res){
 
  // catching the data from the POST
  var shopping = req.body.items;
 
 
  // Connect to the database
  var mysql = require('mysql')
  var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '',
    port : 3306,
    database : 'justeat'
  });
 
  connection.connect();
   var sql = "INSERT INTO orders (`ordercontent`, `total`) VALUES ('"+shopping+"','1');";
   console.log(sql);
  connection.query(sql);
 
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});




module.exports = app;
