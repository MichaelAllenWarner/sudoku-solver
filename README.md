## Mike's Sudoku Solver

This single-page web app is [hosted on Heroku](https://mikes-sudoku-solver.herokuapp.com). It's my first Node/Express project, and it's written in vanilla Javascript (ES6), HTML, and CSS.

The solver works by first looping through the most basic "human" solving strategies until no further progress is made, and then repeating the whole process after making a guess on a cell with the fewest remaining possible values (it's a recursive function). If a contradiction is found, it "backs up" and guesses the next possible value on that cell. It continues doing this until it either finds a solution or discovers that all guesses on the initial cell result in a contradiction (i.e., the puzzle is invalid).

Coding the solver was much easier than I thought it would be. Or rather, coding the parts the *remain* was not difficult. For several days I practiced working with objects and arrays by implementing some more "advanced" Sudoku techniques, such as "Swordfish" and "X-Wing." This was time-consuming and challenging. In the end, however, I simplified the code by keeping only the most basic techniques and the recursive guessing.

Because Javascript is single-threaded, I found that the "Submit" button would freeze in its "pushed" state while the solver solved. This made for an unpleasant user experience. The solution was to move my solve function to a separate JS file and invoke it as a [Web Worker](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers). Now it runs on a separate thread, and the UI doesn't freeze up.
