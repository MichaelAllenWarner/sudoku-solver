import { solveWorker } from './worker';
import setUpBoard from './board';
import setUpBadInputWarning from './bad-input';
import setUpClearButton from './clear-button';
import setUpSubmitButton from './submit-button';
import setUp81DigitEntry from './81-digit-entry';
import setUpPermalinkButton from './permalink-button';

setUpBoard();
setUpBadInputWarning();
setUpClearButton(setUpBoard, setUpBadInputWarning);
setUpSubmitButton(solveWorker);
setUp81DigitEntry();
setUpPermalinkButton();
