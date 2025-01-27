const express = require('express');
const chapterController = require('../controllers/chapterController');
const router = express.Router();

// POST: Add a new chapter
router.post('/add', chapterController.addChapter);

// GET: Get all chapters or a specific chapter by ID
router.get('/list', chapterController.getChapters);


// GET: Get a specific chapter by ID
router.get('/:id', chapterController.getChapterById);


module.exports = router;
