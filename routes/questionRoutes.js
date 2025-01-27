const express = require('express');
const questionController = require('../controllers/questionController');
const router = express.Router();

// Add a new question
router.post('/add', questionController.addQuestion);

// Get all questions for a chapter
router.get('/:chapter_id', questionController.getQuestionsByChapter);

// Add a route to delete the question
router.delete('/:question_id', questionController.deleteQuestion);


module.exports = router;
