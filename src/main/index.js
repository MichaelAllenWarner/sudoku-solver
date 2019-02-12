import { solveWorker } from './worker';

// any changes made below must ALSO be made in 'es5-index.js'

import setUpWorkerMessageHandler from './utils/worker-onmessage-handler';
import setUpBoard from './ui-ux/board';
import setUpBadInputWarning from './ui-ux/bad-input';
import setUpClearButton from './ui-ux/clear-button';
import setUpSubmitButton from './ui-ux/submit-button';
import setUp81DigitEntryFromQueryParam from './ui-ux/81-digit-entry-from-query-param';
import setUp81DigitEntryFromInputBox from './ui-ux/81-digit-entry-from-input-box';
import setUpPermalinkButton from './ui-ux/permalink-button';

setUpWorkerMessageHandler(solveWorker);
setUpBoard();
setUpBadInputWarning();
setUpClearButton(setUpBoard, setUpBadInputWarning);
setUpSubmitButton(solveWorker);
setUp81DigitEntryFromQueryParam();
setUp81DigitEntryFromInputBox();
setUpPermalinkButton();
