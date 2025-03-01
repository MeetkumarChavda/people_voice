const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const authController = require("../controllers/user.controller");
const authMiddleware = require("../Middleware/auth.middleware");

// Validation rules
const registerValidation = [
    check(
        "username",
        "Username is required and must be at least 3 characters"
    ).isLength({ min: 3 }),
    check("name", "Name is required").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password must be at least 6 characters").isLength({
        min: 6,
    }),
    check("role", "Role is required").isIn([
        "citizen",
        "organization",
        "government",
        "superAdmin",
    ]),
    check("category").custom((value, { req }) => {
        if (
            req.body.role === "organization" &&
            !["NGO", "other"].includes(value)
        ) {
            throw new Error("Organization must have category NGO or other");
        }
        if (
            req.body.role === "government" &&
            !["MunicipalCorporation", "AreaCounsellor"].includes(value)
        ) {
            throw new Error(
                "Government must have category MunicipalCorporation or AreaCounsellor"
            );
        }
        return true;
    }),
    check("subcategory").custom((value, { req }) => {
        if (
            req.body.role === "government" &&
            req.body.category === "AreaCounsellor" &&
            (!value || !value.municipalCorporationID)
        ) {
            throw new Error(
                "Area Counsellor must be associated with a Municipal Corporation"
            );
        }
        return true;
    }),
];

const loginValidation = [
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password is required").exists(),
];

const adminLoginValidation = [
    check("username", "Username is required").exists(),
    check("password", "Password is required").exists(),
];

// Public routes
router.post("/register", registerValidation, authController.register);
router.post("/login", loginValidation, authController.login);
router.post("/admin/login", adminLoginValidation, authController.adminLogin);

// Route to get all Municipal Corporations (for registration dropdown)
// This route is public and doesn't require authentication
router.get("/municipalcorporations", authController.getMunicipalCorporations);

// Protected routes - require authentication
router.get(
    "/profile",
    authMiddleware.authenticateUser,
    authMiddleware.checkVerified,
    authController.getProfile
);

router.put(
    "/profile",
    authMiddleware.authenticateUser,
    authMiddleware.checkVerified,
    authController.updateProfile
);

router.post(
    "/change-password",
    authMiddleware.authenticateUser,
    authMiddleware.checkVerified,
    [
        check("currentPassword", "Current password is required").exists(),
        check(
            "newPassword",
            "New password must be at least 6 characters"
        ).isLength({ min: 6 }),
    ],
    authController.changePassword
);

// Verification request routes
router.get(
    "/verification-requests",
    authMiddleware.authenticateUser,
    (req, res, next) => {
        // Allow both superAdmin and MunicipalCorporation users
        if (
            req.user.role === "superAdmin" ||
            (req.user.role === "government" &&
                req.user.category === "MunicipalCorporation" &&
                req.user.verified)
        ) {
            next();
        } else {
            res.status(403).json({
                success: false,
                message: "Access denied. Insufficient permissions.",
            });
        }
    },
    authController.getPendingVerificationRequests
);

router.post(
    "/verification-requests",
    authMiddleware.authenticateUser,
    [
        check("userId", "User ID is required").exists(),
        check("approved", "Approval status is required").isBoolean(),
    ],
    authController.handleVerificationRequest
);

// Get Area Counsellors by Municipal Corporation
router.get(
    "/municipal-corporations/:municipalCorpId/area-counsellors",
    authController.getAreaCounsellors
);

// Examples of role-restricted routes
router.get(
    "/admin-dashboard",
    authMiddleware.authenticateUser,
    authMiddleware.checkRole(["superAdmin"]),
    (req, res) => {
        res.status(200).json({
            success: true,
            message: "Admin dashboard access granted",
            data: { dashboard: "Admin dashboard data" },
        });
    }
);

router.get(
    "/municipalcorporations",
    authController.getAllMunicipalCorporationUsers
);

// Municipal Corporation dashboard route
router.get(
    "/municipal-dashboard",
    authMiddleware.authenticateUser,
    authMiddleware.checkVerified,
    authMiddleware.checkRole(["government"]),
    authMiddleware.checkCategory(["MunicipalCorporation"]),
    (req, res) => {
        res.status(200).json({
            success: true,
            message: "Municipal Corporation dashboard access granted",
            data: { dashboard: "Municipal dashboard data" },
        });
    }
);

// Area Counsellor dashboard route
router.get(
    "/counsellor-dashboard",
    authMiddleware.authenticateUser,
    authMiddleware.checkVerified,
    authMiddleware.checkRole(["government"]),
    authMiddleware.checkCategory(["AreaCounsellor"]),
    (req, res) => {
        res.status(200).json({
            success: true,
            message: "Area Counsellor dashboard access granted",
            data: { dashboard: "Counsellor dashboard data" },
        });
    }
);

// NGO dashboard route
router.get(
    "/ngo-dashboard",
    authMiddleware.authenticateUser,
    authMiddleware.checkVerified,
    authMiddleware.checkRole(["organization"]),
    authMiddleware.checkCategory(["NGO"]),
    (req, res) => {
        res.status(200).json({
            success: true,
            message: "NGO dashboard access granted",
            data: { dashboard: "NGO dashboard data" },
        });
    }
);

module.exports = router;
