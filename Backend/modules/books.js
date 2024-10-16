const express = require('express');
const router = express.Router();
const db = require('./database');
const moment = require('moment');




router.post('/', (req, res) => {
    const { title, release, ISBN, authorID } = req.body;

    // Ellenőrizd, hogy a szükséges adatok megvannak-e
    if (!title || !release || !ISBN) {
        return res.status(400).send('Kérlek, add meg az összes szükséges adatot!');
    }

    const query = `
        INSERT INTO books (title, \`release\`, ISBN) 
        VALUES (?, ?, ?);
    `;
    db.query(query, [title, release, ISBN], (err, results) => {
        if (err) {
            console.error(err); // Hiba kiírása a konzolra
            return res.status(500).send('Hiba történt a könyv hozzáadása közben!');
        }

        // A könyv sikeres hozzáadása után
        res.status(201).send({ message: 'Könyv sikeresen hozzáadva!', bookID: results.insertId });
    });
});



//adatok lekérése
router.get('/', (req, res) => {
    db.query(`
      SELECT 
        books.title, 
        books.release, 
        books.ISBN, 
        authors.name, 
        authors.birth
        book_authors.ID as id 
      FROM books
      JOIN book_authors ON books.ID = book_authors.bookID
      JOIN authors ON book_authors.authID = authors.ID
    `, (err, results) => {
      if (err) {
        console.error(err);
        res.status(500).send('Hiba történt az adatbázis lekérés közben!');
        return;
      }
  
      const formattedResults = results.map(result => ({
        title: result.title,
        release: moment(result.release).format('YYYY-MM-DD'), 
        ISBN: result.ISBN,
        authorName: result.name,
        authorBirth: moment(result.birth).format('YYYY-MM-DD') 
      }));
  
      res.status(200).send(formattedResults);
      return;
    });
});

module.exports = router;