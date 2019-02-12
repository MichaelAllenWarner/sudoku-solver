import setUpWorker from './set-up-worker';
import setUpUiUx from './set-up-ui-ux';

const solveWorker = setUpWorker();
setUpUiUx(solveWorker);
