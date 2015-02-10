var express = require('express');
var request = require('request');
var tough = require('tough-cookie');
var cheerio = require('cheerio');
var path = require('path');
var bodyParser = require('body-parser');
var app = express();

// view engine setup
app.set('view engine' , 'jade');

app.use('/',function( req, res, next){
    res.sendFile(__dirname + '/public/index.html');
    
} );
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.post('/grades', function(req, res){
  var cookieJar = request.jar();
  var options = { url: 'http://micampus.mxl.cetys.mx/portal/auth/portal/default/default?loginheight=0', jar: cookieJar};
  var postForm  = {j_username: 'm026221', j_password: 'xwz1lop8'};
  var postOptions = {
    url: 'http://micampus.mxl.cetys.mx/portal/auth/portal/default/j_security_check',
    form: postForm , 
    jar: cookieJar,
    headers: {
      'Referer': 'http://micampus.mxl.cetys.mx/portal/auth/portal/default/default?loginheight=0',
    },
    followAllRedirects: true
  };
  var getOptions= {
    url: 'http://micampus.mxl.cetys.mx/portal/auth/portal/default/Academico/Consultar+boleta', 
    jar: cookieJar
  };
  var i = 4;
  var j = 8;

  function Course(name) {
    this.name = name;
    this.grades = [];
  }

  request(options, function (error, response, body) {
    if (!error && response.statusCode === 200) {

      request.post(postOptions, function(err, response, body){

        request.get(getOptions, function(err, response, body){

          var $ = cheerio.load(body);
          var rows = $('table.alumnos-tabla').children();
          var jsonResponse = {courses: []};

          for(; i < rows.length; i++){
            var name = rows.eq(i).children().first().text();
            var course = new Course(name);

            for(j = 8; j < 13; j++){
              var grade = rows.eq(i).children().eq(j).text();
              course.grades.push(grade);
            }
            jsonResponse.courses.push(course);
          }
          console.log(JSON.stringify(jsonResponse));
          res.send(JSON.stringify(jsonResponse));
          
        });
      });
    }
  });
  
});

app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

app.listen(3000,function(){
  
});


module.exports = app;
