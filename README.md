# Mike’s Sudoku Solver

This single-page web app is [hosted on Heroku](https://mikes-sudoku-solver.herokuapp.com). It’s my first Node/Express project, and it’s written in vanilla Javascript (ES6+), HTML, and CSS.

The solver works by first looping through the most basic “human” solving strategies until no further progress is made, and then repeating the whole process after making a guess on a cell with the fewest remaining possible values (it’s a recursive function). If a contradiction is found, it “backs up” and guesses the next possible value on that cell. Otherwise it makes a guess on a new cell if needed and calls the recursive function again. It continues doing this until it either finds a solution or discovers that all guesses on the initial guessing-cell result in a contradiction (i.e., the puzzle is invalid).

Because Javascript is single-threaded, I found that the Submit button would freeze in its “pushed” state while the solver solved. This made for an unpleasant user experience. The fix was to move my solve function to a separate JS file and call it as a [Web Worker](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers). Now it runs on a separate thread, and the UI doesn’t freeze up.

Webpack bundles two versions of the modularized front-end source code: a slim ES6+ version for modern browsers, and a polyfill-bloated ES5 fallback compiled with Babel (set for compatibility with Internet Explorer 10+, the earliest IE to support Web Workers). Then in the HTML file, the ES6+ version is called with the `type="module"` attribute, while the ES5 version is called with the `nomodule` attribute. As explained [here](https://developers.google.com/web/fundamentals/primers/modules#browser), this forces legacy browsers to ignore the former and modern browsers to ignore the latter.

Here are a few “extremely difficult” puzzles you can paste into the string-entry box below the board, in case you’d like to see the solver in action:

* 5......8...3....69..6.8...3..8.7...61..2..7.......4.....7.9....2..1......4...5...
* 6.......5.9...4.2...3...8.....2.7.1.....5.....4.9.......8...3...2.1...7.5.......6
* ..9...4...7.3...2.8...6...71..8....6....1..7.....56...3....5..1.4.....9...2...7..
* .2..5...94....9.3...91....4..8....7.......6..6....7..3.1..9...8..52.....9....43..