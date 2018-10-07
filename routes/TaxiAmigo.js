var express = require('express');
var router = express.Router();
const Client = require('node-rest-client').Client;
const moment = require('moment');
const url = require('url');
const request = require('request');
const localStorage = require('node-localstorage')
var createError = require('http-errors');

//var API_URL = 'https://taxiamigodgo-api.herokuapp.com';
var API_URL = 'http://localhost:3000';
/* GET home page. */
router.get('/conductores', function(req, res, next) {
  res.render('TaxiAmigo/conductores', {
    page_title: 'Control de Conductores'
  });
});

router.get('/unidades', function(req, res, next) {
  res.render('TaxiAmigo/unidades', {
    page_title: 'Control de Unidades'
  });
});

router.get('/ingresos_create', (req, res) => {
  var client = new Client();
  var serviceName = '';
  var args = {
    headers: {
      "Content-Type": "application/json"
    }
  };

  var obj = {
    page_title: 'Registrar Nuevos Ingresos',
    current_week: moment().format('w'),
    current_year: moment().format('YY'),
    post_result: 'info'
  };

  if (req.query.update === 'yes') {
    if (req.query.income === 'cuota') {
      serviceName = '/cuotas';
      args.data = req.query;

      var serviceUrl = url.parse(`${API_URL}${serviceName}`);

      client.post(serviceUrl, args, (data, response) => {
        if (!data.status) {
          obj.post_result = 'success';
          obj.post_comments_title = `Cuota Registrada Exitosamente - (${moment().format('D/MMM/YYYY h:mm a')})`;
          obj.post_comments_content = `Pago de $${req.query.cantidad} pesos registrado de la unidad ${req.query.unidad}.`;
          res.render('TaxiAmigo/ingresos_create.hbs', obj);
        } else {
          obj.post_result = 'danger';
          obj.post_comments_title = 'Registro Duplicado';
          obj.post_comments_content = `Ya se ha registrado un Pago de Cuota para la Unidad ${req.query.unidad} para el periodo ${req.query.periodo}`;
          res.render('TaxiAmigo/ingresos_create.hbs', obj);
        }
      }).on('error', (err) => {
        obj.post_result = 'warning';
        obj.post_comments_title = 'Error al guardar la CUOTA';
        obj.post_comments_content = `Por favor vuelva a intentarlo y reporte el siguiente error: ${err}`;
        res.render('TaxiAmigo/ingresos_create.hbs', obj);
      });
    } else {
      serviceName = '/penalizaciones';
      args.data = req.query;

      var serviceUrl = url.parse(`${API_URL}${serviceName}`);

      client.post(serviceUrl, args, (data, response) => {
        obj.post_result = 'success';
        obj.post_comments_title = `Penalización Registrada Exitosamente - (${moment().format('D/MMM/YYYY h:mm a')})`;
        obj.post_comments_content = `Pago de $${req.query.cantidad} pesos registrado de la unidad ${req.query.unidad}.`;
        res.render('TaxiAmigo/ingresos_create.hbs', obj);
      }).on('error', (err) => {
        obj.post_result = 'warning';
        obj.post_comments_title = 'Error al guardar la PENALIZACION';
        obj.post_comments_content = `Por favor vuelva a intentarlo y reporte el siguiente error: ${err}`;
        res.render('TaxiAmigo/ingresos_create.hbs', obj);
      });
    }
  } else {
    res.render('TaxiAmigo/ingresos_create.hbs', obj);
  };
});


router.get('/ingresos_cuota_view', (req, res, next) => {

  request({
    url: `${API_URL}/amigoCuotas`,
    json: true,
    headers: {
     'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImVtbWFudWVsIiwidXNlcklkIjoiNWJiM2NkZGIyZWRiZGMxZWNlMTg4YmQ0IiwiaWF0IjoxNTM4NzY3Mjg1LCJleHAiOjE1Mzg3NzA4ODV9.J50t0EdbEAZ1OvzQIXlH458hY0EtLkGuRHw_0Zyw9dI'
  },
  }, (error, response, body) => {
    console.log("ERROR: ", error);
    console.log("RESPONSE: ", response);
    console.log("BODY: ", body);
    if(error){
      res.render('global/error', {
        message: error
      });
    }else{
      if(body.message === 'Auth failed'){
        res.render('global/error', {
          message: 'Accede para tener acceso a este recurso'
        });
      }else{
        var cuotas = body;

        cuotas.map((cuota) => cuota.fecha = moment(cuota.fecha).format('D/MMM/YYYY h:mm a'));

        var data = {
          cuotas,
          page_title: 'Consultar Ingresos - CUOTAS',
          current_week: moment().format('w'),
          current_year: moment().format('YY')
        };

        //console.log('Data: ', data);
        res.render('TaxiAmigo/cuota_view.hbs', data);
      }
    }
  });
});

router.get('/ingresos_penalizacion_view', (req, res, next) => {
  request({
    url: `${API_URL}/amigoPenalizaciones`,
    json: true
  }, (error, response, body) => {
    if(body.message === 'Auth failed'){
      res.render('global/error', {
        message: 'Accede para tener acceso a este recurso'
      });
    }else{

        var penalizaciones = body.penalizaciones;

        penalizaciones.map((penalizacion) => penalizacion.fecha = moment(penalizacion.fecha).format('D/MMM/YYYY h:mm a'));

        var data = {
          penalizaciones,
          page_title: 'Consultar Ingresos - PENALIZACIONES',
          current_week: moment().format('w'),
          current_year: moment().format('YY')
        };

        res.render('TaxiAmigo/penalizacion_view.hbs', data);

    }

  });
});

router.get('/egresos', function(req, res, next) {
  res.render('TaxiAmigo/egresos', {
    page_title: 'Control de Egresos'
  });
});
module.exports = router;
