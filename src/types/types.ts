import { AdminActions } from '../enums/AdminActions';
import { AutomaticActions } from '../enums/AutomaticActions';
import { SessionStates } from '../enums/SessionStates';

export type StateTransition = {
  [startState in SessionStates]: {
    [entryAction in AdminActions | AutomaticActions]?: SessionStates;
  };
};
