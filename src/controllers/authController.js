const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../config/database");

const USER_COLUMNS = "id, full_name, email, phone, role, is_active, created_at";

function signToken(user) {
  return jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "1h" }
  );
}

async function register(req, res) {
  try {
    const { full_name, email, phone, password } = req.body;

    const passwordHash = await bcrypt.hash(password, 12);

    const result = await pool.query(
      `INSERT INTO users (full_name, email, phone, password_hash, role)
       VALUES ($1, $2, $3, $4, 'customer')
       RETURNING ${USER_COLUMNS}`,
      [full_name, email, phone || null, passwordHash]
    );

    res.status(201).json({
      success: true,
      message: "Registered successfully",
      data: result.rows[0]
    });
  } catch (error) {
    if (error.code === "23505") {
      return res.status(409).json({
        success: false,
        message: "Email already exists"
      });
    }

    console.error("Register failed:", error.code || error.message);
    res.status(500).json({
      success: false,
      message: "Failed to register"
    });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;

    const result = await pool.query(
      `SELECT ${USER_COLUMNS}, password_hash FROM users WHERE email = $1`,
      [email]
    );

    const user = result.rows[0];
    const genericError = {
      success: false,
      message: "Invalid email or password"
    };

    if (!user || !user.password_hash) {
      return res.status(401).json(genericError);
    }

    const isValid = await bcrypt.compare(password, user.password_hash);

    if (!isValid) {
      return res.status(401).json(genericError);
    }

    if (!user.is_active) {
      return res.status(403).json({
        success: false,
        message: "Account is disabled"
      });
    }

    const token = signToken(user);

    delete user.password_hash;

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      data: user
    });
  } catch (error) {
    console.error("Login failed:", error.code || error.message);
    res.status(500).json({
      success: false,
      message: "Failed to login"
    });
  }
}

async function me(req, res) {
  try {
    const result = await pool.query(
      `SELECT ${USER_COLUMNS} FROM users WHERE id = $1`,
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.status(200).json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error("Me failed:", error.code || error.message);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve profile"
    });
  }
}

module.exports = { register, login, me };