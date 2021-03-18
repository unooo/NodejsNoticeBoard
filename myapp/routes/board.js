var express = require('express');
var router = express.Router();
let Post = require('../model/post');
let HashTags = require('../model/hashTag');
let hashTagParse = require('../lib/hashTagParse');
const { isLoggedIn } = require('./middlewares');
var multer = require('multer');
var upload = multer();
//상세보기
router.get('/post/:postId',isLoggedIn,async function(req,res,next){
    let postId=req.params.postId;
    let postItem = await Post.findById(postId).populate('hashTag');
    let isMine =false;
    if(postItem.writer==req.user.id){
        isMine=true;
    }
    res.render('postPage.ejs',{
        mode:'read',
        post:postItem,
        isMine,
    });
})
//검색기능
router.get('/:option/:searchTxt', async function(req, res, next) {
    let option=req.params.option;
    let searchTxt=req.params.searchTxt;
    var posts=[];
    if (option == 'hashTag') {   
        let rsv =await Post.find({}).populate('hashTag');
        posts=rsv.filter(item=>{            
            let len = item.hashTag.length;
            for(let i = 0 ; i < len ; i ++){
                 
                if(item.hashTag[i].title.includes(searchTxt)){
                    return true;
                }
            }
        });
       
    } else {
        posts = await Post.find({
            [option]: new RegExp(searchTxt, "i"),
        });
    }
 
    console.log('thishishti',posts)
    let query = req.query.list;
    if(query){
        res.render('board.ejs',{posts});
    }else{
        res.send(posts);
    }
    
     
});

//목록보기
router.get('/', async function(req, res, next) {
    let posts= await Post.find({});
    console.log('디버그 콘솔에 남겨지는 형태 ',posts.toString());
  res.render('board',{
      posts,
  });
});
//수정
router.patch('/post/:postId',isLoggedIn,upload.array(),async function(req,res,next){
    let post= req.body;
    let postId=req.params.postId;
    let title = post.title;
    let content = post.content;
    let hashTagResult=await hashTagParse(req);
    let writer = req.user.id;
    console.log('postId',postId);
    await Post.findByIdAndUpdate(postId,{
        title,
        content,
        hashTag:hashTagResult,
        createdAt:new Date().toISOString(),
    });
 
    res.send("ok");
});
//삭제
router.delete('/post/:postId',isLoggedIn,upload.array(),async function(req,res,next){
    let postId=req.params.postId;
    console.log(postId);
     Post.findByIdAndDelete(postId).then(resolve=>{
        res.send("ok");
     }).catch(err=>{
         res.send(err);
     })
 
    
});
//쓰기   - >   신규생성
router.post('/post',isLoggedIn,async function(req,res,next){
    let post= req.body;
    let title = post.title;
    let content = post.content;
    let writer = req.user.id;

    let hashTagResult=await hashTagParse(req);
    

    let postItem = new Post({
        title,writer,hashTag:hashTagResult,
        content
    });
    postItem.save().then(resolve=>{
        res.render('postPage.ejs',{
            mode:'read',
            post:resolve,
            isMine:'true',
        });
    }).catch(error=>{
        console.log(error);       
    });

    
})

//작성화면렌더
router.get('/renderPostPage',isLoggedIn, async function(req, res, next) {
    res.render('postPage.ejs',{
        mode:'create',
        post:{writer:req.user.id},
        isMine:false,
    });
});

module.exports = router;