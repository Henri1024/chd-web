var express = require('express');
bodyParser = require('body-parser');
const axios = require('axios')

var app = express();

app.set('view engine', 'ejs');

app.use(express.json());

app.get('/', function (req, res) {
    res.render('pages/index');
});

app.get('/about', function (req, res) {
    res.render('pages/about');
});

app.get('/help', function (req, res) {
    res.render('pages/help');
});

app.post('/predict', async function (req, res) {

    var result;

    await axios.post('https://chd-classifier.herokuapp.com/predict', req.body, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => {
            // console.log(response.data);
            result = response.data;
        })
        .catch(error => {
            // console.log(error);
            result = {"error":"error while do prediction"};
        });


    res.send(result);
});

// app.listen(8080);
app.listen(process.env.PORT || 8080, function(){
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
  });
console.log('Server is listening on port 8080');