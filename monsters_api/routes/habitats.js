const { Router } = require('express');
const pool = require('../db/index');

const router = Router();

router.get('/', (req, res, next) => {
    pool.query('SELECT * FROM habitats ORDER BY id ASC',(err, rst) => {
        if(err) return next(err);
    
        res.json(rst.rows);
    });
});

router.get('/:id', (req, res, next) => {
    const { id } = req.params;

    pool.query('SELECT * FROM habitats WHERE id = $1', [id], (err, rst) => {
        if(err) return next(err);
    
        res.json(rst.rows);
    });
});

router.post('/', (req, res, next) => {
    const { name, climate, temperature } = req.body;

    pool.query('INSERT INTO habitats(name, climate, temperature) VALUES ($1, $2, $3)', [name, climate, temperature], (err, rst) => {
        if(err) return next(err);

        res.redirect('/habitats');
    });
});

router.put('/:id', (req, res, next) => {
    const { id } = req.params;
    const keys = ['name', 'climate', 'temperature'];
    const fields = [];

    keys.forEach(key => {
        if(req.body[key]) fields.push(key);
    });

    fields.forEach((field, index) => {
        pool.query(
            `UPDATE habitats SET ${field}=($1) WHERE id = ($2)`,
            [req.body[field], id], 
            (err, rst) => {
            if(err) return next(err);
    
            if (index === fields.length-1) res.redirect('/habitats');
        });
    });
});

router.delete('/:id', (req, res, next) => {
    const { id } = req.params;

    pool.query('DELETE FROM habitats WHERE id = ($1)', [id], (err, rst) => {
        if(err) return next(err);

        res.redirect('/habitats');
    });
});

module.exports = router;