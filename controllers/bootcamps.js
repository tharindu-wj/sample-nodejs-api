const { Bootcamp } = require('../models');
const ErrorResponse = require('../utils/ErrorResponse');
const asyncHandler = require('../middlewares/async');

/**
 * @desc Get all
 * @route /api/v1/bootcamps
 * @access Public
 */
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  const bootcamps = await Bootcamp.find();
  res
    .status(200)
    .json({ success: true, count: bootcamps.length, data: bootcamps });
});

/**
 * @desc Get one
 * @route /api/v1/bootcamps/:id
 * @access Public
 */
exports.getBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);
  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found for id: ${req.params.id}`, 404)
    );
  }
  res.status(200).json({ success: true, data: bootcamp });
});

/**
 * @desc Create
 * @route /api/v1/bootcamps
 * @access Private
 */
exports.createBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.create(req.body);
  res.status(201).json({ success: true, data: bootcamp });
});

/**
 * @desc Update
 * @route /api/v1/bootcamps/:id
 * @access Private
 */
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found for id: ${req.params.id}`, 404)
    );
  }
  res.status(200).json({ success: true, data: bootcamp });
});

/**
 * @desc Delete
 * @route /api/v1/bootcamps/:id
 * @access Private
 */
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);
  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found for id: ${req.params.id}`, 404)
    );
  }
  res.status(200).json({ success: true, data: bootcamp });
});
