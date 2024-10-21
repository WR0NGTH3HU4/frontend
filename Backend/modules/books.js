const express = require('express');
const router = express.Router();
const db = require('./database');
const moment = require('moment');

// Új adat hozzáadása
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
            return res.status(500).send(`Hiba történt a könyv hozzáadása közben: ${err.message}`);
        }

        const newBookID = results.insertId;

        const bookAuthorQuery = `
            INSERT INTO book_authors (authID, bookID) 
            VALUES (?, ?);
        `;
        db.query(bookAuthorQuery, [authorID, newBookID], (err) => {
            if (err) {
                console.error(err);
                return res.status(500).send(`Hiba történt a könyv és az író összekapcsolása közben: ${err.message}`);
            }

            res.status(201).send({ message: 'Könyv sikeresen hozzáadva!', bookID: newBookID });
        });
    });
});

// Adatok betöltése
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
        return res.status(500).send('Hiba történt az adatbázis lekérés közben!');
      }
  
      const formattedResults = results.map(result => ({
        id: result.id,
        title: result.title,
        release: moment(result.release).format('YYYY-MM-DD'), 
        ISBN: result.ISBN,
        authorName: result.name,
        authorBirth: moment(result.birth).format('YYYY-MM-DD') 
      }));
  
      res.status(200).send(formattedResults);
    });
});

// Könyv lekérése ID alapján
router.get('/:id', (req, res) => {
    const bookID = req.params.id;

    db.query(`
        SELECT 
            books.title, 
            books.release, 
            books.ISBN, 
            authors.name, 
            authors.birth
        FROM books
        JOIN book_authors ON books.ID = book_authors.bookID
        JOIN authors ON book_authors.authID = authors.ID
        WHERE books.ID = ?
    `, [bookID], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Hiba történt az adatbázis lekérés közben!');
        }

        if (results.length === 0) {
            return res.status(404).send('A megadott könyv nem található!');
        }

        const result = results[0];
        const formattedResult = {
            id: result.id,
            title: result.title,
            release: moment(result.release).format('YYYY-MM-DD'),
            ISBN: result.ISBN,
            authorName: result.name,
            authorBirth: moment(result.birth).format('YYYY-MM-DD')
        };

        res.status(200).send(formattedResult);
    });
});

// Könyv törlése
router.delete('/:id', (req, res) => {
    const bookID = req.params.id;

    if (!bookID) {
        return res.status(400).send('Kérlek, add meg a törlendő könyv azonosítóját!');
    }

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

// Könyv módosítása (PUT)
router.patch('/:id', (req, res) => {
    const bookID = req.params.id;
    const { title, release, ISBN, authorID } = req.body;

    if (!title || !release || !ISBN || !authorID) {
        return res.status(400).send('Kérlek, add meg az összes szükséges adatot!');
    }

    const updateQuery = `
        UPDATE books 
        SET 
            title = ?, 
            \`release\` = ?,
            ISBN = ?
        WHERE ID = ?;
    `;

    db.query(updateQuery, [title, release, ISBN, bookID], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send(`Hiba történt a könyv módosítása közben: ${err.message}`);
        }

        if (results.affectedRows === 0) {
            return res.status(404).send('A megadott könyv nem található!');
        }

        const updateAuthorQuery = `UPDATE book_authors SET authID = ? WHERE bookID = ?`;
        db.query(updateAuthorQuery, [authorID, bookID], (err) => {
            if (err) {
                console.error(err);
                return res.status(500).send(`Hiba történt a szerző módosítása közben: ${err.message}`);
            }
            res.status(200).send({ message: 'A könyv sikeresen módosítva!' });
        });
    });
});

module.exports = router;
