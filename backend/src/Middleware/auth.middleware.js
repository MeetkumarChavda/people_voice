const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

// Environment variables should be properly set up in a real application
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";

const authMiddleware = {
    // Verify JWT token middleware
    authenticateUser: async (req, res, next) => {
        try {
            // Get token from header
            const token = req.header("Authorization")?.replace("Bearer ", "");

            if (!token) {
                return res.status(401).json({
                    success: false,
                    message: "Access denied. No token provided.",
                });
            }

            // Verify token
            const decoded = jwt.verify(token, JWT_SECRET);

            // Special case for admin
            if (decoded.id === "admin" && decoded.role === "superAdmin") {
                req.user = {
                    id: "admin",
                    role: "superAdmin",
                    verified: true,
                    category: "superAdmin", // Add category for consistency
                };
                return next();
            }

            // Find user by ID from token
            const user = await User.findById(decoded.id).select(
                "-passwordHash"
            );

            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: "Invalid token. User not found.",
                });
            }

            // Attach user object to request
            req.user = {
                id: user._id,
                role: user.role,
                category: user.category,
                verified: user.verified,
                subcategory: user.subcategory,
            };

            next();
        } catch (error) {
            console.error("Authentication error:", error);

            if (error.name === "JsonWebTokenError") {
                return res.status(401).json({
                    success: false,
                    message: "Invalid token.",
                });
            }

            if (error.name === "TokenExpiredError") {
                return res.status(401).json({
                    success: false,
                    message: "Token expired.",
                });
            }

            return res.status(500).json({
                success: false,
                message: "Server authentication error",
                error: error.message,
            });
        }
    },

    // Check if user is verified
    checkVerified: (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized. Please authenticate.",
            });
        }

        // Skip verification check for superAdmin
        if (req.user.role === "superAdmin") {
            return next();
        }

        if (!req.user.verified) {
            return res.status(403).json({
                success: false,
                message:
                    "Your account is pending verification. Please wait for approval.",
            });
        }

        next();
    },

    // Check user role middleware
    checkRole: (roles) => {
        return (req, res, next) => {
            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized. Please authenticate.",
                });
            }

            if (!roles.includes(req.user.role)) {
                return res.status(403).json({
                    success: false,
                    message: "Access denied. Insufficient permissions.",
                });
            }

            next();
        };
    },

    // Check user category middleware
    checkCategory: (categories) => {
        return (req, res, next) => {
            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized. Please authenticate.",
                });
            }

            if (!categories.includes(req.user.category)) {
                return res.status(403).json({
                    success: false,
                    message:
                        "Access denied. Insufficient category permissions.",
                });
            }

            next();
        };
    },

    // Check if user is associated with a specific Municipal Corporation
    checkMunicipalAssociation: (municipalCorpId) => {
        return (req, res, next) => {
            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized. Please authenticate.",
                });
            }

            // Direct match for Municipal Corporation
            if (
                req.user.role === "government" &&
                req.user.category === "MunicipalCorporation" &&
                req.user.id.toString() === municipalCorpId
            ) {
                return next();
            }

            // Check if Area Counsellor belongs to this Municipal Corporation
            if (
                req.user.role === "government" &&
                req.user.category === "AreaCounsellor" &&
                req.user.parentMunicipalCorp &&
                req.user.parentMunicipalCorp.toString() === municipalCorpId
            ) {
                return next();
            }

            return res.status(403).json({
                success: false,
                message:
                    "Access denied. You are not associated with this Municipal Corporation.",
            });
        };
    },
};

module.exports = authMiddleware;
