var express = require('express');
let app = express();
// Let app use ejs as the view engine
app.set('view engine', 'ejs');
// Let app use the public folder
app.use (express.static(__dirname + '/public'));
// Let app render the index.ejs file
app.get("/", function(req,res){
    res.render('index', {title: "ToDo App"});
})

app.listen(5001,function(){
    console.log("Listening on port 5001!");
});