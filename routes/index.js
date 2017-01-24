
module.exports = function(app, db) {
   app.get('/', function(req, res, next) {
  res.render('index', { title: 'Image search' });
});
    
    require("dotenv").config();
    var imageSearch = require('node-google-image-search');
app.get("/imageSearch/:query*",function(req,res){
    var query=req.params.query;
    var offset=req.query.offset;
    var url="";
    
    if(offset) {
        url="https://images-search.herokuapp.com/imageSearch/"+query+offset;
    }
    else{
        url="https://images-search.herokuapp.com/imageSearch/"+query;
       
    }
     imageSearch(query, callback, 2, 10);
 
function callback(results) {
    var newArr=[];
    
    for(var i=0; i<results.length;i++){
        var obj= {
            "url": results[i].link,
            "snippet": results[i].snippet,
            "thumbnail": results[i].image.thumbnailLink,
            "context": results[i].image.contextLink
        };
        newArr.push(obj);
         }
         var obj1={
            "term":query,
            "time": new Date().toLocaleString()
        };
        db.collection("images").save(obj1,function(err,data){
            if(err) throw err;
            console.log(data);  
        });
    res.send(newArr);
   
}
});

app.get("/latest/",function(req,res){
db.collection("images").find().limit(10).sort({
 _id: -1
}).toArray(function(err,result){
    if(err){
        throw err;
    }
    else{
        var array=[];
        for(var i=0;i<result.length;i++){
            var obj={
                "term": result[i].term,
                "time": result[i].time
        };
        array.push(obj);
        }
        res.send(array);
    }
});
});
};