const Issue = require('../models/issue.model');
const { getFileUrls } = require('../Middleware/uploadMiddleware');
const mongoose = require('mongoose');

// Helper function to check if ObjectId is valid
// Helper function to check if ObjectId is valid
const isValidObjectId = id => mongoose.Types.ObjectId.isValid(id);

// CRUD controllers
const issueController = {
  // Create a new issue
  createIssue: async (req, res) => {
    try {
      const {
        issueType, category, title, description, reportedBy,
        location, status, assignedTo, currentPhase
      } = req.body;

      // Get photo URLs if files were uploaded
      const photoUrls = getFileUrls(req);

      // Create new issue object
      const newIssue = new Issue({
        issueType,
        category,
        title,
        description,
        // Handle reportedBy - either parse if string or use directly if object
        reportedBy: typeof reportedBy === 'string' ? JSON.parse(reportedBy) : reportedBy,
        // Handle location - either parse if string or use directly if object
        location: typeof location === 'string' ? JSON.parse(location) : {
          ...location,
          coordinates: {
            type: 'Point',
            coordinates: location.coordinates.coordinates
          }
        },
        // Combine uploaded photos with any provided in the request
        photos: [...(req.body.photos || []), ...photoUrls],
        status: status || 'pending',
        // Handle assignedTo - either parse if string or use directly if object
        assignedTo: typeof assignedTo === 'string' ? JSON.parse(assignedTo) : assignedTo,
        currentPhase: currentPhase || 'verification'
      });

      // Save the issue
      const savedIssue = await newIssue.save();
      res.status(201).json(savedIssue);
    } catch (error) {
      console.error('Error creating issue:', error);
      res.status(400).json({ error: error.message });
    }
  },

  // Get all issues with pagination and filtering
  getAllIssues: async (req, res) => {
    try {
      const {
        page = 1,
        limit = 10,
        status,
        category,
        issueType,
        currentPhase,
        sortBy = 'createdAt',
        sortOrder = 'desc'
      } = req.query;

      // Create filter object
      const filter = {};
      if (status) filter.status = status;
      if (category) filter.category = category;
      if (issueType) filter.issueType = issueType;
      if (currentPhase) filter.currentPhase = currentPhase;

      // Create sort object
      const sort = {};
      sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

      // Calculate pagination
      const skip = (parseInt(page) - 1) * parseInt(limit);

      // Execute query with pagination
      const issues = await Issue.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit));

      // Get total count for pagination
      const total = await Issue.countDocuments(filter);

      res.status(200).json({
        issues,
        totalPages: Math.ceil(total / parseInt(limit)),
        currentPage: parseInt(page),
        totalIssues: total
      });
    } catch (error) {
      console.error('Error getting issues:', error);
      res.status(500).json({ error: error.message });
    }
  },

  // Get issue by ID
  getIssueById: async (req, res) => {
    try {
      const { id } = req.params;

      if (!isValidObjectId(id)) {
        return res.status(400).json({ error: 'Invalid issue ID format' });
      }

      const issue = await Issue.findById(id);
      if (!issue) {
        return res.status(404).json({ error: 'Issue not found' });
      }

      res.status(200).json(issue);
    } catch (error) {
      console.error('Error getting issue by ID:', error);
      res.status(500).json({ error: error.message });
    }
  },

  // Update issue
  updateIssue: async (req, res) => {
    try {
      const { id } = req.params;

      if (!isValidObjectId(id)) {
        return res.status(400).json({ error: 'Invalid issue ID format' });
      }

      // Check if issue exists
      const issue = await Issue.findById(id);
      if (!issue) {
        return res.status(404).json({ error: 'Issue not found' });
      }

      // Get updated fields from request body
      const updateData = { ...req.body };

      // Handle special fields that need parsing
      ['reportedBy', 'assignedTo', 'location'].forEach(field => {
        if (updateData[field] && typeof updateData[field] === 'string') {
          updateData[field] = JSON.parse(updateData[field]);
        }
      });

      // Handle photo uploads if any
      if (req.files && req.files.length > 0) {
        const photoUrls = getFileUrls(req);
        // Add to existing photos array
        updateData.photos = [...(issue.photos || []), ...photoUrls];
      }

      // Update the issue
      const updatedIssue = await Issue.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true, runValidators: true }
      );

      res.status(200).json(updatedIssue);
    } catch (error) {
      console.error('Error updating issue:', error);
      res.status(400).json({ error: error.message });
    }
  },

  // Delete issue
  deleteIssue: async (req, res) => {
    try {
      const { id } = req.params;

      if (!isValidObjectId(id)) {
        return res.status(400).json({ error: 'Invalid issue ID format' });
      }

      const result = await Issue.findByIdAndDelete(id);
      if (!result) {
        return res.status(404).json({ error: 'Issue not found' });
      }

      res.status(200).json({ message: 'Issue deleted successfully' });
    } catch (error) {
      console.error('Error deleting issue:', error);
      res.status(500).json({ error: error.message });
    }
  },

  // Update issue status
  updateIssueStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!isValidObjectId(id)) {
        return res.status(400).json({ error: 'Invalid issue ID format' });
      }

      // Validate status value
      const validStatuses = [
        "pending", "verified", "inProgress", "extended",
        "resolved", "rejected", "highPriority", "redZone"
      ];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: 'Invalid status value' });
      }

      const updatedIssue = await Issue.findByIdAndUpdate(
        id,
        { $set: { status, updatedAt: Date.now() } },
        { new: true }
      );

      if (!updatedIssue) {
        return res.status(404).json({ error: 'Issue not found' });
      }

      res.status(200).json(updatedIssue);
    } catch (error) {
      console.error('Error updating issue status:', error);
      res.status(500).json({ error: error.message });
    }
  },

  // Add comment to an issue
  addComment: async (req, res) => {
    try {
      const { id } = req.params;
      const { userId, username, comment } = req.body;

      if (!isValidObjectId(id)) {
        return res.status(400).json({ error: 'Invalid issue ID format' });
      }

      if (!comment) {
        return res.status(400).json({ error: 'Comment text is required' });
      }

      const newComment = {
        userId,
        username,
        comment,
        timestamp: new Date(),
        upvotes: 0
      };

      const updatedIssue = await Issue.findByIdAndUpdate(
        id,
        { $push: { comments: newComment } },
        { new: true }
      );

      if (!updatedIssue) {
        return res.status(404).json({ error: 'Issue not found' });
      }

      res.status(200).json(updatedIssue);
    } catch (error) {
      console.error('Error adding comment:', error);
      res.status(500).json({ error: error.message });
    }
  },

  // Upvote an issue
  upvoteIssue: async (req, res) => {
    try {
      const { id } = req.params;
      const { userId } = req.body;

      if (!isValidObjectId(id) || !isValidObjectId(userId)) {
        return res.status(400).json({ error: 'Invalid ID format' });
      }

      // Check if user already upvoted
      const issue = await Issue.findById(id);
      if (!issue) {
        return res.status(404).json({ error: 'Issue not found' });
      }

      const alreadyUpvoted = issue.upvotedBy.some(
        upvoterId => upvoterId.toString() === userId
      );

      let updateOperation;
      if (alreadyUpvoted) {
        // Remove upvote
        updateOperation = {
          $pull: { upvotedBy: userId },
          $inc: { upvotes: -1 }
        };
      } else {
        // Add upvote
        updateOperation = {
          $addToSet: { upvotedBy: userId },
          $inc: { upvotes: 1 }
        };
      }

      const updatedIssue = await Issue.findByIdAndUpdate(
        id,
        updateOperation,
        { new: true }
      );

      res.status(200).json(updatedIssue);
    } catch (error) {
      console.error('Error updating upvotes:', error);
      res.status(500).json({ error: error.message });
    }
  },

  // Update phase details
  updatePhaseDetails: async (req, res) => {
    try {
      const { id } = req.params;
      const { phase, phaseData } = req.body;

      console.log('Request Body:', req.body);

      if (!isValidObjectId(id)) {
        return res.status(400).json({ error: 'Invalid issue ID format' });
      }

      const validPhases = ["verification", "etaDeadline", "resolution"];
      if (!validPhases.includes(phase)) {
        return res.status(400).json({ error: 'Invalid phase value' });
      }

      if (!phaseData || typeof phaseData !== 'object') {
        return res.status(400).json({ error: 'phaseData is required and must be an object' });
      }

      const updateData = {
        currentPhase: phase,
        [`phaseDetails.${phase}`]: { ...phaseData },
        updatedAt: Date.now()
      };

      if (phase === 'resolution' && req.files && req.files.length > 0) {
        const proofUrls = getFileUrls(req);
        updateData[`phaseDetails.${phase}.proof`] = proofUrls;
      }

      console.log('Updating Issue:', id, 'with Data:', updateData);

      const updatedIssue = await Issue.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true }
      );

      if (!updatedIssue) {
        return res.status(404).json({ error: 'Issue not found' });
      }

      res.status(200).json(updatedIssue);
    } catch (error) {
      console.error('Error updating phase details:', error);
      res.status(500).json({ error: error.message });
    }
  }
  ,

  // Find issues by location (nearby)
  findIssuesByLocation: async (req, res) => {
    try {
      const { longitude, latitude, maxDistance = 5000 } = req.query; // maxDistance in meters, default 5km

      if (!longitude || !latitude) {
        return res.status(400).json({ error: 'Longitude and latitude are required' });
      }

      const issues = await Issue.find({
        'location.coordinates': {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [parseFloat(longitude), parseFloat(latitude)]
            },
            $maxDistance: parseInt(maxDistance)
          }
        }
      });

      res.status(200).json(issues);
    } catch (error) {
      console.error('Error finding issues by location:', error);
      res.status(500).json({ error: error.message });
    }
  },

  // Get issues by priority with search
 // In issue.controllers.js - add or replace the existing getIssuesByPriority

