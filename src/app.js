const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const productsRoutes = require("./routes/productsRoutes");
const categoriesRoutes = require("./routes/categoriesRoutes");
const usersRoutes = require("./routes/usersRoutes");
const authRoutes = require("./routes/authRoutes");
const notFound = require("./middleware/notFound");
const errorHandler = require("./middleware/errorHandler");
const { apiLimiter, loginLimiter } = require("./middleware/rateLimiter");

const app = express();

const allowedOrigins = (process.env.CORS_ORIGINS || "")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

const corsOptions = {
  origin(origin, callback) {
    // Requests without an Origin header (Postman, curl, server-to-server) are allowed
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(null, false);
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
};

app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "E-commerce API is running"
  });
});

app.use("/api", apiLimiter);
app.use("/api/auth/login", loginLimiter);

app.use("/api/products", productsRoutes);
app.use("/api/categories", categoriesRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/auth", authRoutes);

// Test-only route to prove errors do not leak details. Disabled in production.
if (process.env.NODE_ENV !== "production") {
  app.get("/api/__test-error", (req, res, next) => {
    next(new Error("Secret detail: SELECT * FROM users WHERE password = 'x'"));
  });
}

app.use(notFound);
app.use(errorHandler);

module.exports = app;