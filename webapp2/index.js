/**
 * Created by techmaster on 2/5/17.
 */
const express = require('express');
const app = express();
const nunjucks = require('nunjucks');
const request = require("request");

const bodyParser = require("body-parser");
const jwt = require('jsonwebtoken');

const passport = require("passport");
const passportJWT = require("passport-jwt");

const ExtractJwt = passportJWT.ExtractJwt;
const JwtStrategy = passportJWT.Strategy;


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


const jwtOptions = {};
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeader();
jwtOptions.secretOrKey = 'tasmanianDevil';

//Đây là hàm decode JWT token
const strategy = new JwtStrategy(jwtOptions, (jwt_payload, next) => {
  // Đoạn này sẽ phải gọi sang auth app
  let id = jwt_payload.id;


  if (Math.floor(Date.now() / 1000) < jwt_payload.exp) { //JWT token is not expired
    //Call to authentication service
    request.get({url: `http://localhost:3001/getuser/${id}`, json: true},
      (err, response, body) => {
        next(null, body);
      }
    );
  } else {
    let session = req.session;
    session.login = false;
    console.log('JWT token is expired');
  }
});

app.use('/public', express.static('public'));

passport.use(strategy);
app.use(passport.initialize());

// parse application/x-www-form-urlencoded
// for easier testing with Postman or plain HTML forms
app.use(bodyParser.urlencoded({
  extended: true
}));



// Set Nunjucks as rendering engine for pages with .html suffix
app.engine('html', nunjucks.render);
app.set('view engine', 'html');


app.get('/', (req, res) => {
  let session = req.session;
  if (session.login === true) {
    res.render('index.html', {login: true});
  } else {
    res.render('index.html', {login: false});
  }

});

//Allow Authorization callback after user logins successfully
app.post('/callback', (req, res) => {

});

app.get('/login', (req, res) => {
  res.render('login.html', {login: false});
});

//Hứng sự kiện login của user
app.post("/", (req, res) => {
  //Call to Auth service
  request.post({
      url: 'http://localhost:3001/login',
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

//Hàm này yêu cầu bảo mật, có một middle ware đứng giữa passport.authenticate
//Session = false để lần nào request cũng phải authenticate chứ không kiểm tra user có trong session
app.post("/secret", passport.authenticate('jwt', {session: false}), (req, res) => {
  const agents = [{name: "John Borokovic"}, {name: "Tim Henderson"}, {name: "Skiel Ivanovik"}];
  res.json(agents);
});


app.get('/logout', (req, res) => {
  let session = req.session;
  session.login = false;
  res.render('logout.html');
});

app.listen(3000, () => {
  console.log('CIA Agent listens at port 3000');
});