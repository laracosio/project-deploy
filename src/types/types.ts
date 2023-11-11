import { AdminActions } from '../enums/AdminActions';
import { SessionStates } from '../enums/SessionStates';

export type StateTransition = {
  [startState in SessionStates]: {
    [entryAction in AdminActions]?: SessionStates;
  };
};
