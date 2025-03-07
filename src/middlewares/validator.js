async function validateGetRequest(req, res, next) {
  const { name } = req.params;
  console.log(name);
  if (!name) {
    return res.status(400).json({ error: 'Missing required parameter: name' });
  }

  next();
}

async function validatePostRequest(req, res, next) {
  const { name, type } = req.body;
  if (!name || !type) {
    return res
      .status(400)
      .json({ error: 'Missing required parameters: name and/or type' });
  }

  next();
}

async function validateUpdateRequest(req, res, next) {
  const { p_name } = req.params;
  const { name, type } = req.body;
  if (!p_name) {
    return res.status(400).json({ error: 'Missing required parameter: name' });
  }
  if (!name || !type) {
    return res.status(400).json({ error: 'No fields to update pokemon' });
  }

  next();
}

async function validateDeleteRequest(req, res, next) {
  const { name } = req.params;
  if (!name) {
    return res.status(400).json({ error: 'Missing required parameter: name' });
  }

  next();
}

module.exports = {
  validateGetRequest,
  validatePostRequest,
  validateUpdateRequest,
  validateDeleteRequest,
};
