const express = require('express');
const path = require('path');
const hbs = require('hbs');
require('./db/mongoose');
const teamRouter = require('./routers/teams');


//CONFIG
const app = express();
const port = process.env.PORT;
app.use(express.json());

//static files
app.use(express.static(path.join(__dirname, '../public')));

//hbs, views and partials location
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, '../templates/views'));
hbs.registerPartials(path.join(__dirname, '../templates/partials'));

//ROUTERS
app.use(teamRouter);

//ROUTES
//index
app.get('/', (req, res) => {
    res.render('index');
})


//SERVER INIT
app.listen(port, () => console.log('app listen on port ' + port));