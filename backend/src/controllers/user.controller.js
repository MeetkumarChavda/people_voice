const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");

// Environment variables should be properly set up in a real application
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "24h";

const authController = {
    // Register a new user
    register: async (req, res) => {
        try {
            // Check for validation errors
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res
                    .status(400)
                    .json({ success: false, errors: errors.array() });
            }

            const {
                username,
                name,
                email,
                password,
                phoneNumber,
                address,
                role,
                category,
                subcategory,
                areaCode,
            } = req.body;

            // Check if user already exists
            const existingUser = await User.findOne({
                $or: [{ email }, { username }],
            });

            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    message: "User with this email or username already exists",
                });
            }

            // Validate category based on role
            if (
                role === "organization" &&
                !["NGO", "other"].includes(category)
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Organization must have category NGO or other",
                });
            }

            if (
                role === "government" &&
                !["MunicipalCorporation", "AreaCounsellor"].includes(category)
            ) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Government must have category MunicipalCorporation or AreaCounsellor",
                });
            }

            // Validate parentMunicipalCorp for AreaCounsellor
            if (
                role === "government" &&
                category === "AreaCounsellor" &&
                (!subcategory || !subcategory.municipalCorporationID)
            ) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Area Counsellor must be associated with a Municipal Corporation",
                });
            }

            // If municipalCorporationID is provided, check if it exists and is of the right type
            if (subcategory && subcategory.municipalCorporationID) {
                const municipalCorp = await User.findById(
                    subcategory.municipalCorporationID
                );
                if (
                    !municipalCorp ||
                    municipalCorp.role !== "government" ||
                    municipalCorp.category !== "MunicipalCorporation"
                ) {
                    return res.status(400).json({
                        success: false,
                        message: "Invalid Municipal Corporation reference",
                    });
                }
                // Set the municipal corporation name
                subcategory.municipalCorporationName = municipalCorp.name;
            }

            // Create new user
            const newUser = new User({
                username,
                name,
                email,
                passwordHash: password, // Will be hashed by pre-save hook
                phoneNumber,
                address,
                role: role || "citizen", // Default role
                category: category || undefined,
                subcategory: subcategory || undefined,
                areaCode,
                createdAt: new Date(),
                points: 0,
                badges: [],
                issuesReported: 0,
                issuesSolved: 0,
                stats: {
                    totalPublicIssues: 0,
                    totalPrivateIssues: 0,
                    upvotesReceived: 0,
                    commentsPosted: 0,
                    solutionsProvided: 0,
                },
            });

            await newUser.save();

            // Generate JWT token
            const token = jwt.sign(
                {
                    id: newUser._id,
                    role: newUser.role,
                    category: newUser.category,
                },
                JWT_SECRET,
                { expiresIn: JWT_EXPIRES_IN }
            );

            // Return success with token
            return res.status(201).json({
                success: true,
                message: "User registered successfully",
                token,
                user: {
                    id: newUser._id,
                    username: newUser.username,
                    name: newUser.name,
                    email: newUser.email,
                    role: newUser.role,
                    category: newUser.category,
                    subcategory: {
                        municipalCorporationID:
                            newUser.subcategory.municipalCorporationID,
                        municipalCorporationName:
                            newUser.subcategory.municipalCorporationName,
                    },
                },
            });
        } catch (error) {
            console.error("Registration error:", error);
            return res.status(500).json({
                success: false,
                message: "Server error during registration",
                error: error.message,
            });
        }
    },

    // Login existing user
    login: async (req, res) => {
        try {
            // Check for validation errors
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res
                    .status(400)
                    .json({ success: false, errors: errors.array() });
            }

            const { email, password } = req.body;

            // Find user by email
            const user = await User.findOne({ email });

            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: "Invalid credentials",
                });
            }

            // Check password
            const isMatch = await user.comparePassword(password);

            if (!isMatch) {
                return res.status(401).json({
                    success: false,
                    message: "Invalid credentials",
                });
            }

            // Update last login
            user.lastLogin = new Date();
            await user.save();

            // Generate JWT token with additional category info
            const token = jwt.sign(
                {
                    id: user._id,
                    role: user.role,
                    category: user.category,
                },
                JWT_SECRET,
                { expiresIn: JWT_EXPIRES_IN }
            );

            // Return success with token
            return res.status(200).json({
                success: true,
                message: "Login successful",
                token,
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    role: user.role,
                    category: user.category,
                    parentMunicipalCorp: user.parentMunicipalCorp,
                },
            });
        } catch (error) {
            console.error("Login error:", error);
            return res.status(500).json({
                success: false,
                message: "Server error during login",
                error: error.message,
            });
        }
    },

    // Get current user profile
    getProfile: async (req, res) => {
        try {
            const user = await User.findById(req.user.id)
                .select("-passwordHash")
                .populate(
                    "subcategory.municipalCorporationID",
                    "username email name _id"
                );

            if (!user) {
                return res
                    .status(404)
                    .json({ success: false, message: "User not found" });
            }

            return res.status(200).json({
                success: true,
                user,
            });
        } catch (error) {
            console.error("Get profile error:", error);
            return res.status(500).json({
                success: false,
                message: "Server error while fetching profile",
                error: error.message,
            });
        }
    },

    // Update user profile
    updateProfile: async (req, res) => {
        try {
            const { username, phoneNumber, address, profilePicture } = req.body;

            // Find and update user
            const updatedUser = await User.findByIdAndUpdate(
                req.user.id,
                {
                    $set: {
                        username,
                        phoneNumber,
                        address,
                        profilePicture,
                    },
                },
                { new: true, runValidators: true }
            ).select("-passwordHash");

            if (!updatedUser) {
                return res
                    .status(404)
                    .json({ success: false, message: "User not found" });
            }

            return res.status(200).json({
                success: true,
                message: "Profile updated successfully",
                user: updatedUser,
            });
        } catch (error) {
            console.error("Update profile error:", error);
            return res.status(500).json({
                success: false,
                message: "Server error while updating profile",
                error: error.message,
            });
        }
    },

    // Change password
    changePassword: async (req, res) => {
        try {
            const { currentPassword, newPassword } = req.body;

            const user = await User.findById(req.user.id);
            if (!user) {
                return res
                    .status(404)
                    .json({ success: false, message: "User not found" });
            }

            // Verify current password
            const isMatch = await user.comparePassword(currentPassword);
            if (!isMatch) {
                return res.status(401).json({
                    success: false,
                    message: "Current password is incorrect",
                });
            }

            // Update password
            user.passwordHash = newPassword; // Will be hashed by pre-save hook
            await user.save();

            return res.status(200).json({
                success: true,
                message: "Password changed successfully",
            });
        } catch (error) {
            console.error("Change password error:", error);
            return res.status(500).json({
                success: false,
                message: "Server error while changing password",
                error: error.message,
            });
        }
    },

    // Get all Municipal Corporations (for Area Counsellor registration)
    getAllMunicipalCorporations: async (req, res) => {
        try {
            const municipalCorps = await User.find({
                role: "government",
                category: "MunicipalCorporation",
            }).select("_id username email address");

            return res.status(200).json({
                success: true,
                count: municipalCorps.length,
                data: municipalCorps,
            });
        } catch (error) {
            console.error("Fetch municipal corporations error:", error);
            return res.status(500).json({
                success: false,
                message: "Server error while fetching municipal corporations",
                error: error.message,
            });
        }
    },

    // Get Area Counsellors by Municipal Corporation
    getAreaCounsellors: async (req, res) => {
        try {
            const { municipalCorpId } = req.params;

            // Validate municipal corporation exists
            const municipalCorp = await User.findOne({
                _id: municipalCorpId,
                role: "government",
                category: "MunicipalCorporation",
            });

            if (!municipalCorp) {
                return res.status(404).json({
                    success: false,
                    message: "Municipal Corporation not found",
                });
            }

            // Find all Area Counsellors under this Municipal Corporation
            const areaCounsellors = await User.find({
                role: "government",
                category: "AreaCounsellor",
                "subcategory.municipalCorporationID": municipalCorpId,
            }).select("-passwordHash");

            return res.status(200).json({
                success: true,
                count: areaCounsellors.length,
                data: areaCounsellors,
            });
        } catch (error) {
            console.error("Fetch area counsellors error:", error);
            return res.status(500).json({
                success: false,
                message: "Server error while fetching area counsellors",
                error: error.message,
            });
        }
    },

    // Get all Municipal Corporation users
    getAllMunicipalCorporationUsers: async (req, res) => {
        try {
            const municipalCorpUsers = await User.find({
                role: "government",
                category: "MunicipalCorporation",
            }).select("_id name");

            return res.status(200).json({
                success: true,
                count: municipalCorpUsers.length,
                data: municipalCorpUsers,
            });
        } catch (error) {
            console.error("Fetch municipal corporation users error:", error);
            return res.status(500).json({
                success: false,
                message:
                    "Server error while fetching municipal corporation users",
                error: error.message,
            });
        }
    },
};

module.exports = authController;
