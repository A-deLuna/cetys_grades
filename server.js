var fs = require('fs');
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var cheerio = require('cheerio');
var request = require('request');
var cookieParser = require('cookie-parser');

app.use(cookieParser());
app.use('/', express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.post('/login', function(req, res){
  var cookieJar = request.jar();
  var options = { url: 'http://micampus.mxl.cetys.mx/portal/auth/portal/default/default?loginheight=0', jar: cookieJar};
  var postForm  = {j_username: req.body.user, j_password: req.body.password};
  var postOptions = {
    url: 'http://micampus.mxl.cetys.mx/portal/auth/portal/default/j_security_check',
    form: postForm , 
    jar: cookieJar,
    headers: {
      'Referer': 'http://micampus.mxl.cetys.mx/portal/auth/portal/default/default?loginheight=0',
    },
    followAllRedirects: true
  };
  request(options, function (error, response, body) {
    if (!error && response.statusCode === 200) { 
      request.post(postOptions, function(err, response, body){
        var cookies;
        if(!error && response.statusCode === 200){
          cookies = cookieJar.getCookieString('http://micampus.mxl.cetys.mx/portal/auth/portal/default/Academico/Consultar+boleta').trim().split(' ');
          cookies.forEach(function(value){
            var c = value.split('=');
            var key = c[0];
            var value = c[1].slice(0,-1);
            res.cookie(key, value);
          });
          
          res.send('ok');
        }
      });
    }
  });

});

app.post('/grades', function(req, res){
  var cookieJar = request.jar();
  var options = { url: 'http://micampus.mxl.cetys.mx/portal/auth/portal/default/default?loginheight=0', jar: cookieJar};
  var postForm  = {j_username: req.body.user, j_password: req.body.password};
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
  var i = 3; // first row of table to start 
  var j = 8; // first column with grades

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

app.post('/schedule', function(req, res) {
    var cookieJar = request.jar();
    var options = {
      url: 'http://micampus.mxl.cetys.mx/portal/auth/portal/default/default?loginheight=0',
      jar: cookieJar
    };
    var postForm = {
      j_username: req.body.user,
      j_password: req.body.password
    };
    var postOptions = {
      url: 'http://micampus.mxl.cetys.mx/portal/auth/portal/default/j_security_check',
      form: postForm,
      jar: cookieJar,
      headers: {
        'Referer': 'http://micampus.mxl.cetys.mx/portal/auth/portal/default/default?loginheight=0',
      },
      followAllRedirects: true
    };
    var getOptions = {
      url: 'http://micampus.mxl.cetys.mx/portal/auth/portal/default/Academico/Horario',
      jar: cookieJar
    };
    var i = 3;
    var j = 1;

    function Course(coursecode, name, teacher, groupcode, coursetype) {
      this.coursecode = coursecode;
      this.name = name;
      this.teacher = teacher;
      this.groupcode = groupcode;
      this.coursetype = coursetype;
      this.sessions = [];
    }
    
    function Session(day, houri, hourf, room) {
      this.day = day;
      this.houri = houri;
      this.hourf = hourf;
      this.room = room;
    }
	
    request(options, function(error, response, body) {
      if (!error && response.statusCode === 200) {
        request.post(postOptions, function(err, response, body) {
          request.get(getOptions, function(err, response, body) {
            var $ = cheerio.load(body);
            var rows = $('table').eq(4).children();
            var weekday = ['Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];
            var jsonResponse = {
              courses: []
            };
            for (; i < rows.length; i++) {
              var courseinfo = rows.eq(i).children().first().children().html();

              console.log('courseinfo :' + courseinfo);

              var coursecode = courseinfo.split(/ /g)[0];

              console.log('coursecode :' + coursecode);

              var re = new RegExp(coursecode+"  ","g");
              courseinfo = courseinfo.replace(re,"");

              console.log('courseinfo :' + courseinfo);

              var name = courseinfo.split(/<br>/g)[0];
              var teacher = courseinfo.split(/<br>/g)[1];
              var groupcode = courseinfo.split(/<br>/g)[2];

              courseinfo = courseinfo.split(/<br>/g)[3];

              console.log('courseinfo :' + courseinfo);

              var coursetype = courseinfo.substring(15,courseinfo.length-4);

              var course = new Course(coursecode, name, teacher, groupcode, coursetype);

              for (j = 1; j < 7; j++) {
                var sessioninfo = rows.eq(i).children().eq(j).children().first().html();

                console.log('sessioninfo :' + sessioninfo);

                if(sessioninfo != null){
                  sessioninfo = sessioninfo.substring(19,sessioninfo.length-4);
								
                  day = weekday[j-1];
                  
                  sessioninfo = sessioninfo.split(/<br>/);
                  
                  room = sessioninfo[0];
                  
                  sessioninfo = sessioninfo[1].split(/-/);
                  
                  houri = sessioninfo[0];
                  hourf = sessioninfo[1];
                  
                  var session = new Session(day, houri, hourf, room);
                  
                  course.sessions.push(session);
                }
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

app.listen(4000);

console.log('Server started: http://localhost:4000/');
