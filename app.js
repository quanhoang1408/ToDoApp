var express = require('express');
let app = express();

app.get("/", function(req,res){
    res.send("<h1>Hello</h1>")
})

app.listen(5001,function(){
    console.log("Listening on port 5001!");
});