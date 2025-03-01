const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Create issue photos directory if it doesn't exist
const issueUploadsDir = path.join("public", "issues");
if (!fs.existsSync(issueUploadsDir)) {
    fs.mkdirSync(issueUploadsDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, issueUploadsDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname);
        cb(null, "issue-" + uniqueSuffix + ext);
    },
});

// File filter function
const fileFilter = (req, file, cb) => {
    // Accept images only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return cb(new Error("Only image files are allowed!"), false);
    }
    cb(null, true);
};

// Create multer instance with configuration
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB max file size
    },
});

// Create middleware function for multiple file uploads
const uploadIssuePhotos = upload.array("photos", 5); // 'photos' is the field name, 5 is max count

// Helper function to get file URLs from the uploaded files
const getFileUrls = (req) => {
    if (!req.files || req.files.length === 0) {
        return [];
    }

    return req.files.map((file) => `${file.filename}`);
};
// Proof image upload middleware
const uploadProofPhotos = upload.array("proof", 5); // 'proof' is the field name, 5 is max count

module.exports = {
    uploadIssuePhotos,
    uploadProofPhotos,
    getFileUrls,
};
