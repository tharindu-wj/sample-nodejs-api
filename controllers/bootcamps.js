/**
 * @desc Get all
 * @route /api/v1/bootcamps
 * @access Public
 */
exports.getBootcamps = (req, res, next) => {
  res.status(200).json({ success: true, msg: 'Show all' });
};

/**
 * @desc Get one
 * @route /api/v1/bootcamps/:id
 * @access Public
 */
exports.getBootcamp = (req, res, next) => {
  res.status(200).json({ success: true, msg: `Show ${req.params.id}` });
};

/**
 * @desc Create
 * @route /api/v1/bootcamps
 * @access Private
 */
exports.createBootcamp = (req, res, next) => {
  res.status(200).json({ success: true, msg: 'Create one' });
};

/**
 * @desc Update
 * @route /api/v1/bootcamps/:id
 * @access Private
 */
exports.updateBootcamp = (req, res, next) => {
  res.status(200).json({ success: true, msg: `Update ${req.params.id}` });
};


/**
 * @desc Delete 
 * @route /api/v1/bootcamps/:id
 * @access Private
 */
exports.deleteeBootcamp = (req, res, next) => {
  res.status(200).json({ success: true, msg: `Delete ${req.params.id}` });
};
