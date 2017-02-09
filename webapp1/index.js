/**
 * Created by techmaster on 2/6/17.
 */
const express = require('express');
const app = express();
const nunjucks = require('nunjucks');
const request = require("request");

const bodyParser = require("body-parser");
const jwt = require('jsonwebtoken');




//https://codeforgeek.com/2014/09/manage-session-using-node-js-express-4/
const session = require('express-session');
app.use(session({secret: 'JackCodeHammer', resave: false, saveUninitialized: true, cookie: {secure: true}}));

//Cấu hình nunjucks
nunjucks.configure('views', {
  autoescape: true,
  cache: false,
  express: app,
  watch: true
});


app.use('/public', express.static('public'));

// parse application/x-www-form-urlencoded
// for easier testing with Postman or plain HTML forms
app.use(bodyParser.urlencoded({
  extended: true
}));



// Set Nunjucks as rendering engine for pages with .html suffix
app.engine('html', nunjucks.render);
app.set('view engine', 'html');


app.get('/', (req, res) => {
  res.render('index.html');
});


//Hứng sự kiện login của user
app.post("/", (req, res) => {
  //Call to Auth service
  request.post({
      url: 'http://localhost:8080/api/login',
      form: {
        name: req.body.name,
        password: req.body.password
      }
    },
    (err, response, body) => {
      if (response.statusCode == 200) {
        let data = JSON.parse(body);
        let session = req.session;
        session.login = true;

        //JWT token được trả về browser ở tham số token. Browser sẽ lưu token sử dụng HTML5 storage
        res.render('index.html', {login: true, name: req.body.name, avatar: data.avatar, token: data.token});
      } else {
        res.render('index.html', {login: false});
      }
    });
});

app.listen(3000, () => {
  console.log('Web App 1 listens at 3000');
});