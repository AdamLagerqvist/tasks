const express = require('express');
const router = express.Router();
const pool = require('../../database');

router.get('/', async (req, res, next) => {
    await pool.promise()
        .query('SELECT * FROM admlat_tasks')
        .then(([rows, fields]) => {
            res.json({
                tasks: {
                    data: rows
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                tasks: {
                    error: 'Error getting tasks'
                }
            })
        });
});

router.get('/:id', async (req, res, next) => {
    const id = req.params.id;
    if (isNaN(req.params.id)) {
        res.status(400).json({
            task: {
                error: 'Bad request'
            }
        });
    }
    await pool.promise()
        .query('SELECT * FROM tasks WHERE id = ?', [id])
        .then(([rows, fields]) => {
            res.json({
                task: {
                    data: rows
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                task: {
                    error: 'Error getting tasks'
                }
            })
        });
});

router.get('/:id/delete', async (req, res, next) => {
    const id = req.params.id;
    res.json(`deleting task ${id}`);
    // if (isNaN(req.params.id)) {
    //     res.status(400).json({
    //         task: {
    //             error: 'Bad request'
    //         }
    //     });
    // }
});

router.post('/', async (req, res, next) => {
    // { "task": "koda post" }
    const task = req.body.task;
    await pool.promise()
    .query('INSERT INTO tasks (task) VALUES (?)', [task])
    .then((response) => {
        res.json({
            task: {
                data: response
            }
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            task: {
                error: 'Error getting tasks'
            }
        })
    });
    
    
    // res.json(req.body);

});


module.exports = router;



/*

    await pool
    .promise()
    .query('SELECT * FROM users')
    .then(([rows, fields]) => {
        res.json({
            data: rows,
        });
    })
    .catch((err) => {
        console.log(err);
        res.status(500).json({
            error: 'Database error',
        });
    });

    */