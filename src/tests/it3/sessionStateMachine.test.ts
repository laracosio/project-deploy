import { SessionStateMachine } from '../../services/sesssionStateMachine';
import { SessionStates } from '../../enums/SessionStates';
import { AdminActions } from '../../enums/AdminActions';

describe('Success Cases', () => {
  test('LOBBY to END', () => {
    const nextState = SessionStateMachine.getNextState(SessionStates.LOBBY, AdminActions.END);
    expect(nextState).toStrictEqual(SessionStates.END);
  });
  test('LOBBY to QUESTION_COUNTDOWN', () => {
    const nextState = SessionStateMachine.getNextState(SessionStates.LOBBY, AdminActions.NEXT_QUESTION);
    expect(nextState).toStrictEqual(SessionStates.QUESTION_COUNTDOWN);
  });
  test('QUESTION_COUNTDOWN to QUESTION_OPEN', () => {
    const nextState = SessionStateMachine.getNextState(SessionStates.QUESTION_COUNTDOWN, AdminActions.SKIP_COUNTDOWN);
    expect(nextState).toStrictEqual(SessionStates.QUESTION_OPEN);
  });
  test('QUESTION_COUNTDOWN to END', () => {
    const nextState = SessionStateMachine.getNextState(SessionStates.QUESTION_COUNTDOWN, AdminActions.END);
    expect(nextState).toStrictEqual(SessionStates.END);
  });
  test('QUESTION_OPEN to END', () => {
    const nextState = SessionStateMachine.getNextState(SessionStates.QUESTION_OPEN, AdminActions.END);
    expect(nextState).toStrictEqual(SessionStates.END);
  });
  test('QUESTION_OPEN to ANSWER_SHOW', () => {
    const nextState = SessionStateMachine.getNextState(SessionStates.QUESTION_OPEN, AdminActions.GO_TO_ANSWER);
    expect(nextState).toStrictEqual(SessionStates.ANSWER_SHOW);
  });
  test('QUESTION_CLOSE to END', () => {
    const nextState = SessionStateMachine.getNextState(SessionStates.QUESTION_CLOSE, AdminActions.END);
    expect(nextState).toStrictEqual(SessionStates.END);
  });
  test('QUESTION_CLOSE to FINAL_RESULT', () => {
    const nextState = SessionStateMachine.getNextState(SessionStates.QUESTION_CLOSE, AdminActions.GO_TO_FINAL_RESULTS);
    expect(nextState).toStrictEqual(SessionStates.FINAL_RESULTS);
  });
  test('QUESTION_CLOSE to ANSWER_SHOW', () => {
    const nextState = SessionStateMachine.getNextState(SessionStates.QUESTION_CLOSE, AdminActions.GO_TO_ANSWER);
    expect(nextState).toStrictEqual(SessionStates.ANSWER_SHOW);
  });
  test('FINAL_RESULT to END', () => {
    const nextState = SessionStateMachine.getNextState(SessionStates.FINAL_RESULTS, AdminActions.END);
    expect(nextState).toStrictEqual(SessionStates.END);
  });
  test('ANSWER_SHOW to END', () => {
    const nextState = SessionStateMachine.getNextState(SessionStates.ANSWER_SHOW, AdminActions.END);
    expect(nextState).toStrictEqual(SessionStates.END);
  });
  test('ANSWER_SHOW to FINAL_RESULT', () => {
    const nextState = SessionStateMachine.getNextState(SessionStates.ANSWER_SHOW, AdminActions.GO_TO_FINAL_RESULTS);
    expect(nextState).toStrictEqual(SessionStates.FINAL_RESULTS);
  });
  test('ANSWER_SHOW to QUESTION_COUNTDOWN', () => {
    const nextState = SessionStateMachine.getNextState(SessionStates.ANSWER_SHOW, AdminActions.NEXT_QUESTION);
    expect(nextState).toStrictEqual(SessionStates.QUESTION_COUNTDOWN);
  });
});
describe('Error Cases', () => {
  test('Error: LOBBY to QUESTION_OPEN', () => {
    expect(() => {
      SessionStateMachine.getNextState(SessionStates.LOBBY, AdminActions.SKIP_COUNTDOWN);
    }).toThrow('Action: SKIP_COUNTDOWN is invalid from state: LOBBY');
  });
  test('Error: LOBBY to FINAL_RESULTS', () => {
    expect(() => {
      SessionStateMachine.getNextState(SessionStates.LOBBY, AdminActions.GO_TO_FINAL_RESULTS);
    }).toThrow('Action: GO_TO_FINAL_RESULTS is invalid from state: LOBBY');
  });
  test('Error: LOBBY to ANSWER_SHOW', () => {
    expect(() => {
      SessionStateMachine.getNextState(SessionStates.LOBBY, AdminActions.GO_TO_ANSWER);
    }).toThrow('Action: GO_TO_ANSWER is invalid from state: LOBBY');
  });
  test('Error: QUESTION_COUNTDOWN to FINAL_RESULTS', () => {
    expect(() => {
      SessionStateMachine.getNextState(SessionStates.QUESTION_COUNTDOWN, AdminActions.GO_TO_FINAL_RESULTS);
    }).toThrow('Action: GO_TO_FINAL_RESULTS is invalid from state: QUESTION_COUNTDOWN');
  });
  test('Error: QUESTION_COUNTDOWN to ANSWER_SHOW', () => {
    expect(() => {
      SessionStateMachine.getNextState(SessionStates.QUESTION_COUNTDOWN, AdminActions.GO_TO_ANSWER);
    }).toThrow('Action: GO_TO_ANSWER is invalid from state: QUESTION_COUNTDOWN');
  });
  test('Error: QUESTION_OPEN to QUESTION_COUNTDOWN', () => {
    expect(() => {
      SessionStateMachine.getNextState(SessionStates.QUESTION_OPEN, AdminActions.SKIP_COUNTDOWN);
    }).toThrow('Action: SKIP_COUNTDOWN is invalid from state: QUESTION_OPEN');
  });
  test('Error: FINAL_RESULTS to QUESTION_COUNTDOWN', () => {
    expect(() => {
      SessionStateMachine.getNextState(SessionStates.FINAL_RESULTS, AdminActions.NEXT_QUESTION);
    }).toThrow('Action: NEXT_QUESTION is invalid from state: FINAL_RESULTS');
  });
  test('Error: FINAL_RESULTS to ANSWER_SHOW', () => {
    expect(() => {
      SessionStateMachine.getNextState(SessionStates.FINAL_RESULTS, AdminActions.GO_TO_ANSWER);
    }).toThrow('Action: GO_TO_ANSWER is invalid from state: FINAL_RESULTS');
  });
  test('Error: ANSWER_SHOW to QUESTION_OPEN', () => {
    expect(() => {
      SessionStateMachine.getNextState(SessionStates.ANSWER_SHOW, AdminActions.SKIP_COUNTDOWN);
    }).toThrow('Action: SKIP_COUNTDOWN is invalid from state: ANSWER_SHOW');
  });
});
