var express =      require("express"),
    app =          express(),
    bodyParser =   require("body-parser"),
    mongoose =     require("mongoose");

mongoose.set('useUnifiedTopology',true);
mongoose.set('useNewUrlParser',true);
mongoose.connect("mongodb://localhost:27017/urlShortner");

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine","ejs");


var shortUrl;
var flag;
var longUrl="";

// Schema setup
var urlSchema = new mongoose.Schema({
    shortUrl : String,
    longUrl : String
});

var Url = mongoose.model("url",urlSchema);

app.get("/",function(req,res){
    res.redirect("/home");
});

app.get("/home",function(req,res){
    if(flag){
        flag = false;
        sendShorturl = "localhost:3000/searchUrl/" + shortUrl;
        res.render("home",{flag:true,shortUrl:sendShorturl,longUrl:longUrl});
    }
    else
        res.render("home",{flag:false,longUrl:longUrl});
});

app.post("/addUrl",function(req,res){

    Url.findOne({longUrl:req.body.longUrl},function(err,foundLongUrl){
        if(err)
            console.log(err);
        else
        {

            if(foundLongUrl===null){

                var UniqueCharacterGenerator = function (length=7) {
                       var result           = '';
                       var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
                       var charactersLength = characters.length;
                       for ( var i = 0; i < length; i++ ) {
                          result += characters.charAt(Math.floor(Math.random() * charactersLength));
                       }
                       return result;
                    }

                    longUrl = req.body.longUrl;
                    shortUrl = UniqueCharacterGenerator(7);
                    flag = true;
                    Url.create({
                        shortUrl: shortUrl,
                        longUrl: req.body.longUrl
                    },function(err,newlyCreated){
                        if(err)
                            console.log(err);
                        else
                            {
                                res.redirect("/home");
                            }
                    });

            }
            else{
                    flag = true;
                    shortUrl = foundLongUrl.shortUrl;
                    longUrl = req.body.longUrl;
                    res.redirect("/home");
                }
            }
    });


});

app.get("/searchUrl/:SearchShortUrl",function(req,res){
    Url.findOne({shortUrl: req.params.SearchShortUrl},function(err,foundUrl){
        if(err){
            console.log(err);
        }
        else
        {
            var redirectTo = foundUrl.longUrl;

            res.redirect(redirectTo);
        }
    });

});

app.listen(3000,function(req,res){
    console.log("Server start on port : 3000");
});
