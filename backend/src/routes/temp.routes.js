const express = require('express');
const router = express.Router();
const {
    getAllTemps,
    createTemp,
    getTemp,
    updateTemp,
    deleteTemp
} = require('../controllers/temp.controller');

router.get('/', getAllTemps);
router.post('/', createTemp);
router.get('/:id', getTemp);
router.put('/:id', updateTemp);
router.delete('/:id', deleteTemp);


module.exports = router; 