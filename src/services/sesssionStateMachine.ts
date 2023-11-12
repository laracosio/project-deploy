import { AdminActions } from '../enums/AdminActions';
import { AutomaticActions } from '../enums/AutomaticActions';
import { SessionStates } from '../enums/SessionStates';
import { StateError } from '../errors/StateError';
import { StateTransition } from '../types/types';

// The following code design was inspired by
// https://kbravh.dev/state-machine-in-typescript
// It outlines a possible structure for the creation of a state machine
export class SessionStateMachine {
  static readonly STATE_TRANSITIONS: StateTransition = {
    [SessionStates.LOBBY]: {
      [AdminActions.NEXT_QUESTION]: SessionStates.QUESTION_COUNTDOWN,
      [AdminActions.END]: SessionStates.END
    },
    [SessionStates.QUESTION_OPEN]: {
      [AdminActions.END]: SessionStates.END,
      [AdminActions.GO_TO_ANSWER]: SessionStates.ANSWER_SHOW,
      [AutomaticActions.CLOSE_QUESTION_AUTOMATIC]: SessionStates.QUESTION_CLOSE
    },
    [SessionStates.QUESTION_CLOSE]: {
      [AdminActions.GO_TO_FINAL_RESULTS]: SessionStates.FINAL_RESULTS,
      [AdminActions.GO_TO_ANSWER]: SessionStates.ANSWER_SHOW,
      [AdminActions.END]: SessionStates.END
    },
    [SessionStates.ANSWER_SHOW]: {
      [AdminActions.NEXT_QUESTION]: SessionStates.QUESTION_COUNTDOWN,
      [AdminActions.GO_TO_FINAL_RESULTS]: SessionStates.FINAL_RESULTS,
      [AdminActions.END]: SessionStates.END
    },
    [SessionStates.FINAL_RESULTS]: {
      [AdminActions.END]: SessionStates.END
    },
    [SessionStates.QUESTION_COUNTDOWN]: {
      [AdminActions.SKIP_COUNTDOWN]: SessionStates.QUESTION_OPEN,
      [AutomaticActions.OPEN_QUESTION_AUTOMATIC]: SessionStates.QUESTION_OPEN,
      [AdminActions.END]: SessionStates.END
    },
    [SessionStates.END]: {}
  };

  static getNextState = (state: SessionStates, action: AdminActions): SessionStates => {
    const newState = this.STATE_TRANSITIONS[state][action];
    if (!newState) {
      throw new StateError(`Action: ${action} is invalid from state: ${state}`);
    }
    return newState;
  };
}
