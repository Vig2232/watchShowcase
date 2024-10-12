const express = require('express')
const app = express();
const config = require('./config.json')
const sequelize = require('./sequelize')
const routes = require('./src/routes')
const bodyParser = require('body-parser')
const path = require('path')
const { categoryInsert } = require('./src/helper/functions')

sequelize.init()

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
});

//Insert the categories
categoryInsert();

app.use('/public', express.static(path.join(__dirname, 'public')))

app.use(bodyParser.json({ extended: true, limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use(routes)

app.get('/', (req, res) => res.send('Hello world'))

app.listen(config.Server_port, () => {
    console.log(`server listen in ${config.Server_port}`)
})