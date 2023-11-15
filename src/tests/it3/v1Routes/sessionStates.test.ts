import { SessionStatus } from '../../../dataStore';
import { AdminActions } from '../../../enums/AdminActions';
import { HttpStatusCode } from '../../../enums/HttpStatusCode';
import { SessionStates } from '../../../enums/SessionStates';
import { person2, person3 } from '../../../testingData';
import { clearRequest } from '../../it2/serverTestHelperIt2';
import { apiGet, apiPost, apiPut, sessionStatusRequest } from '../../serverTestHelperIt3';
const postQuestionBody = {
  questionBody: {
    question: 'Test question',
    duration: 4,
    points: 5,
    answers: [
      { answer: 'Prince Charles', correct: true },
      { answer: 'Queen Charles', correct: true },
      { answer: 'King Charles', correct: true },
      { answer: 'Princess Charles', correct: true },
    ],
  }
};

describe('GET /v1/admin/quiz/{quizId}/session/{sessionId}', () => {
  beforeEach(() => {
    clearRequest();
  });

  test('success', () => {
    const postRegister = apiPost('/v1/admin/auth/register', person2, {});
    const postQuiz = apiPost(
      '/v1/admin/quiz',
      {
        token: postRegister.getParsedBody().token,
        name: 'my quiz',
        description: 'quiz description',
      },
      {}
    );
    apiPost(
            `/v2/admin/quiz/${postQuiz.getParsedBody().quizId}/question`,
            postQuestionBody,
            { token: postRegister.getParsedBody().token }
    );
    const postSession = apiPost(
            `/v1/admin/quiz/${postQuiz.getParsedBody().quizId}/session/start`,
            { autoStartNum: 3 },
            { token: postRegister.getParsedBody().token }
    );
    const getSession = apiGet(
            `/v1/admin/quiz/${postQuiz.getParsedBody().quizId}/session/${postSession.getParsedBody().sessionId}`,
            { token: postRegister.getParsedBody().token }
    );
    const session: SessionStatus = getSession.getParsedBody();
    expect(session.state).toStrictEqual('LOBBY');
    expect(session.atQuestion).toStrictEqual(1);
    expect(session.players).toEqual([]);
    expect(session.metadata.quizId).toStrictEqual(postQuiz.getParsedBody().quizId);
    expect(session.metadata.name).toStrictEqual('my quiz');
    expect(session.metadata.description).toStrictEqual('quiz description');
    expect(session.metadata.numQuestions).toStrictEqual(1);
    expect(session.metadata.duration).toStrictEqual(4);
    expect(session.metadata.questions[0].questionId).toStrictEqual(1);
  });

  test('Error - Session Id does not refer to a valid session within this quiz', () => {
    const postRegister = apiPost('/v1/admin/auth/register', person2, {});
    const postQuiz = apiPost(
      '/v1/admin/quiz',
      {
        token: postRegister.getParsedBody().token,
        name: 'my quiz',
        description: 'quiz description',
      },
      {}
    );

    apiPost(
            `/v2/admin/quiz/${postQuiz.getParsedBody().quizId}/question`,
            postQuestionBody,
            { token: postRegister.getParsedBody().token }
    );
    apiPost(
            `/v1/admin/quiz/${postQuiz.getParsedBody().quizId}/session/start`,
            { autoStartNum: 3 },
            { token: postRegister.getParsedBody().token }
    );

    const postQuiz2 = apiPost(
      '/v1/admin/quiz',
      {
        token: postRegister.getParsedBody().token,
        name: 'my quiz2',
        description: 'quiz description2',
      },
      {}
    );

    apiPost(
            `/v2/admin/quiz/${postQuiz2.getParsedBody().quizId}/question`,
            postQuestionBody,
            { token: postRegister.getParsedBody().token }
    );
    const postSession2 = apiPost(
            `/v1/admin/quiz/${postQuiz2.getParsedBody().quizId}/session/start`,
            { autoStartNum: 3 },
            { token: postRegister.getParsedBody().token }
    );
    const getSession = apiGet(
            `/v1/admin/quiz/${postQuiz.getParsedBody().quizId}/session/${postSession2.getParsedBody().sessionId}`,
            { token: postRegister.getParsedBody().token }
    );
    expect(getSession.response.statusCode).toStrictEqual(HttpStatusCode.BAD_REQUEST);
  });

  test('Error - Token is empty or invalid (does not refer to valid logged in user session)', () => {
    const postRegister = apiPost('/v1/admin/auth/register', person2, {});
    const postQuiz = apiPost(
      '/v1/admin/quiz',
      {
        token: postRegister.getParsedBody().token,
        name: 'my quiz',
        description: 'quiz description',
      },
      {}
    );
    apiPost(
            `/v2/admin/quiz/${postQuiz.getParsedBody().quizId}/question`,
            postQuestionBody,
            { token: postRegister.getParsedBody().token }
    );
    // start session
    const postSession = apiPost(
            `/v1/admin/quiz/${postQuiz.getParsedBody().quizId}/session/start`,
            { autoStartNum: 3 },
            { token: postRegister.getParsedBody().token }
    );
    const getSession = apiGet(
            `/v1/admin/quiz/${postQuiz.getParsedBody().quizId}/session/${postSession.getParsedBody().sessionId}`,
            {
              token: -1,
            }
    );

    expect(getSession.response.statusCode).toStrictEqual(HttpStatusCode.UNAUTHORISED);
  });

  test('Error - Valid token is provided, but user is not authorised to view this session', () => {
    const postRegister = apiPost('/v1/admin/auth/register', person2, {});
    const postRegisterInvalid = apiPost('/v1/admin/auth/register', person3, {});
    const postQuiz = apiPost(
      '/v1/admin/quiz',
      {
        token: postRegister.getParsedBody().token,
        name: 'my quiz',
        description: 'quiz description',
      },
      {}
    );
    apiPost(
            `/v2/admin/quiz/${postQuiz.getParsedBody().quizId}/question`,
            postQuestionBody,
            { token: postRegister.getParsedBody().token }
    );
    const postSession = apiPost(
            `/v1/admin/quiz/${postQuiz.getParsedBody().quizId}/session/start`,
            { autoStartNum: 3 },
            { token: postRegister.getParsedBody().token }
    );
    const getSession = apiGet(
            `/v1/admin/quiz/${postQuiz.getParsedBody().quizId}/session/${postSession.getParsedBody().sessionId}`,
            {
              token: postRegisterInvalid.getParsedBody().token,
            }
    );
    expect(getSession.response.statusCode).toStrictEqual(HttpStatusCode.FORBIDDEN);
  });
});

