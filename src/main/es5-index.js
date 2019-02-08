import { solveWorker } from './es5-worker';

// everything below must be identical to './index.js'

import setUpBoard from './ui-ux/board';
import setUpBadInputWarning from './ui-ux/bad-input';
import setUpClearButton from './ui-ux/clear-button';
import setUpSubmitButton from './ui-ux/submit-button';
import setUp81DigitEntryFromQueryParam from './ui-ux/81-digit-entry-from-query-param';
import setUp81DigitEntryFromInputBox from './ui-ux/81-digit-entry-from-input-box';
import setUpPermalinkButton from './ui-ux/permalink-button';

setUpBoard();
setUpBadInputWarning();
setUpClearButton(setUpBoard, setUpBadInputWarning);
setUpSubmitButton(solveWorker);
setUp81DigitEntryFromQueryParam();
setUp81DigitEntryFromInputBox();
setUpPermalinkButton();
