var express = require('express');
var router = express.Router();
let User = require('../model/user');
/* GET users listing. */
router.get('/', async function(req, res, next) {
  let users=await User.find({},{"id":true,"name":true});
  res.send(users);
});

module.exports = router;
