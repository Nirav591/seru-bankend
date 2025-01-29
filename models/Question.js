const pool = require('../config/db');

const Question = {

  // Function to delete options by question ID
  deleteOptionsByQuestionId: async (question_id) => {
    const sql = `
      DELETE FROM options
      WHERE question_id = ?
    `;
    const [result] = await pool.execute(sql, [question_id]);
    return result; // Return the result of the deletion
  },

  // Function to delete a question by ID
  deleteQuestionById: async (question_id) => {
    const sql = `
      DELETE FROM questions
      WHERE id = ?
    `;
    const [result] = await pool.execute(sql, [question_id]);
    return result; // Return the result of the deletion
  },

  // Function to add a question
  addQuestion: async ({ chapter_id, question, type, noOfAnswer }) => {
    try {
        // Check if the question already exists in the same chapter
        const checkSql = `SELECT id FROM questions WHERE chapter_id = ? AND question = ?`;
        const [existing] = await pool.execute(checkSql, [chapter_id, question]);

        if (existing.length > 0) {
            return { error: 'Duplicate question exists', questionId: existing[0].id };
        }

        // Insert new question
        const sql = `
            INSERT INTO questions (chapter_id, question, type, no_of_answers)
            VALUES (?, ?, ?, ?)
        `;
        const [result] = await pool.execute(sql, [chapter_id, question, type, noOfAnswer]);
        return { questionId: result.insertId }; // Return the inserted question ID
    } catch (error) {
        console.error('Error adding question:', error);
        throw new Error('Failed to add question');
    }
},
  // Function to add an option for a question
  addOption: async ({ question_id, option, isAnswer }) => {
    const sql = `
      INSERT INTO options (question_id, option, is_answer)
      VALUES (?, ?, ?)
    `;
    const [result] = await pool.execute(sql, [question_id, option, isAnswer]);
    return result.insertId; // Return the ID of the inserted option
  },
  getQuestionsByChapter: async (chapter_id) => {
    const sql = `
      SELECT id, question, type, no_of_answers
      FROM questions
      WHERE chapter_id = ?
    `;
    const [rows] = await pool.execute(sql, [chapter_id]);
    return rows; // Return all questions for the chapter
  },

  // Get all options by question ID
  getOptionsByQuestionId: async (question_id) => {
    const sql = `
      SELECT id, option, is_answer
      FROM options
      WHERE question_id = ?
    `;
    const [rows] = await pool.execute(sql, [question_id]);
    return rows; // Return all options for the question
  },

};

module.exports = Question;