// Get issues by priority with advanced filtering
getIssuesByPriorityAdvanced: async (req, res) => {
  try {
    const {
      search = '', // For title/description search
      type,
      category,
      startDate,
      endDate,
      page = 1,
      limit = 10,
      // Custom priority weights
      highPriorityWeight = 50,
      redZoneWeight = 100,
      inProgressWeight = 30,
      extendedWeight = 40,
      pendingWeight = 20,
      verifiedWeight = 25,
      ageWeight = 2,
      maxAgeScore = 30,
      upvoteWeight = 1,
      commentWeight = 0.5,
      // Sort options
      sortField = 'priorityScore',
      sortDirection = 'desc'
    } = req.query;

    // Build base query
    let query = {};

    // Add search conditions
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        // Add reporter username search
        { 'reportedBy.username': { $regex: search, $options: 'i' } }
      ];
    }

    // Add type filter
    if (type) {
      query.issueType = type;
    }

    // Add category filter
    if (category) {
      query.category = category;
    }

    // Add date range filter
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) {
        query.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        query.createdAt.$lte = new Date(endDate);
      }
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get current date for age calculation
    const currentDate = new Date();

    // Determine sort direction
    const sortOrder = sortDirection === 'asc' ? 1 : -1;

    // Fetch issues with all required fields
    const issues = await Issue.aggregate([
      // Match the query conditions
      { $match: query },

      // Add calculated fields
      {
        $addFields: {
          // Calculate issue age in days
          ageInDays: {
            $divide: [
              { $subtract: [currentDate, "$createdAt"] },
              1000 * 60 * 60 * 24 // Convert to days
            ]
          },
          // Count total comments
          commentCount: { $size: "$comments" },
        }
      },

      // Calculate priority score
      {
        $addFields: {
          priorityScore: {
            $add: [
              // Base score from status weight
              {
                $switch: {
                  branches: [
                    { case: { $eq: ["$status", "highPriority"] }, then: parseFloat(highPriorityWeight) },
                    { case: { $eq: ["$status", "redZone"] }, then: parseFloat(redZoneWeight) },
                    { case: { $eq: ["$status", "inProgress"] }, then: parseFloat(inProgressWeight) },
                    { case: { $eq: ["$status", "extended"] }, then: parseFloat(extendedWeight) },
                    { case: { $eq: ["$status", "pending"] }, then: parseFloat(pendingWeight) },
                    { case: { $eq: ["$status", "verified"] }, then: parseFloat(verifiedWeight) }
                  ],
                  default: 0
                }
              },
              // Age score (capped at maxAgeScore)
              { $min: [
                { $multiply: ["$ageInDays", parseFloat(ageWeight)] }, 
                parseFloat(maxAgeScore)
              ]},
              // Upvotes score
              { $multiply: ["$upvotes", parseFloat(upvoteWeight)] },
              // Comments score
              { $multiply: ["$commentCount", parseFloat(commentWeight)] }
            ]
          }
        }
      },

      // Sort by specified field and direction
      { $sort: { [sortField]: sortOrder } },

      // Pagination
      { $skip: skip },
      { $limit: parseInt(limit) },

      // Project final fields
      {
        $project: {
          title: 1,
          description: 1,
          status: 1,
          category: 1,
          issueType: 1,
          createdAt: 1,
          updatedAt: 1,
          upvotes: 1,
          commentCount: 1,
          ageInDays: { $round: ["$ageInDays", 1] },
          priorityScore: { $round: ["$priorityScore", 1] },
          location: 1,
          photos: 1,
          currentPhase: 1,
          reportedBy: 1,
          phaseDetails: 1
        }
      }
    ]);

    // Get total count for pagination
    const total = await Issue.countDocuments(query);

    res.status(200).json({
      issues,
      totalPages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
      totalIssues: total,
      appliedWeights: {
        status: {
          redZone: parseFloat(redZoneWeight),
          highPriority: parseFloat(highPriorityWeight),
          extended: parseFloat(extendedWeight),
          inProgress: parseFloat(inProgressWeight),
          verified: parseFloat(verifiedWeight),
          pending: parseFloat(pendingWeight)
        },
        age: `${ageWeight} points per day (max ${maxAgeScore})`,
        upvotes: `${upvoteWeight} points each`,
        comments: `${commentWeight} points each`,
        sortedBy: sortField,
        sortDirection: sortDirection
      }
    });
  } catch (error) {
    console.error('Error getting issues by priority:', error);
    res.status(500).json({ error: error.message });
  }
}
};

module.exports = issueController;