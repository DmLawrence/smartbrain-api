const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const validator = require('validator');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const bcrypt = require('bcrypt');
const db = require('knex')({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    port : 5432,
    user : 'postgres',
    password : 'Underpants1$',
    database : 'smart-brain'
  }
});


const app = express();

app.use(bodyParser.json());
app.use(cors())

app.get('/', (req, res)=> {	res.send('Success') })

app.post('/signin', signin.handleSignin(db, bcrypt, validator))

app.post('/register', register.handleRegister(db, bcrypt, validator))

app.get('/profile/:id', profile.handleProfileGet(db))

app.put('/image', image.handleImage(db))

app.post('/imageurl', (req, res) => {image.handleApiCall(req, res)})

app.listen(process.env.PORT || 3000, () => {
	console.log(`app is running on port ${process.env.PORT}`);
})
