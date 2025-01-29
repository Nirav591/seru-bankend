const Question = require('../models/Question');

exports.addQuestion = async (req, res) => {


    try {
        const { chapter_id, question, type, noOfAnswer, options } = req.body;


        if (!chapter_id || !question || !type || !noOfAnswer || !options || options.length === 0) {
            return res.status(400).json({ error: 'All fields are required, including options.' });
        }

        // Insert the question or get existing question ID
        const result = await Question.addQuestion({ chapter_id, question, type, noOfAnswer });

        if (result.error) {
            return res.status(409).json({ error: result.error, questionId: result.questionId });
        }

        const questionId = result.questionId;

        for (const option of options) {
            if (!option.option) {
                return res.status(400).json({ error: 'Each option must have text.' });
            }

            await Question.addOption({
                question_id: questionId,
                option: option.option,
                isAnswer: option.isAnswer || false,
            });
        }

        res.status(201).json({ message: 'Question added successfully.', questionId });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'An error occurred while adding the question.' });
    }
};
exports.getQuestionsByChapter = async (req, res) => {
    try {
        const { chapter_id } = req.params;

        // Validate chapter ID
        if (!chapter_id) {
            return res.status(400).json({ error: 'Chapter ID is required.' });
        }

        // Fetch all questions for the chapter
        const questions = await Question.getQuestionsByChapter(chapter_id);

        // For each question, fetch its options
        for (const question of questions) {
            const options = await Question.getOptionsByQuestionId(question.id);
            question.options = options; // Attach options to each question
        }

        res.status(200).json({ questions });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching questions.' });
    }
};

exports.deleteQuestion = async (req, res) => {
    try {
        const { question_id } = req.params;

        if (!question_id) {
            return res.status(400).json({ error: 'Question ID is required.' });
        }

        // First, delete the options associated with the question
        await Question.deleteOptionsByQuestionId(question_id);

        // Now, delete the question itself
        await Question.deleteQuestionById(question_id);

        res.status(200).json({ message: 'Question and its options deleted successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while deleting the question.' });
    }
};

exports.getAllQuestions = async (req, res) => {
    try {
        // Fetch all questions from the database
        const questions = await Question.getAllQuestions();

        // For each question, fetch its options
        for (const question of questions) {
            const options = await Question.getOptionsByQuestionId(question.id);
            question.options = options; // Attach options to each question
        }

        res.status(200).json({ questions });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching questions.' });
    }
};