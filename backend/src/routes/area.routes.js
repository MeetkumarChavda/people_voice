const express = require('express');
const router = express.Router();
const areaController = require('../controllers/area.controller');
// const { authenticate, authorize } = require('../middleware/auth');

// Create a new area
// Only admin can create an area
// router.post('/', authenticate, authorize(['admin']), areaController.createArea);
router.post('/',  areaController.createArea);

// Get all areas
router.get('/', areaController.getAllAreas);

// Get area by ID
router.get('/:id', areaController.getAreaById);

// Get area by area code
router.get('/code/:areaCode', areaController.getAreaByCode);

// Update area
// router.put('/:id', authenticate, authorize(['admin']), areaController.updateArea);
router.put('/:id',  areaController.updateArea);

// Delete area
// router.delete('/:id', authenticate, authorize(['admin']), areaController.deleteArea);
router.delete('/:id',  areaController.deleteArea);

// Find areas containing a point
router.get('/point/find', areaController.findAreasByPoint);

// Update area statistics
// router.patch('/:id/statistics', authenticate, authorize(['admin', 'counsellor']), areaController.updateAreaStatistics);
router.patch('/:id/statistics',  areaController.updateAreaStatistics);

module.exports = router;