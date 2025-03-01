const express = require("express");
const router = express.Router();
const issueController = require("../controllers/issue.controllers");
const {
    uploadIssuePhotos,
    uploadProofPhotos,
} = require("../Middleware/uploadMiddleware");
const path = require("path");

// Serve photos with CORS headers
router.get("/photos/:filename", (req, res) => {
    const { filename } = req.params;
    res.sendFile(path.join(__dirname, "../../public/issues", filename));
});

// Create new issue with photo upload
router.post("/", uploadIssuePhotos, issueController.createIssue);

// Get all issues with filters and pagination
router.get("/", issueController.getAllIssues);

// Get issue by ID
router.get("/:id", issueController.getIssueById);

// Update issue with potential photo upload
router.put("/:id", uploadIssuePhotos, issueController.updateIssue);

// Delete issue
router.delete("/:id", issueController.deleteIssue);

// Update issue status
router.patch("/:id/status", issueController.updateIssueStatus);

// Add comment to an issue
router.post("/:id/comments", issueController.addComment);

// Upvote/downvote an issue
router.post("/:id/upvote", issueController.upvoteIssue);

// Update phase details with potential proof photo upload
router.patch(
    "/:id/phase",
    uploadProofPhotos,
    issueController.updatePhaseDetails
);

// Find issues by location
router.get("/location/nearby", issueController.findIssuesByLocation);

// Add this to your issue.routes.js file

// Get issues by priority with advanced filtering and custom weights
router.get("/priority/advanced", issueController.getIssuesByPriorityAdvanced);

module.exports = router;
