const { Router } = require('express');
const pool = require('../db/index');

const router = Router();

router.get('/', (req, res, next) => {
    pool.query('SELECT * FROM lives',(err, rst) => {
        if(err) return next(err);
    
        res.json(rst.rows);
    });
});

router.get('/conditions', (req, res, next) => {
    pool.query('SELECT * FROM lives JOIN habitats ON habitats.name = lives.habitat',(err, rst) => {
        if(err) return next(err);
    
        res.json(rst.rows);
    });
});

module.exports = router;