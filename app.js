const express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const sqlite3 = require('sqlite3').verbose();
const PORT = process.env.PORT || 3000;
const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride('_method'))

const db = new sqlite3.Database('./db/addressBook.sqlite', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the addressBook database.');
});

db.serialize(function() {
	db.run("CREATE TABLE IF NOT EXISTS Contacts(first_name TEXT NOT NULL, last_name TEXT NOT NULL, phone_number TEXT NOT NULL, address TEXT NOT NULL)");
});

app.get('/contacts', (request, response) => {
	let sql = `SELECT * FROM Contacts`
 
	db.all(sql, [], (err, people) => {
	  if (err) {
	    throw err;
	  }
	  response.render('index', {people});
	});
});

app.post('/contacts', (request, response) => {
	const { firstName, lastName, phoneNumber, address } = request.body.person;
	const statement = db.prepare("INSERT INTO Contacts VALUES (?, ?, ?, ?)")

	statement.run(firstName, lastName, phoneNumber, address, (err) => {
		if(err) {
			throw err;
		}
	});
	response.redirect('/contacts');
});

app.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`))