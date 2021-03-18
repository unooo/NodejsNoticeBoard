var express = require('express');
var router = express.Router();
let PhotoPost = require('../model/photoPost');
let HashTags = require('../model/hashTag');
let hashTagParse = require('../lib/hashTagParse');
const { isLoggedIn } = require('./middlewares');
const multer = require('multer');
var fs = require('fs');
var path = require('path');
try {
    fs.readdirSync('public/images/upload');
} catch {
    fs.mkdirSync('public/images/upload');
}



const upload = multer({
    storage: multer.diskStorage({
        destination(req, file, done) {
            done(null, 'public/images/upload');
        },
        filename(req, file, done) {
            const ext = path.extname(file.originalname);
            done(null, path.basename(file.originalname, ext) + Date.now() + ext);
        },
    }),
    limits: { fileSize: 5 * 1024 * 1024 },
})


//목록보기
router.get('/', async function (req, res, next) {
    let photos = await PhotoPost.find({}).populate('hashTag');
    res.render('gallery.ejs',{
        photos,
        searchTag:null,
    });
});


//쓰기화면 렌더
router.get('/galleryPage', isLoggedIn, async function (req, res, next) {

    res.render('galleryPage.ejs', {
        mode: 'create',
        photo: { writer: req.user.id },
        isMine: false,
    });

});

//상세조회화면 렌더
router.get('/galleryPage/:photoId', isLoggedIn, async function (req, res, next) {
    let photoId=req.params.photoId;
    let photo = await PhotoPost.findById(photoId).populate('hashTag');
    let isMine=false;
    console.log(req.user.id,photo.writer);
    if (req.user.id==photo.writer){
        isMine=true
    }
    res.render('galleryPage.ejs', {
        mode: 'read',
        photo,
        isMine,
    });

});
//쓰기
router.post('/galleryPage', isLoggedIn, upload.array("myImg"), async function (req, res, next) {
    let fileName = req.files[0].filename;
    let hashTagResult=await hashTagParse(req);
    
    let photoPost = new PhotoPost({
        "title": fileName,
        "writer": req.body.writer,
        "hashTag":hashTagResult,
    })
    await photoPost.save();
    res.redirect('/gallery');


});
//수정 
router.put('/galleryPage/:galleryId', isLoggedIn,upload.array(), async function (req, res, next) {
    let post = req.body;
    let galleryId=req.params.galleryId;
    let hashTagResult=await hashTagParse(req);
    PhotoPost.findByIdAndUpdate(galleryId,{
        hashTag:hashTagResult,
        createdAt:new Date().toISOString(),
    }).then(resolve=>{
        res.send("ok");
    }).catch(err=>{
        res.send("no"); 
    })
});
router.patch('/galleryPage/:galleryId', isLoggedIn,upload.array("myImg"), async function (req, res, next) {
    let post = req.body;
    let galleryId=req.params.galleryId;
    let fileName = req.files[0].filename;
    let hashTagResult=await hashTagParse(req);
    PhotoPost.findByIdAndUpdate(galleryId,{
        "title": fileName,
        hashTag:hashTagResult,
        createdAt:new Date().toISOString(),
    }).then(resolve=>{
        res.send("ok");
    }).catch(err=>{
        res.send("no"); 
    })
});
//삭제
router.delete('/galleryPage/:galleryId', isLoggedIn,upload.array(), async function (req, res, next) {
    let galleryId=req.params.galleryId;
  
    PhotoPost.findByIdAndDelete(galleryId).then(resolve=>{
        res.send("ok");
     }).catch(err=>{
         res.send(err);
     })
});
//해시태그검색
router.get('/hashTagSearch/:hashTagTitle', async function (req, res, next) {
    let hashTagTitle=req.params.hashTagTitle;
    // let hashTagId= await HashTags.findOne({title:hashTagTitle},{"_id":true});
    PhotoPost.find({}).populate('hashTag').then(rsv=>{
        let photos=rsv.filter(item=>{
            
            let len = item.hashTag.length;
            for(let i = 0 ; i < len ; i ++){
                if(item.hashTag[i].title.includes(hashTagTitle)){
                    return true;
                }
            }
        });
        res.render('gallery.ejs',{
            photos:photos,
            searchTag:hashTagTitle,
        });
    }).catch(err=>{
        res.send(err);
    });
});
router.get('/hashTagSearch/:hashTagTitle/:hashTagId', async function (req, res, next) {
    let hashTagId=req.params.hashTagId;
    let hashTagTitle=req.params.hashTagTitle;
    
    PhotoPost.find({
        hashTag:hashTagId
    }).populate('hashTag').then(rsv=>{
        res.render('gallery.ejs',{
            photos:rsv,
            searchTag:hashTagTitle,
        });
    }).catch(err=>{
        res.send(err);
    });
});

module.exports = router;