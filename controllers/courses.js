const { Course } = require('../models');

const ErrorResponse = require('../utils/ErrorResponse');
const asyncHandler = require('../middlewares/async');

/**
 * @desc Get all
 * @route GET /api/v1/courses
 * @route GET /api/v1/bootcamps/:bootcampId/courses
 * @access Public
 */
exports.getCourses = asyncHandler(async (req, res, next) => {
  let query;
  const { bootcampId } = req.params;

  if (bootcampId) {
    query = Course.find({ bootcamp: bootcampId });
  } else {
    query = Course.find();
  }

  const courses = await query;

  res.status(200).json({
    success: true,
    count: courses.length,
    data: courses,
  });
});