// update session state
describe('PUT /v1/admin/quiz/{quizid}/session/{sessionid}', () => {
  beforeEach(() => {
    clearRequest();
  });

  test('200', () => {
    // given
    const postRegister = apiPost('/v1/admin/auth/register', person2, {});
    const postQuiz = apiPost(
      '/v1/admin/quiz',
      {
        token: postRegister.getParsedBody().token,
        name: 'my quiz',
        description: 'quiz description',
      },
      {}
    );
    apiPost(
            `/v2/admin/quiz/${postQuiz.getParsedBody().quizId}/question`,
            postQuestionBody,
            { token: postRegister.getParsedBody().token }
    );
    const postSession = apiPost(
            `/v1/admin/quiz/${postQuiz.getParsedBody().quizId}/session/start`,
            { autoStartNum: 3 },
            { token: postRegister.getParsedBody().token }
    );
    // when
    apiPut(
            `/v1/admin/quiz/${postQuiz.getParsedBody().quizId}/session/${postSession.getParsedBody().sessionId}`,
            { action: AdminActions.NEXT_QUESTION },
            { token: postRegister.getParsedBody().token }
    );
    // then
    const getSession = apiGet(
            `/v1/admin/quiz/${postQuiz.getParsedBody().quizId}/session/${postSession.getParsedBody().sessionId}`,
            { token: postRegister.getParsedBody().token }
    );
    const getSessionBody: SessionStatus = getSession.getParsedBody();
    expect(getSessionBody.state).toStrictEqual(SessionStates.QUESTION_COUNTDOWN);
  });

  test('401 - Invalid token', () => {
    const putSession = apiPut('/v1/admin/quiz/4/session/5', { action: AdminActions.NEXT_QUESTION }, { token: '1234' });
    expect(putSession.response.statusCode).toStrictEqual(HttpStatusCode.UNAUTHORISED);
  });

  test('403 - Valid token but unauthorized user', () => {
    // given
    const postRegister = apiPost('/v1/admin/auth/register', person2, {});
    const postRegisterInvalid = apiPost('/v1/admin/auth/register', person3, {});
    const postQuiz = apiPost(
      '/v1/admin/quiz',
      {
        token: postRegister.getParsedBody().token,
        name: 'my quiz',
        description: 'quiz description',
      },
      {}
    );
    apiPost(
            `/v2/admin/quiz/${postQuiz.getParsedBody().quizId}/question`,
            postQuestionBody,
            { token: postRegister.getParsedBody().token }
    );
    const postSession = apiPost(
            `/v1/admin/quiz/${postQuiz.getParsedBody().quizId}/session/start`,
            { autoStartNum: 3 },
            { token: postRegister.getParsedBody().token }
    );
    // when
    const putSession = apiPut(
            `/v1/admin/quiz/${postQuiz.getParsedBody().quizId}/session/${postSession.getParsedBody().sessionId}`,
            { action: AdminActions.NEXT_QUESTION },
            { token: postRegisterInvalid.getParsedBody().token }
    );
    // then
    expect(putSession.response.statusCode).toStrictEqual(HttpStatusCode.FORBIDDEN);
  });

  test('400 - Session id invalid', () => {
    // given
    const postRegister = apiPost('/v1/admin/auth/register', person2, {});
    const postQuiz = apiPost(
      '/v1/admin/quiz',
      {
        token: postRegister.getParsedBody().token,
        name: 'my quiz',
        description: 'quiz description',
      },
      {}
    );
    apiPost(
            `/v2/admin/quiz/${postQuiz.getParsedBody().quizId}/question`,
            postQuestionBody,
            { token: postRegister.getParsedBody().token }
    );
    apiPost(
            `/v1/admin/quiz/${postQuiz.getParsedBody().quizId}/session/start`,
            { autoStartNum: 3 },
            { token: postRegister.getParsedBody().token }
    );
    const postQuiz2 = apiPost(
      '/v1/admin/quiz',
      {
        token: postRegister.getParsedBody().token,
        name: 'my quiz2',
        description: 'quiz description2',
      },
      {}
    );

    apiPost(
            `/v2/admin/quiz/${postQuiz2.getParsedBody().quizId}/question`,
            postQuestionBody,
            { token: postRegister.getParsedBody().token }
    );
    const postSession2 = apiPost(
            `/v1/admin/quiz/${postQuiz2.getParsedBody().quizId}/session/start`,
            { autoStartNum: 3 },
            { token: postRegister.getParsedBody().token }
    );
    // when
    const putSession = apiPut(
            `/v1/admin/quiz/${postQuiz.getParsedBody().quizId}/session/${postSession2.getParsedBody().sessionId}`,
            { action: AdminActions.NEXT_QUESTION },
            { token: postRegister.getParsedBody().token }
    );

    // then
    expect(putSession.response.statusCode).toStrictEqual(HttpStatusCode.BAD_REQUEST);
  });

  test('400 - Invalid action enum', () => {
    // given
    const postRegister = apiPost('/v1/admin/auth/register', person2, {});
    const postQuiz = apiPost(
      '/v1/admin/quiz',
      {
        token: postRegister.getParsedBody().token,
        name: 'my quiz',
        description: 'quiz description',
      },
      {}
    );
    apiPost(
            `/v2/admin/quiz/${postQuiz.getParsedBody().quizId}/question`,
            postQuestionBody,
            { token: postRegister.getParsedBody().token }
    );
    const postSession = apiPost(
            `/v1/admin/quiz/${postQuiz.getParsedBody().quizId}/session/start`,
            { autoStartNum: 3 },
            { token: postRegister.getParsedBody().token }
    );
    // when
    const putSession = apiPut(
            `/v1/admin/quiz/${postQuiz.getParsedBody().quizId}/session/${postSession.getParsedBody().sessionId}`,
            { action: 'foobar' },
            { token: postRegister.getParsedBody().token }
    );
    expect(putSession.response.statusCode).toStrictEqual(HttpStatusCode.BAD_REQUEST);
  });

  test('400 - Action enum invalid in the current state', () => {
    // given
    const postRegister = apiPost('/v1/admin/auth/register', person2, {});
    const postQuiz = apiPost(
      '/v1/admin/quiz',
      {
        token: postRegister.getParsedBody().token,
        name: 'my quiz',
        description: 'quiz description',
      },
      {}
    );
    apiPost(
            `/v2/admin/quiz/${postQuiz.getParsedBody().quizId}/question`,
            postQuestionBody,
            { token: postRegister.getParsedBody().token }
    );
    const postSession = apiPost(
            `/v1/admin/quiz/${postQuiz.getParsedBody().quizId}/session/start`,
            { autoStartNum: 3 },
            { token: postRegister.getParsedBody().token }
    );
    // when
    const putSession = apiPut(
            `/v1/admin/quiz/${postQuiz.getParsedBody().quizId}/session/${postSession.getParsedBody().sessionId}`,
            { action: AdminActions.GO_TO_ANSWER },
            { token: postRegister.getParsedBody().token }
    );
    expect(putSession.response.statusCode).toStrictEqual(HttpStatusCode.BAD_REQUEST);
  });
});
