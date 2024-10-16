const express = require('express');
const router = express.Router();
const db = require('./database');
const moment = require('moment');

router.post('/', (req, res) => {
    const { title, release, ISBN, authorID } = req.body;

    // Ellenőrizd, hogy a szükséges adatok megvannak-e
    if (!title || !release || !ISBN || !authorID) {
        return res.status(400).send('Kérlek, add meg az összes szükséges adatot!');
    }

    // 1. Könyv hozzáadása a 'books' táblához
    const bookQuery = `
        INSERT INTO books (title, \`release\`, ISBN) 
        VALUES (?, ?, ?);
    `;
    db.query(bookQuery, [title, release, ISBN], (err, results) => {
        if (err) {
            console.error(err); // Hiba kiírása a konzolra
            return res.status(500).send('Hiba történt a könyv hozzáadása közben!');
        }

        const newBookID = results.insertId;

        // 2. Kapcsolat létrehozása a 'book_authors' táblában
        const bookAuthorQuery = `
            INSERT INTO book_authors (authID, bookID) 
            VALUES (?, ?);
        `;
        db.query(bookAuthorQuery, [authorID, newBookID], (err) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Hiba történt a könyv és az író összekapcsolása közben!');
            }

            // 3. A könyv és író sikeres összekapcsolása után
            res.status(201).send({ message: 'Könyv sikeresen hozzáadva!', bookID: newBookID });
        });
    });
});

// Adatok lekérése
router.get('/', (req, res) => {
    db.query(`
      SELECT 
        books.title, 
        books.release, 
        books.ISBN, 
        authors.name, 
        authors.birth,
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
