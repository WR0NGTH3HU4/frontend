const express = require('express');
const router = express.Router();
const db = require('./database');
const moment = require('moment');

// Szerző hozzáadása
router.post('/', (req, res) => {
    const { name, birth, bookID } = req.body;

    // Ellenőrizd, hogy a szükséges adatok megvannak-e
    if (!name || !birth) {
        return res.status(400).send('Kérlek, add meg az összes szükséges adatot!');
    }

    // 1. Ellenőrizd, hogy a szerző már létezik-e
    const checkAuthorQuery = `
        SELECT ID FROM authors WHERE name = ? AND birth = ?;
    `;
    db.query(checkAuthorQuery, [name, birth], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Hiba történt a szerző ellenőrzése közben!');
        }

        // 2. Ha a szerző már létezik, vegyük az ID-ját
        if (results.length > 0) {
            const existingAuthorID = results[0].ID;

            // 3. Ellenőrizzük, hogy van-e már kapcsolat a book_authors táblában
            if (bookID) {
                const checkRelationQuery = `
                    SELECT * FROM book_authors WHERE authID = ? AND bookID = ?;
                `;
                db.query(checkRelationQuery, [existingAuthorID, bookID], (err, results) => {
                    if (err) {
                        console.error(err);
                        return res.status(500).send('Hiba történt a kapcsolat ellenőrzése közben!');
                    }

                    // Ha a kapcsolat nem létezik, adjuk hozzá
                    if (results.length === 0) {
                        const bookAuthorQuery = `
                            INSERT INTO book_authors (authID, bookID) 
                            VALUES (?, ?);
                        `;
                        db.query(bookAuthorQuery, [existingAuthorID, bookID], (err) => {
                            if (err) {
                                console.error(err);
                                return res.status(500).send('Hiba történt a szerző és a könyv összekapcsolása közben!');
                            }
                        });
                    }
                });
            }

            return res.status(200).send({ message: 'Szerző már létezik!', authorID: existingAuthorID });
        }

        // 4. Ha a szerző nem létezik, adjuk hozzá
        const authorQuery = `
            INSERT INTO authors (name, birth) 
            VALUES (?, ?);
        `;
        db.query(authorQuery, [name, birth], (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Hiba történt a szerző hozzáadása közben!');
            }

            const newAuthorID = results.insertId;

            // 5. Kapcsolat létrehozása a book_authors táblában, ha a bookID meg van adva
            if (bookID) {
                const bookAuthorQuery = `
                    INSERT INTO book_authors (authID, bookID) 
                    VALUES (?, ?);
                `;
                db.query(bookAuthorQuery, [newAuthorID, bookID], (err) => {
                    if (err) {
                        console.error(err);
                        return res.status(500).send('Hiba történt a szerző és a könyv összekapcsolása közben!');
                    }
                });
            }

            // 6. A szerző sikeres hozzáadása után
            res.status(201).send({ message: 'Szerző sikeresen hozzáadva!', authorID: newAuthorID });
        });
    });
});

// Adatok lekérése
router.get('/', (req, res) => {
    db.query(`
      SELECT
        authors.ID as id,
        authors.name, 
        authors.birth
      FROM authors
      JOIN book_authors ON authors.ID = book_authors.authID
      JOIN books ON book_authors.bookID = books.ID
    `, (err, results) => {
      if (err) {
        console.error(err);
        res.status(500).send('Hiba történt az adatbázis lekérés közben!');
        return;
      }
  
      const formattedResults = results.map(result => ({
        id: result.id,
        authorName: result.name,
        authorBirth: moment(result.birth).format('YYYY-MM-DD'), 
      }));
  
      res.status(200).send(formattedResults);
      return;
    });
});

module.exports = router;
