const Chapter = require('../models/Chapter');
const Question = require('../models/Question.js');


exports.addChapter = async (req, res) => {
    try {
        const { title, index_number, content } = req.body;
        
        // Input validation
        if (!title || !index_number || !content) {
            return res.status(400).json({ error: 'All fields are required.' });
        }
        
        // Check if the title already exists
        const isTitleExist = await Chapter.isTitleExist(title);
        if (isTitleExist) {
            return res.status(400).json({ error: 'A chapter with this title already exists.' });
        }

        const chapterId = await Chapter.createChapter({
            title,
            index_number,
            content,
        });

        res.status(201).json({ message: 'Chapter added successfully.', chapterId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while adding the chapter.' });
    }
};

exports.getChapters = async (req, res) => {
    try {
        const { id } = req.query; // Accept `id` as a query parameter

        if (id) {
            // Fetch a specific chapter by ID
            const chapter = await Chapter.getChapterById(id);
            if (!chapter) {
                return res.status(404).json({ error: 'Chapter not found.' });
            }
            return res.status(200).json({ chapter });
        }

        // Fetch all chapters
        const chapters = await Chapter.getAllChapters();
        res.status(200).json({ chapters });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching chapters.' });
    }
};

exports.getChapterById = async (req, res) => {
    try {
        const { id } = req.params; // Get `id` from route parameters

        // Validate `id`
        if (!id) {
            return res.status(400).json({ error: 'Chapter ID is required.' });
        }

        const chapter = await Chapter.getChapterById(id);
        if (!chapter) {
            return res.status(404).json({ error: 'Chapter not found.' });
        }

        res.status(200).json({ chapter });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching the chapter.' });
    }
};

exports.getQuestionsByChapter = async (req, res) => {
    try {
        const { chapter_id } = req.params;

        if (!chapter_id) {
            return res.status(400).json({ error: 'Chapter ID is required.' });
        }

        const sqlQuestions = `
        SELECT q.id, q.question, q.type, q.no_of_answers
        FROM questions q
        WHERE q.chapter_id = ?
      `;
        const [questions] = await pool.execute(sqlQuestions, [chapter_id]);

        for (const question of questions) {
            const sqlOptions = `
          SELECT id, option, is_answer
          FROM options
          WHERE question_id = ?
        `;
            const [options] = await pool.execute(sqlOptions, [question.id]);
            question.options = options; // Attach options to the question
        }

        res.status(200).json({ questions });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching questions.' });
    }
};