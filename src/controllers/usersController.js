const pool = require("../config/database");

const USER_COLUMNS = "id, full_name, email, phone, role, is_active, created_at";

async function getUsers(req, res) {
  try {
    const result = await pool.query(
      `SELECT ${USER_COLUMNS} FROM users ORDER BY id`
    );

    res.status(200).json({
      success: true,
      count: result.rows.length,
      data: result.rows
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve users"
    });
  }
}

async function getUserById(req, res) {
  try {
    const userId = Number(req.params.id);

    if (!Number.isInteger(userId) || userId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID"
      });
    }

    const result = await pool.query(
      `SELECT ${USER_COLUMNS} FROM users WHERE id = $1`,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.status(200).json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve user"
    });
  }
}

async function createUser(req, res) {
  try {
    const { full_name, email, phone } = req.body || {};

    if (
      !full_name || typeof full_name !== "string" || !full_name.trim() ||
      !email || typeof email !== "string" || !email.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "full_name and email are required"
      });
    }

    if (!email.includes("@")) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format"
      });
    }

    const result = await pool.query(
      `INSERT INTO users (full_name, email, phone)
       VALUES ($1, $2, $3)
       RETURNING ${USER_COLUMNS}`,
      [full_name.trim(), email.trim().toLowerCase(), phone || null]
    );

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: result.rows[0]
    });
  } catch (error) {
    if (error.code === "23505") {
      return res.status(409).json({
        success: false,
        message: "Email already exists"
      });
    }

    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to create user"
    });
  }
}

async function updateUserStatus(req, res) {
  try {
    const userId = Number(req.params.id);

    if (!Number.isInteger(userId) || userId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID"
      });
    }

    const { is_active } = req.body || {};

    if (typeof is_active !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "is_active must be true or false"
      });
    }

    const result = await pool.query(
      `UPDATE users SET is_active = $1 WHERE id = $2
       RETURNING ${USER_COLUMNS}`,
      [is_active, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "User status updated successfully",
      data: result.rows[0]
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to update user status"
    });
  }
}

module.exports = { getUsers, getUserById, createUser, updateUserStatus };