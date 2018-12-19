const express = require('express');
const app = express();

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/sudoku.html');
});

app.get('/sudoku.css', function (req, res) {
  res.sendFile(__dirname + '/sudoku.css');
});

app.get('/js/sudoku.js', function (req, res) {
  res.sendFile(__dirname + '/js/sudoku.js');
});

app.listen(3000);
