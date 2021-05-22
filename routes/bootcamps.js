const express = require('express');
const router = express.Router()
const {protect, authorize} = require('../middleware/auth')
const {getBootcamp, getBootcamps, createBootcamp, updateBootcamp, deleteBootcamp, getBootcampsInRadius, bootcampUpload} = require('../controllers/bootcamps')

const advancedResults = require('../middleware/advancedResults')
const Bootcamp = require('../models/Bootcamp')

//Include other resource routers
const courseRouter = require('./courses')

// Reroute into other resource routers
router.use('/:bootcampId/courses', courseRouter)


router.route('/radius/:zipcode/:distance').get(getBootcampsInRadius)
router.route('/').get(advancedResults(Bootcamp, 'courses'), getBootcamps).post(protect, authorize('publisher', 'admin'), createBootcamp)
router.route('/:id').get(getBootcamp).put(protect ,authorize('publisher', 'admin') ,updateBootcamp).delete(protect, authorize('publisher', 'admin') ,deleteBootcamp)
router.route('/:id/photo').put(protect, authorize('publisher', 'admin') ,bootcampUpload)


module.exports = router