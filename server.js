const express = require('express');
const app = express();

app.get('/', function (req, res) {
  res.sendFile(`${__dirname}/sudoku.html`);
});

app.use(express.static(`${__dirname}/public`));

const port = process.env.PORT || 3000;

app.listen(port, (() => {
  console.log(`server is running on port ${port}`);
})(port));
