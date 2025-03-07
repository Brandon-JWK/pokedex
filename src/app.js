const express = require('express');
const app = express();

app.use(express.static('public'));
app.use(express.json());
app.use('/pokemon', require('./routes/pokemon.routes'));

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
