import setUpBoard from './ui-ux/board';
import setUpClearButton from './ui-ux/clear-button';
import setUpSubmitButton from './ui-ux/submit-button';
import setUp81DigitEntryFromQueryParam from './ui-ux/81-digit-entry-from-query-param';
import setUp81DigitEntryFromInputBox from './ui-ux/81-digit-entry-from-input-box';
import setUpPermalinkButton from './ui-ux/permalink-button';

export default solveWorker => {
  setUpBoard();
  setUpClearButton();
  setUpSubmitButton(solveWorker);
  setUp81DigitEntryFromQueryParam();
  setUp81DigitEntryFromInputBox();
  setUpPermalinkButton();
};
