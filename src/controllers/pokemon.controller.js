const pool = require('../config/db');
const pokemonModel = require('../models/pokemon.model');

async function getPokemonTotalCount(req, res) {
  let connection;
  try {
    connection = await pool.getConnection();
    const [rows] = await pokemonModel.getPokemonTotalCount(connection);
    return res.status(200).json({ count: rows[0].count });
  } catch (e) {
    console.log(e);
    return res
      .status(e.status || 500)
      .json({ error: e.message || 'Server error' });
  } finally {
    if (connection) connection.release();
  }
}

async function getPokemonTypesCount(req, res) {
  let connection;
  try {
    connection = await pool.getConnection();
    const [rows] = await pokemonModel.getPokemonTypesCount(connection);
    return res.status(200).json({ types: rows });
  } catch (e) {
    console.log(e);
    return res
      .status(e.status || 500)
      .json({ error: e.message || 'Server error' });
  } finally {
    if (connection) connection.release();
  }
}

async function getPokemonByName(req, res) {
  let connection;
  try {
    const { name } = req.params;
    connection = await pool.getConnection();
    const [rows] = await pokemonModel.getPokemonByName(name, connection);
    if (rows.length < 1) {
      const error = new Error('Pokemon not found');
      error.status = 404;
      throw error;
    }

    return res.status(200).json(rows[0]);
  } catch (e) {
    console.log(e);
    return res
      .status(e.status || 500)
      .json({ error: e.message || 'Server error' });
  } finally {
    if (connection) connection.release();
  }
}

async function createPokemon(req, res) {
  // declare connection outside of try block so that it can be accessed in catch/finally block
  let connection;
  try {
    const pokemon = req.body;

    connection = await pool.getConnection();
    // transaction locks the a 'gap' for insertion with the name of the pokemon
    // it prevents race condition where another person trying to insert the same pokemon
    // at the same time
    await connection.beginTransaction();

    const [result] = await pokemonModel.createPokemon(pokemon, connection);
    if (result.affectedRows === 0) {
      const error = new Error('Pokemon not created');
      error.status = 400;
      throw error;
    }

    // if required to return a new object of the created pokemon
    // const [newRows] = await pokemonModel.getPokemonById(
    //   result.insertId,
    //   connection
    // );

    connection.commit();

    return res.status(201).json({
      message: `${
        pokemon.name.charAt(0).toUpperCase() +
        pokemon.name.toLowerCase().slice(1)
      } has been added.`,
    });
  } catch (e) {
    console.log(e.code);
    if (connection) connection.rollback();

    if (e.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Pokemon already exists' });
    } else if (e.status) {
      return res.status(e.status).json({ error: e.message });
    } else {
      return res.status(500).json({ error: 'Server error' });
    }
  } finally {
    if (connection) connection.release();
  }
}

async function updatePokemon(req, res) {
  let connection;
  try {
    const { name } = req.params;
    const pokemon = req.body;

    connection = await pool.getConnection();
    await connection.beginTransaction();

    // why in update we need to check whether pokemon exists or not, while in create we don't need to check?
    const [rows] = await pokemonModel.getPokemonByName(name, connection);
    if (rows.length < 1) {
      const error = new Error('Pokemon not found');
      error.status = 404;
      throw error;
    }

    const [results] = await pokemonModel.updatePokemon(
      name,
      pokemon,
      connection
    );
    if (results.affectedRows === 0) {
      const error = new Error('Database error: Pokemon not updated');
      error.status = 500;
      throw error;
    }

    // if required to return the updated resource
    // const [newRows] = await pokemonModel.getPokemonByName(name, connection);

    await connection.commit();
    return res.status(200).json({
      message: `${
        name.charAt(0).toUpperCase() + name.toLowerCase().slice(1)
      } has been updated.`,
    });
  } catch (e) {
    console.log(e);
    if (connection) connection.rollback();
    return res
      .status(e.status || 500)
      .json({ error: e.message || 'Server error' });
  } finally {
    if (connection) connection.release();
  }
}

async function deletePokemon(req, res) {
  let connection;
  try {
    const { name } = req.params;
    if (!name) {
      const error = new Error('Missing required parameter: name');
      error.status = 400;
      throw error;
    }

    connection = await pool.getConnection();
    await connection.beginTransaction();

    // this checking is unnecessary because the delete query will return 0 affected rows if the pokemon does not exist
    // but for the sake giving user a better error message, we perform a checking here
    // the reason is there a few possibilities of 0 affected rows - for one is the pokemon does not exist; the other is the pokemon exist but the database is unable to delete it
    const [rows] = await pokemonModel.getPokemonByName(name, connection);
    if (rows.length < 1) {
      const error = new Error('Pokemon not found');
      error.status = 404;
      throw error;
    }

    // because of foreign key constraints there is a possiblity of being unable to delete the pokemon (server issue)
    const [results] = await pokemonModel.deletePokemon(name, connection);
    if (results.affectedRows === 0) {
      const error = new Error('Database error: Unable to delete pokemon');
      error.status = 500;
      throw error;
    }

    connection.commit();

    return res.status(200).json({
      message: `${
        name.charAt(0).toUpperCase() + name.toLowerCase().slice(1)
      } has been deleted.`,
    });
  } catch (e) {
    console.log(e);
    if (connection) connection.rollback();
    return res
      .status(e.status || 500)
      .json({ error: e.message || 'Server error' });
  } finally {
    if (connection) connection.release();
  }
}

module.exports = {
  getPokemonTotalCount,
  getPokemonTypesCount,
  getPokemonByName,
  createPokemon,
  updatePokemon,
  deletePokemon,
};
