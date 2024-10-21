const express = require('express');
const router = express.Router();
const db = require('./database');
const moment = require('moment');

// Új adat hozzáadása
router.post('/', (req, res) => {
    const { name, birth, bookID } = req.body;

    if (!name || !birth) {
        return res.status(400).send('Kérlek, add meg az összes szükséges adatot!');
    }

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
        res.status(201).send({ message: 'Szerző sikeresen hozzáadva!', authorID: newAuthorID });
    });
});

// Adatok lekérése (minden szerző)
router.get('/', (req, res) => {
    db.query(`
        SELECT
            authors.ID as id,
            authors.name, 
            authors.birth
        FROM authors
    `, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Hiba történt az adatbázis lekérés közben!');
        }

        const formattedResults = results.map(result => ({
            id: result.id,
            authorName: result.name,
            authorBirth: moment(result.birth).format('YYYY-MM-DD'), 
        }));

        res.status(200).send(formattedResults);
    });
});

// Szerző lekérése az ID alapján
router.get('/:id', (req, res) => {
    const authorID = req.params.id;

    if (!authorID) {
        return res.status(400).send('Kérlek, add meg a szerző azonosítóját!');
    }

    const query = `
        SELECT 
            authors.ID as id,
            authors.name,
            authors.birth
        FROM authors 
        WHERE ID = ?;
    `;

    db.query(query, [authorID], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Hiba történt az adatbázis lekérés közben!');
        }

        if (results.length === 0) {
            return res.status(404).send('A megadott szerző nem található!');
        }

        const author = results[0];
        res.status(200).send({
            id: author.id,
            authorName: author.name,
            authorBirth: moment(author.birth).format('YYYY-MM-DD'),
        });
    });
});

// Szerző törlése
router.delete('/:id', (req, res) => {
    const authorID = req.params.id; 

    if (!authorID) {
        return res.status(400).send('Kérlek, add meg a törlendő szerző azonosítóját!');
    }

    const deleteQuery = `DELETE FROM authors WHERE ID = ?`;
    db.query(deleteQuery, [authorID], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Hiba történt a szerző törlése közben!');
        }

        if (results.affectedRows === 0) {
            return res.status(404).send('A megadott szerző nem található!');
        }

        res.status(200).send({ message: 'Szerző sikeresen törölve!' });
    });
});

// Szerző módosítása (PUT)
router.put('/:id', (req, res) => {
    const authorID = req.params.id;
    const { name, birth } = req.body;

    if (!name || !birth) {
        return res.status(400).send('Kérlek, add meg az összes szükséges adatot!');
    }

    const updateQuery = `
        UPDATE authors 
        SET 
            name = ?, 
            birth = ? 
        WHERE ID = ?;
    `;

    db.query(updateQuery, [name, birth, authorID], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Hiba történt a szerző módosítása közben!');
        }

        if (results.affectedRows === 0) {
            return res.status(404).send('A megadott szerző nem található!');
        }

        res.status(200).send({ message: 'Szerző sikeresen módosítva!' });
    });
});

module.exports = router;
