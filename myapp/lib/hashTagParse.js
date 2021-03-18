
let HashTags = require('../model/hashTag');
module.exports=async function(req){
    let hashTagStr=req.body.hashTag;
    let hashTagStrAry=null;
    let hashTagResult=null;
    if(hashTagStr==''||hashTagStr==null){
        hashTagResult=null;
    }else{
        hashTagStrAry=hashTagStr.match(/#[^\s#]+/g);
         hashTagResult=await Promise.all(
            hashTagStrAry.map(tag=>{
                return HashTags.findOrCreate({
                    title:tag.slice(1).toLowerCase(),
                });
            })
        )
        hashTagResult=hashTagResult.map(item=>{
            console.log('_id',item);
            return item.doc;
        })

    }
    return hashTagResult;
}