var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');
let User = require('../model/user');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const passport = require('passport');
var multer = require('multer');
var upload = multer();
router.get('/', function (req, res, next) {

  if (req.isAuthenticated()) {
    res.send(`환영합니다 ${req.user.name} 님
      <p><input type='button' value='logout' onclick=location.href='./logout'>
      <input type='button' value='about' onclick=location.href='./about'>
      </p>
    `);
  } else {
    res.render('index', { title: '20141964 윤현우' });
  }
  
});

router.post('/login_process',upload.array(), function (req, res, next) {

  passport.authenticate('local', function (err, userData, info) {
    if (err) {
      console.error(err);
      return next(err);
    }

    if (!userData) {
      console.log('loginError', info.message);
      return res.render(`error`,{
        'message':info.message,
        'error':{
         status: '555',
         stack:'정확한 아이디/PW 인지 확인해주세요',
        }
      });
    }

    return req.logIn(userData, function (err) { //여기서 userData 는  serializeuser의 userData 넘겨준다
      console.log('start log in');
      if (err) { console.log(err); return next(err); }

      return res.redirect('/');
    });

  })(req, res, next);

})

router.get('/logout', function (request, response) {  
 
  request.logout();
  request.session.destroy(function (err) {  
    response.redirect('/');
  })

})

router.get('/register', function (request, response) {
  response.render('register');
});

router.post('/register_process',upload.array(), async function (request, response) {

  var post = request.body;
  var id = post.id;
  var pwd = post.pwd;
  var pwd2 = post.pwd2;
  var displayName = post.displayName;

  let checkDuplicateId = await User.findOne({ id });
  console.log('checkDuplicateId ', checkDuplicateId)
  if (checkDuplicateId) {
    response.send('이미 가입된 아이디');
    return false;
  }
  if (pwd !== pwd2) {
    response.send('비밀번호 중복 체크 실패');
    return false;
  } else {
    bcrypt.hash(pwd, 12, async function (err, hash) {

      const user = new User({
        id,
        password: hash,
        name: displayName,
      })

      user.save().then(res => {

        // request.login(user, function (err) {
        //   return response.redirect('/');
        // })
        response.send("ok");

      }).catch(error => {
        console.log(error);
        //에러처리 지금은 무조건 성공한다고 가정
      });

    });

  }

});








module.exports = router;
