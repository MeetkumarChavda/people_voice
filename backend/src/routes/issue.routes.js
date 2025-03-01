const express = require('express');
const router = express.Router();
const issueController = require('../controllers/issue.controllers');
const { uploadIssuePhotos, uploadProofPhotos } = require('../Middleware/uploadMiddleware');

// Create new issue with photo upload
router.post('/', uploadIssuePhotos, issueController.createIssue);

// Get all issues with filters and pagination
router.get('/', issueController.getAllIssues);

// Get issue by ID
router.get('/:id', issueController.getIssueById);

// Update issue with potential photo upload
router.put('/:id', uploadIssuePhotos, issueController.updateIssue);

// Delete issue
router.delete('/:id', issueController.deleteIssue);

// Update issue status
router.patch('/:id/status', issueController.updateIssueStatus);

// Add comment to an issue
router.post('/:id/comments', issueController.addComment);

// Upvote/downvote an issue
router.post('/:id/upvote', issueController.upvoteIssue);

// Update phase details with potential proof photo upload
router.patch('/:id/phase', uploadProofPhotos, issueController.updatePhaseDetails);

// Find issues by location
router.get('/location/nearby', issueController.findIssuesByLocation);

module.exports = router;