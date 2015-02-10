/**
 * This file provided by Facebook is for non-commercial testing and evaluation purposes only.
 * Facebook reserves all rights not expressly granted.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * FACEBOOK BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
 * ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

var fs = require('fs');
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var cheerio = require('cheerio');
var request = require('request');

var comments = JSON.parse(fs.readFileSync('_comments.json'));

app.use('/', express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/comments.json', function(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(comments));
});

app.post('/comments.json', function(req, res) {
  comments.push(req.body);
  fs.writeFile('_comments.json', JSON.stringify(comments))
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(comments));
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
  var i = 3;
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

app.listen(3000);

console.log('Server started: http://localhost:3000/');
