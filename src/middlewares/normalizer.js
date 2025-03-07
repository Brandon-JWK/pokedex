async function normalizePokemonInput(req, res, next) {
  if (req.params) {
    req.params.name = req.params.name.toLowerCase();
  }
  if (req.body) {
    req.body.name = req.body.name.toLowerCase();
    req.body.type = req.body.type.toLowerCase();
  }
  next();
}

module.exports = { normalizePokemonInput };
