var express = require('express');
var router = express.Router();
const Client = require('node-rest-client').Client;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('global/home', { title: 'Sistema de Control de Finanzas' });
});

router.get('/login', (req, res, next)=>{
    res.render('global/login');
});

router.get('/validation', (req, res, next)=>{
  var client = new Client();
  var serviceName = '';
  var args = {
    headers: {
      "Content-Type": "application/json"
    }
  };
  res.render('test', {
    output: req.body
  });
});

module.exports = router;
