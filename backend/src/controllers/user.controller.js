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
                areaName,
            } = req.body;

            console.log("Registration request data:", {
                username,
                email,
                role,
                category,
                subcategory,
            });

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

            // Validate municipalCorporationID for AreaCounsellor
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

            // Prepare user data
            const userData = {
                username,
                name,
                email,
                passwordHash: password, // Will be hashed by pre-save hook
                phoneNumber,
                address,
                role: role || "citizen", // Default role
                verified: role === "citizen" || role === "organization", // Auto-verify citizens and organizations
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
                }
            };

            // Add category if not citizen
            if (role !== "citizen") {
                userData.category = category;
            }

            // Add areaName for government roles
            if (role === "government") {
                userData.areaName = areaName;
            }

            // Add subcategory only for AreaCounsellor
            if (role === "government" && category === "AreaCounsellor" && subcategory) {
                // If municipalCorporationID is provided, check if it exists and is of the right type
                if (subcategory.municipalCorporationID) {
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
                    
                    // Set the subcategory with municipal corporation details
                    userData.subcategory = {
                        municipalCorporationID: subcategory.municipalCorporationID,
                        municipalCorporationName: municipalCorp.name
                    };
                }
            }

            // Create and save the new user
            const newUser = new User(userData);
            await newUser.save();

            // For government roles, return a different message
            if (role === "government") {
                return res.status(201).json({
                    success: true,
                    message: "Registration request submitted successfully. Your account requires verification before it can be used.",
                    user: {
                        id: newUser._id,
                        username: newUser.username,
                        name: newUser.name,
                        email: newUser.email,
                        role: newUser.role,
                        category: newUser.category,
                        verified: newUser.verified,
                    },
                });
            }

            // Generate JWT token for non-government roles
            const token = jwt.sign(
                {
                    id: newUser._id,
                    role: newUser.role,
                    category: newUser.category,
                    verified: newUser.verified,
                },
                JWT_SECRET,
                { expiresIn: JWT_EXPIRES_IN }
            );

            // Return success with token for non-government roles
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
                    verified: newUser.verified,
                    subcategory: newUser.subcategory ? {
                        municipalCorporationID:
                            newUser.subcategory.municipalCorporationID,
                        municipalCorporationName:
                            newUser.subcategory.municipalCorporationName,
                    } : undefined,
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

            // Check if government account is verified
            if (user.role === "government" && !user.verified) {
                return res.status(403).json({
                    success: false,
                    message: "Your account is pending verification. Please wait for approval.",
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
                    verified: user.verified,
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
                    verified: user.verified,
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

    // Admin login
    adminLogin: async (req, res) => {
        try {
            const { username, password } = req.body;

            // Hardcoded admin credentials
            if (username !== "admin" || password !== "admin123") {
                return res.status(401).json({
                    success: false,
                    message: "Invalid admin credentials",
                });
            }

            // Generate JWT token for admin
            const token = jwt.sign(
                {
                    id: "admin",
                    role: "superAdmin",
                    verified: true,
                },
                JWT_SECRET,
                { expiresIn: JWT_EXPIRES_IN }
            );

            // Return success with token
            return res.status(200).json({
                success: true,
                message: "Admin login successful",
                token,
                user: {
                    username: "admin",
                    role: "superAdmin",
                },
            });
        } catch (error) {
            console.error("Admin login error:", error);
            return res.status(500).json({
                success: false,
                message: "Server error during admin login",
                error: error.message,
            });
        }
    },

    // Get pending verification requests
    getPendingVerificationRequests: async (req, res) => {
        try {
            const { role } = req.user;
            let query = { verified: false };

            // If municipal corporation, only show area counsellors linked to this municipal corporation
            if (role === "government" && req.user.category === "MunicipalCorporation") {
                query = {
                    verified: false,
                    role: "government",
                    category: "AreaCounsellor",
                    "subcategory.municipalCorporationID": req.user.id,
                };
            } 
            // If superAdmin, only show municipal corporation requests
            else if (role === "superAdmin") {
                query = {
                    verified: false,
                    role: "government",
                    category: "MunicipalCorporation",
                };
            } else {
                return res.status(403).json({
                    success: false,
                    message: "You don't have permission to view verification requests",
                });
            }

            const pendingRequests = await User.find(query).select("-passwordHash");

            return res.status(200).json({
                success: true,
                count: pendingRequests.length,
                data: pendingRequests,
            });
        } catch (error) {
            console.error("Get pending verification requests error:", error);
            return res.status(500).json({
                success: false,
                message: "Server error while fetching verification requests",
                error: error.message,
            });
        }
    },

    // Approve or reject verification request
    handleVerificationRequest: async (req, res) => {
        try {
            const { userId, approved } = req.body;
            const { role } = req.user;

            // Find the user to verify
            const userToVerify = await User.findById(userId);

            if (!userToVerify) {
                return res.status(404).json({
                    success: false,
                    message: "User not found",
                });
            }

            // Check permissions
            if (
                (role === "government" &&
                req.user.category === "MunicipalCorporation" &&
                (userToVerify.role !== "government" ||
                    userToVerify.category !== "AreaCounsellor" ||
                    userToVerify.subcategory.municipalCorporationID.toString() !== req.user.id)) ||
                (role === "superAdmin" &&
                (userToVerify.role !== "government" ||
                    userToVerify.category !== "MunicipalCorporation"))
            ) {
                return res.status(403).json({
                    success: false,
                    message: "You don't have permission to verify this user",
                });
            }

            if (!approved) {
                // If rejected, delete the user
                await User.findByIdAndDelete(userId);
                return res.status(200).json({
                    success: true,
                    message: "Verification request rejected and user deleted",
                });
            }

            // If approved, update verified status
            userToVerify.verified = true;
            await userToVerify.save();

            return res.status(200).json({
                success: true,
                message: "User verified successfully",
                user: {
                    id: userToVerify._id,
                    username: userToVerify.username,
                    email: userToVerify.email,
                    role: userToVerify.role,
                    category: userToVerify.category,
                    verified: userToVerify.verified,
                },
            });
        } catch (error) {
            console.error("Handle verification request error:", error);
            return res.status(500).json({
                success: false,
                message: "Server error while handling verification request",
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
                verified: true, // Only return verified municipal corporations
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
                verified: true, // Only return verified area counsellors
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
                verified: true, // Only return verified municipal corporations
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

    // Get all verified municipal corporations (for area counsellor signup)
    getMunicipalCorporations: async (req, res) => {
        try {
            const municipalCorps = await User.find({
                role: "government",
                category: "MunicipalCorporation",
                verified: true
            }).select('_id name areaName');

            return res.status(200).json({
                success: true,
                data: municipalCorps
            });
        } catch (error) {
            console.error("Error fetching municipal corporations:", error);
            return res.status(500).json({
                success: false,
                message: "Server error while fetching municipal corporations",
                error: error.message
            });
        }
    },
};

module.exports = authController;
