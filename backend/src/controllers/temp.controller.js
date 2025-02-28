const Temp = require('../models/temp.model');

// Get all temp items
exports.getAllTemps = async (req, res) => {
    try {
        const temps = await Temp.find();
        res.status(200).json({
            success: true,
            data: temps
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};
// Create new temp item
exports.createTemp = async (req, res) => {
    try {
        const temp = await Temp.create(req.body);
        res.status(201).json({
            success: true,
            data: temp
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};
// Get single temp item
exports.getTemp = async (req, res) => {
    try {
        const temp = await Temp.findById(req.params.id);
        if (!temp) {
            return res.status(404).json({
                success: false,
                error: 'Item not found'
            });
        }
        res.status(200).json({
            success: true,
            data: temp
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Update temp item
exports.updateTemp = async (req, res) => {
    try {
        const temp = await Temp.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!temp) {
            return res.status(404).json({
                success: false,
                error: 'Item not found'
            });
        }
        res.status(200).json({
            success: true,
            data: temp
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// Delete temp item
exports.deleteTemp = async (req, res) => {
    try {
        const temp = await Temp.findByIdAndDelete(req.params.id);
        if (!temp) {
            return res.status(404).json({
                success: false,
                error: 'Item not found'
            });
        }
        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}; 