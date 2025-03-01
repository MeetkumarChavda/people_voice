const Area = require('../models/area.model');

/**
 * Create a new area
 */
exports.createArea = async (req, res) => {
  try {
    const area = new Area(req.body);
    await area.save();
    
    return res.status(201).json({
      success: true,
      data: area,
      message: 'Area created successfully'
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || 'Could not create area'
    });
  }
};

/**
 * Get all areas
 */
exports.getAllAreas = async (req, res) => {
  try {
    const areas = await Area.find({}).sort({ name: 1 });
    
    return res.status(200).json({
      success: true,
      count: areas.length,
      data: areas
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error retrieving areas'
    });
  }
};

/**
 * Get area by ID
 */
exports.getAreaById = async (req, res) => {
  try {
    const area = await Area.findById(req.params.id);
    
    if (!area) {
      return res.status(404).json({
        success: false,
        message: 'Area not found'
      });
    }
    
    return res.status(200).json({
      success: true,
      data: area
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error retrieving area'
    });
  }
};

/**
 * Get area by area code
 */
exports.getAreaByCode = async (req, res) => {
  try {
    const area = await Area.findOne({ areaCode: req.params.areaCode });
    
    if (!area) {
      return res.status(404).json({
        success: false,
        message: 'Area not found'
      });
    }
    
    return res.status(200).json({
      success: true,
      data: area
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error retrieving area'
    });
  }
};

/**
 * Update area
 */
exports.updateArea = async (req, res) => {
  try {
    const area = await Area.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!area) {
      return res.status(404).json({
        success: false,
        message: 'Area not found'
      });
    }
    
    return res.status(200).json({
      success: true,
      data: area,
      message: 'Area updated successfully'
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || 'Could not update area'
    });
  }
};

/**
 * Delete area
 */
exports.deleteArea = async (req, res) => {
  try {
    const area = await Area.findByIdAndDelete(req.params.id);
    
    if (!area) {
      return res.status(404).json({
        success: false,
        message: 'Area not found'
      });
    }
    
    return res.status(200).json({
      success: true,
      message: 'Area deleted successfully'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error deleting area'
    });
  }
};

/**
 * Find areas containing a point
 */
exports.findAreasByPoint = async (req, res) => {
  try {
    const { longitude, latitude } = req.query;
    
    if (!longitude || !latitude) {
      return res.status(400).json({
        success: false,
        message: 'Longitude and latitude are required'
      });
    }

    const areas = await Area.find({
      boundary: {
        $geoIntersects: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(longitude), parseFloat(latitude)]
          }
        }
      }
    });
    
    return res.status(200).json({
      success: true,
      count: areas.length,
      data: areas
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error finding areas'
    });
  }
};

/**
 * Update area statistics
 */
exports.updateAreaStatistics = async (req, res) => {
  try {
    const area = await Area.findByIdAndUpdate(
      req.params.id,
      { $set: { statistics: req.body } },
      { new: true, runValidators: true }
    );
    
    if (!area) {
      return res.status(404).json({
        success: false,
        message: 'Area not found'
      });
    }
    
    return res.status(200).json({
      success: true,
      data: area,
      message: 'Area statistics updated successfully'
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || 'Could not update area statistics'
    });
  }
};

/**
 * Find areas by counsellor ID
 */
exports.findAreasByCounsellor = async (req, res) => {
  try {
    const areas = await Area.find({ "counsellor.userId": req.params.userId });
    
    return res.status(200).json({
      success: true,
      count: areas.length,
      data: areas
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error finding areas'
    });
  }
};

/**
 * Get statistics for all areas
 */
exports.getAreasStatistics = async (req, res) => {
  try {
    const statistics = await Area.aggregate([
      {
        $group: {
          _id: null,
          totalAreas: { $sum: 1 },
          totalIssues: { $sum: "$statistics.totalIssues" },
          resolvedIssues: { $sum: "$statistics.resolvedIssues" },
          pendingIssues: { $sum: "$statistics.pendingIssues" },
          highPriorityIssues: { $sum: "$statistics.highPriorityIssues" },
          redZoneIssues: { $sum: "$statistics.redZoneIssues" },
          avgResolutionTime: { $avg: "$statistics.averageResolutionTime" }
        }
      }
    ]);
    
    return res.status(200).json({
      success: true,
      data: statistics[0] || {}
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error retrieving statistics'
    });
  }
};

/**
 * Update top categories for an area
 */
exports.updateTopCategories = async (req, res) => {
  try {
    const area = await Area.findByIdAndUpdate(
      req.params.id,
      { $set: { topCategories: req.body } },
      { new: true, runValidators: true }
    );
    
    if (!area) {
      return res.status(404).json({
        success: false,
        message: 'Area not found'
      });
    }
    
    return res.status(200).json({
      success: true,
      data: area,
      message: 'Top categories updated successfully'
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || 'Could not update top categories'
    });
  }
};