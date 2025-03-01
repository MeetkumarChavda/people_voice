const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const config = require("./config/server.config");

// Import routes
const tempRoutes = require("./routes/temp.routes");
const userRoutes = require("./routes/user.routes");

// Initialize express app
const app = express();

// Security middleware
app.use(helmet());
app.use(cors(config.cors));

// Request parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
if (config.nodeEnv === "development") {
    app.use(morgan("dev"));
}

// API routes
app.use("/api/v1/temp", tempRoutes);

app.use("/api/v1/auth", userRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        error: {
            message: err.message || "Internal Server Error",
            ...(config.nodeEnv === "development" && { stack: err.stack }),
        },
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        error: {
            message: "Not Found",
        },
    });
});

module.exports = app;
