var express = require('express');
bodyParser = require('body-parser');
const axios = require('axios')
const multer = require('multer')
var fs = require('fs');
const FormData = require('form-data');


const upload = multer({ dest: './public/data/uploads/' })

var app = express();

app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/public'));

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

    await axios.post('http://localhost:9999/predict', req.body, {
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
            result = { "error": "error while do prediction" };
        });


    res.send(result);
});

app.get('/admin', function (req, res) {
    res.redirect('/admin/manual');
});

app.get('/admin/train', function (req, res) {
    res.render('pages/admintrain');
});

app.post('/admin/train', async function (req, res) {
    var result;

    console.log(req.body);

    await axios.post('http://localhost:9999/tmp/train', req.body, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => {
            result = response.data;
        })
        .catch(error => {
            console.log(error);
            result = { "error": "error while doing training with proviedd data" };
        });

    res.send(result);
});

app.get('/admin/test', function (req, res) {
    res.render('pages/adminpredict');
});

app.post('/admin/predict', async function (req, res) {

    var result;

    await axios.post('http://localhost:9999/tmp/predict', req.body, {
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
            result = { "error": "error while do prediction" };
        });


    res.send(result);
});

app.get('/admin/manual', function (req, res) {
    res.render('pages/adminmanual');
});

app.post('/admin/uploadcsv', upload.single('file'), async function (req, res, next) {
    try {

        var file = req.file;
        file.filename = 'tmp.csv'
        var filename = file.filename;
        var path = __dirname + '/public/csv/' + filename;

        // save multer file to public/csv
        await fs.rename(file.path, path, function (err) {
            if (err) {
                console.log(err);
                res.send({ "error": "error while saving file" });
            }
        }
        );

        res.send({ "success": "file uploaded" });

    } catch (err) {
        next(err)
    }
});



app.listen(process.env.PORT || 8080, function () {
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});
console.log('Server is listening on port 8080');