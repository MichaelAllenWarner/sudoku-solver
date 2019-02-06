import setUpBoard from './board';
import setUpBadInputWarning from './bad-input';
import setUpClearButton from './clear-button';
import setUpSubmitButton from './submit-button';
import setUpStringEntry from './string-entry';
import setUpPermalinkButton from './permalink-button';

setUpBoard();
setUpBadInputWarning();
setUpClearButton(setUpBoard, setUpBadInputWarning);
setUpSubmitButton();
setUpStringEntry();
setUpPermalinkButton();
