const express = require('express');
const app = express();

app.get('/', function (req, res) {
  res.sendFile(`${__dirname}/sudoku.html`);
});

app.use(express.static(`${__dirname}/public`));

app.listen(process.env.PORT || 3000);
