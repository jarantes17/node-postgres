const { Router } = require('express');
const pool = require('../db/index');

const router = Router();

router.get('/', (req, res, next) => {
    pool.query('SELECT * FROM monsters ORDER BY id ASC',(err, rst) => {
        if(err) return next(err);
    
        res.json(rst.rows);
    });
});

router.get('/:id', (req, res, next) => {
    const { id } = req.params;

    pool.query('SELECT * FROM monsters WHERE id = $1', [id], (err, rst) => {
        if(err) return next(err);
    
        res.json(rst.rows);
    });
});

router.post('/', (req, res, next) => {
    const { name, personality } = req.body;

    pool.query('INSERT INTO monsters(name, personality) VALUES ($1, $2)', [name, personality], (err, rst) => {
        if(err) return next(err);

        res.redirect('/monsters');
    });
});

router.put('/:id', (req, res, next) => {
    const { id } = req.params;
    const keys = ['name', 'personality'];
    const fields = [];

    keys.forEach(key => {
        if(req.body[key]) fields.push(key);
    });

    fields.forEach((field, index) => {
        pool.query(
            `UPDATE monsters SET ${field}=($1) WHERE id = ($2)`,
            [req.body[field], id], 
            (err, rst) => {
            if(err) return next(err);
    
            if (index === fields.length-1) {
                req.method = "GET"
                res.redirect(307, '/monsters');   
            }
        });
    });
});

router.delete('/:id', (req, res, next) => {
    const { id } = req.params;

    pool.query('DELETE FROM monsters WHERE id = ($1)', [id], (err, rst) => {
        if(err) return next(err);

        req.method = "GET"
        res.redirect(301, '/monsters');
    });
});

module.exports = router;