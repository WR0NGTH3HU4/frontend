const express = require('express');
const router = express.Router();
const db = require('./database');
const moment = require('moment');

//új adat hozzáadása
router.post('/', (req, res) => {
    const { title, release, ISBN, authorID } = req.body;

    if (!title || !release || !ISBN || !authorID) {
        return res.status(400).send('Kérlek, add meg az összes szükséges adatot!');
    }

    const bookQuery = `
        INSERT INTO books (title, \`release\`, ISBN) 
        VALUES (?, ?, ?);
    `;
    db.query(bookQuery, [title, release, ISBN], (err, results) => {
        if (err) {
            console.error(err); 
            return res.status(500).send('Hiba történt a könyv hozzáadása közben!');
        }

        const newBookID = results.insertId;

        const bookAuthorQuery = `
            INSERT INTO book_authors (authID, bookID) 
            VALUES (?, ?);
        `;
        db.query(bookAuthorQuery, [authorID, newBookID], (err) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Hiba történt a könyv és az író összekapcsolása közben!');
            }

            res.status(201).send({ message: 'Könyv sikeresen hozzáadva!', bookID: newBookID });
        });
    });
});

//adatok betöltése
router.get('/', (req, res) => {
    db.query(`
      SELECT 
        books.title, 
        books.release, 
        books.ISBN, 
        authors.name, 
        authors.birth,
        book_authors.bookID as id 
      FROM books
      JOIN book_authors ON books.ID = book_authors.bookID
      JOIN authors ON book_authors.authID = authors.ID
    `, (err, results) => {
      if (err) {
        console.error(err);
        res.status(500).send('Hiba történt az adatbázis lekérés közben!');
        return;
      }

      // Ellenőrizd, hogy minden egyes elem tartalmazza-e az id-t
      console.log(results);  // Debugging log
      const formattedResults = results.map(result => ({
        id: result.id,  // Gondoskodj róla, hogy itt az id legyen
        title: result.title,
        release: moment(result.release).format('YYYY-MM-DD'),
        ISBN: result.ISBN,
        authorName: result.name,
        authorBirth: moment(result.birth).format('YYYY-MM-DD')
      }));

      res.status(200).send(formattedResults);
    });
});

// Könyv törlése
router.delete('/:id', (req, res) => {
    const bookID = req.params.id;

    if (!bookID) {
        return res.status(400).send('Kérlek, add meg a törlendő könyv azonosítóját!');
    }

    // Először töröljük a kapcsolódó könyv-szerző kapcsolatot
    const deleteBookAuthorQuery = `DELETE FROM book_authors WHERE bookID = ?`;
    db.query(deleteBookAuthorQuery, [bookID], (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Hiba történt a könyv-szerző kapcsolat törlésében!');
        }

        // Ezután töröljük a könyvet
        const deleteQuery = `DELETE FROM books WHERE ID = ?`;
        db.query(deleteQuery, [bookID], (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Hiba történt a könyv törlése közben!');
            }

            if (results.affectedRows === 0) {
                return res.status(404).send('A megadott könyv nem található!');
            }

            res.status(200).send({ message: 'Könyv sikeresen törölve!' });
        });
    });
});

module.exports = router;
