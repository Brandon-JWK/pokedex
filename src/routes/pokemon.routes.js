const validator = require('../middlewares/validator');
const normalizer = require('../middlewares/normalizer');
const pokemonController = require('../controllers/pokemon.controller');
const router = require('express').Router();

// GET /pokemon/count
router.get('/count', pokemonController.getPokemonTotalCount);

// GET /pokemon/types
router.get('/types', pokemonController.getPokemonTypesCount);

// GET /pokemon/:name
router.get(
  '/:name',
  validator.validateGetRequest,
  pokemonController.getPokemonByName
);

// POST /pokemon
router.post(
  '/',
  validator.validatePostRequest,
  pokemonController.createPokemon
);

//PUT /pokemon/:name
router.put(
  '/:name',
  validator.validateUpdateRequest,
  pokemonController.updatePokemon
);

// DELETE /pokemon/:name
router.delete(
  '/:name',
  validator.validateDeleteRequest,
  pokemonController.deletePokemon
);

module.exports = router;
