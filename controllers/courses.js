const Course = require('../models/Course')
const asyncHandler = require('../middleware/async')
const ErrorResponse = require('../utils/ErrorResponse')
const Bootcamp = require('../models/Bootcamp')


// @desc      Get courses
// @route     GET /api/v1/courses
// @route     GET /api/v1/bootcamps/:bootcampId/courses
// @access    Public
exports.getCourses = asyncHandler(async (req, res, next) => {
  if (req.params.bootcampId) {
    const courses = await Course.find({ bootcamp: req.params.bootcampId });

    return res.status(200).json({
      success: true,
      count: courses.length,
      data: courses
    });
  } else {
    res.status(200).json(res.advancedResults);
  }
});

// @desc    Get a single course
//@route    Get /api/v1/courses/:id
//@access   public
exports.getCourse = asyncHandler(async(req, res, next)=>{
    const course = await Course.findById(req.params.id).populate({
        path: 'bootcamp',
        select: 'name description'
    })

    console.log(req.param.id)
    if(!course){
        return next(new ErrorResponse(`No course with id of ${req.params.id}`), 404)
    }
    res.status(200).json({
        success: true,
        data: course
    })
})

// @desc    Post a single course
//@route    POST /api/v1/bootcamps/:bootcampId/courses
//@access   private

exports.createCourse = asyncHandler(async (req, res, next) => {
    req.body.bootcamp = req.params.bootcampId;
    req.body.user = req.user.id
  
    const bootcamp = await Bootcamp.findById(req.params.bootcampId);
  
    if (!bootcamp) {
      return next(
        new ErrorResponse(
          `No bootcamp with the id of ${req.params.bootcampId}`,
          404
        )
      );
    }

    //Make sure user is a bootcamp owner
    if(bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin'){
      return next(new ErrorResponse(`User ${req.user.id} is not authorized to add a course to ${bootcamp._id}`, 401))
    }
  
    const course = await Course.create(req.body);
  
    res.status(200).json({
      success: true,
      data: course
    });
  });

// @desc  Update a course
//@route    PUT /api/v1/courses/:id
//@access   private

exports.updateCourse = asyncHandler(async (req, res, next) => {
  
    let course = await Course.findById(req.params.id)
  
    if (!course) {
      return next(
        new ErrorResponse(
          `No course with the id of ${req.params.id}`,
          404
        )
      );
    }

  //Make sure user is a bootcamp owner
     if(course.user.toString() !== req.user.id && req.user.role !== 'admin'){
      return next(new ErrorResponse(`User ${req.user.id} is not authorized to add a course to ${bootcamp._id}`, 401))
    }

    course = await Course.findByIdAndUpdate(req.params.id, req.body, {
         new: true,
         runValidators: true
    })

    res.status(200).json({
      success: true,
      data: course
    })

  });

// @desc  Delete a course
//@route    DELLETE /api/v1/courses/:id
//@access   private

exports.deleteCourse = asyncHandler(async (req, res, next) => {
  
  let course = await Course.findById(req.params.id)

  if (!course) {
    return next(
      new ErrorResponse(
        `No course with the id of ${req.params.id}`,
        404
      )
    );
  }

  //Make sure user is a bootcamp owner
   if(course.user.toString() !== req.user.id && req.user.role !== 'admin'){
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to update a course. `, 401))
  }

  await course.remove()

  res.status(200).json({
    success: true,
    data: []
  })

});