const { response } = require('express');
const express = require('express');
const { query } = require('../database');
const router = express.Router();
const pool = require('../database');

/* 
    BASE URL /tasks
    GET / - Get all tasks
    POST / - Create a new task
    GET /:id - Get a task by id
    PUT /:id - Update a task by id
    DELETE /:id - Delete a task by id
*/

router.get('/', async (req, res, next) => {
    console.log(req.query.sort)
    const flash = req.session.flash
    req.session.flash = null
    let params = "";
    let sort = "";
    if(req.query.sort == 2){
        params = " ORDER BY id DESC"
        sort = "Sort by oldest"
    }else if(req.query.sort == 3){
        params = " ORDER BY task"
        sort = "Sort by first letter"
    }else if(req.query.sort == 4){
        params = " ORDER BY RAND ()"
        sort = "Random😁"
    }else{
        params = ""
        sort = null
    }
    await pool.promise()
        .query('SELECT * FROM admlat_tasks' + params)
        .then(([rows, fields]) => {
              res.render('tasks.njk', {
                flash: flash,
                sort: sort,
                tasks: rows,
                title: 'Tasks',
                layout: 'layout.njk'
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
        .query('SELECT * FROM admlat_tasks WHERE id = ?', [id])
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
    if (isNaN(req.params.id)) {
        res.status(400).json({
            task: {
                error: 'Bad request'
            }
        });
    }
    await pool.promise()
    .query('DELETE FROM admlat_tasks WHERE id=?', [id])
    .then((response) => {
        if(response[0].affectedRows === 1){
            req.session.flash = "task deleted"
            res.redirect('/tasks')
        }else{
            res.status(400).redirect('/tasks')
        }
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

router.post('/:id/complete', async (req, res, next) => {
    const id = req.params.id;
    if (isNaN(req.params.id)) {
        res.status(400).json({
            task: {
                error: 'Bad request'
            }
        });
    }
    await pool.promise()
    .query('UPDATE admlat_tasks SET completed = !completed WHERE id = ?', [id])
    .then((response) => {
        if(response[0].affectedRows !== 1){
            req.session.flash = "task completed"
            res.redirect('/tasks')
        }else{
            res.status(400).redirect('/tasks')
        }
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

router.post('/', async (req, res, next) => {
    // { "task": "koda post" }
    const task = req.body.task;
    await pool.promise()
    .query('INSERT INTO admlat_tasks (task) VALUES (?)', [task])
    .then((response) => {
        if (response[0].affectedRows == 1){
            res.redirect('/tasks')
        }else{
            res.status(400).json({
                task: {
                    error: 'Invalid task'
                }
            })
        }
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