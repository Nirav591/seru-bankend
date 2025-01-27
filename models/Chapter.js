const pool = require('../config/db');

class Chapter {
    static async createChapter({ title, index_number, content }) {
        const sql = `
      INSERT INTO chapters (title, index_number, content)
      VALUES (?, ?, ?)
    `;
        const [result] = await pool.execute(sql, [title, index_number, content]);
        return result.insertId; // Return the inserted chapter ID
    }

    static async getAllChapters() {
        const sql = `SELECT * FROM chapters ORDER BY index_number ASC`;
        const [rows] = await pool.execute(sql);
        return rows;
    }

    static async isTitleExist(title) {
        const sql = `SELECT COUNT(*) AS count FROM chapters WHERE title = ?`;
        const [rows] = await pool.execute(sql, [title]);
        return rows[0].count > 0; // Return true if title exists, otherwise false
    }

    static async getChapterById(id) {
        const sql = `SELECT * FROM chapters WHERE id = ?`;
        const [rows] = await pool.execute(sql, [id]);
        return rows[0] || null; // Return the chapter or null if not found
    }
}

module.exports = Chapter;
