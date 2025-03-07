async function getPokemonTotalCount(connection) {
  const query = 'SELECT COUNT(*) AS count FROM pokedex';
  return connection.query(query);
}

async function getPokemonTypesCount(connection) {
  const query = 'SELECT type, COUNT(*) AS count FROM pokedex GROUP BY type';
  return connection.query(query);
}

async function getPokemonByName(name, connection) {
  const query = 'SELECT * FROM pokedex WHERE name = ?';
  return connection.query(query, [name.toLowerCase()]);
}

async function getPokemonById(id, connection) {
  const query = 'SELECT * FROM pokedex WHERE id = ?';
  return connection.query(query, [id]);
}

async function createPokemon(pokemon, connection) {
  const query = 'INSERT INTO pokedex (name, type) VALUES (?, ?)';
  return connection.query(query, [pokemon.name, pokemon.type]);
}

async function updatePokemon(name, pokemon, connection) {
  let query = 'UPDATE pokedex SET ';
  const values = [];

  if (pokemon.newName) {
    query += 'name = ?, ';
    values.push(pokemon.newName);
  }

  if (pokemon.type) {
    query += 'type = ?, ';
    values.push(pokemon.type);
  }

  query = query.slice(0, -2);
  query += ' WHERE name = ?';
  values.push(name);

  return connection.query(query, values);
}

async function deletePokemon(name, connection) {
  const query = 'DELETE FROM pokedex WHERE name = ?';
  return connection.query(query, [name]);
}

module.exports = {
  getPokemonTotalCount,
  getPokemonTypesCount,
  getPokemonByName,
  getPokemonById,
  createPokemon,
  updatePokemon,
  deletePokemon,
};
