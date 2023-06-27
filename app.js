var express = require('express');
let app = express();
// Let app use html as the view engine
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
// Let app use the public folder
app.use (express.static(__dirname + '/public'));
//let app render index.html
app.get('/', (req, res) => {
    res.render('index.html');
});
const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
    console.log(`server started on port ${PORT}`);
  });