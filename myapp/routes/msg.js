var express = require('express');
const { isLoggedIn } = require('./middlewares');
var router = express.Router();
let Message = require('../model/message');
var multer = require('multer');
var upload = multer();
router.get('/',isLoggedIn, function(req, res, next) {
  res.render("messageList.ejs",{
    userId:req.user.id,
  });
});

router.get('/:id/:mode',isLoggedIn, async function(req, res, next) {
    if(req.params.id!=req.user.id){
        res.status(500).send(`타인의 메세지함 접근 금지<input type="button" value="내 메세지 함으로 이동" onclick="location.href='/msg'">`);
        return;
    }
    let mode = req.params.mode;
    let messages=null;
    console.log('mode',req.body)
    if(mode=="recv"){
      messages=await Message.find({
           "receiver":req.user.id,
         });
    }else{
      messages=await Message.find({
        "sender":req.user.id,
      });
    }
    res.send(messages);
  });

  router.post('/',isLoggedIn,upload.array(), async function(req, res, next) {
   
    console.log('here',req.body);
    let msg= new Message({
       "sender":req.user.id,
       "receiver":req.body.usrs,
       "title":req.body.title,
       "content":req.body.content,
     });

     msg.save().then(rsv=>{
      res.send("ok");
     }).catch(err=>{
      res.status(500).send(`메세지추가실패<input type="button" value="내 메세지 함으로 이동" onclick="location.href='/msg'">`);
     })

  });

module.exports = router;


// let messages= await Message.find({
//   receiver:req.user.id,
// });
//res.render("messageList.ejs",messages);