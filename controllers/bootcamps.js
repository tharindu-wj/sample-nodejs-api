const { Bootcamp } = require('../models');

const ErrorResponse = require('../utils/ErrorResponse');
const geocoder = require('../utils/geocoder');
const asyncHandler = require('../middlewares/async');

/**
 * @desc Get all
 * @route /api/v1/bootcamps
 * @access Public
 */
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  let query;
  const {
    select: selectQuery,
    sort: sortQuery,
    page,
    limit,
    ...queryParams
  } = req.query;

  // build query for operators
  let queryStr = JSON.stringify(queryParams);
  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );

  query = Bootcamp.find(JSON.parse(queryStr));

  // Select fields
  if (selectQuery) {
    const fields = selectQuery.split(',').join(' ');
    query = query.select(fields);
  }

  // Sort
  if (sortQuery) {
    const sortBy = sortQuery.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-createdAt');
  }

  //Pagination
  const pageNumber = parseInt(page, 10) || 1;
  const limitNumber = parseInt(limit, 10) || 25;
  const startIndex = (pageNumber - 1) * limit;
  const endIndex = pageNumber * limit;

  const totalBootcamps = await Bootcamp.countDocuments();

  query = query.skip(startIndex).limit(limitNumber);

  const bootcamps = await query;

  // Pagination Results
  const pagination = {};

  // if page is not last
  if (endIndex < totalBootcamps) {
    pagination.next = {
      page: pageNumber + 1,
      limit: limitNumber,
    };
  }

  // if page is not first
  if (startIndex > 0) {
    pagination.prev = {
      page: pageNumber - 1,
      limit: limitNumber,
    };
  }

  res.status(200).json({
    success: true,
    count: bootcamps.length,
    pagination,
    data: bootcamps,
  });
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

/**
 * @desc Get withing a radius
 * @route /api/v1/bootcamps/radius/:zipcode/:distance
 * @access Private
 */
exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params;

  //Get lat/long from geocoder
  const loc = await geocoder.geocode(zipcode);
  const { latitude, longitude } = loc[0];

  //calc radius using radians
  //Earth radius = 3,963 mi / 6,378 km
  const radius = distance / 3963;

  const bootcamps = await Bootcamp.find({
    location: {
      $geoWithin: { $centerSphere: [[longitude, latitude], radius] },
    },
  });

  res
    .status(200)
    .json({ success: true, count: bootcamps.length, data: bootcamps });
});
