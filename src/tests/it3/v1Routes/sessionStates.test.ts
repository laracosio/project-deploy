import { SessionStatus } from '../../../dataStore';
import { person2, person3 } from '../../../testingData';
import { clearRequest } from '../../it2/serverTestHelperIt2';
import { apiGet, apiPost, apiPut } from '../../serverTestHelperIt3';

// getSessionStatus tests
describe('GET /v1/admin/quiz/{quizId}/session/{sessionId}', () => {
  beforeEach(() => {
    clearRequest();
  });

  test('success', () => {
    // make user
    const postRegister = apiPost('/v1/admin/auth/register', person2, {});
    // make quiz
    const postQuiz = apiPost(
      '/v1/admin/quiz',
      {
        token: postRegister.getParsedBody().token,
        name: 'my quiz',
        description: 'quiz description'
      },
      {}
    );
    // start session
    const postSession = apiPost(
      `/v1/admin/quiz/${postQuiz.getParsedBody().quizId}/session/start`,
      { autoStartNum: 3 },
      { token: postRegister.getParsedBody().token }
    );
    const getSession = apiGet(
      `/v1/admin/quiz/${postQuiz.getParsedBody().quizId}/session/${
        postSession.getParsedBody().sessionId
      }`,
      { token: postRegister.getParsedBody().token }
    );
    const session: SessionStatus = getSession.getParsedBody();
    expect(session.state).toStrictEqual('LOBBY');
    expect(session.atQuestion).toStrictEqual(3);
    expect(session.players).toContain('Hayden');
    expect(session.metadata.quizId).toStrictEqual(
      postQuiz.getParsedBody().quizId
    );
    expect(session.metadata.name).toStrictEqual('This is the name of a quiz');
    expect(session.metadata.description).toStrictEqual('This is the desc');
    expect(session.metadata.numQuestions).toStrictEqual(1);
    expect(session.metadata.duration).toStrictEqual(44);
    expect(session.metadata.questions[0].questionId).toStrictEqual(1);
    expect(session.metadata.thumbnailUrl).toStrictEqual('google.com');
  });

  test('Error - Session Id does not refer to a valid session within this quiz', () => {
    // make user
    const postRegister = apiPost('/v1/admin/auth/register', person2, {});
    // make quiz
    const postQuiz = apiPost(
      '/v1/admin/quiz',
      {
        token: postRegister.getParsedBody().token,
        name: 'my quiz',
        description: 'quiz description'
      },
      {}
    );
    // start session
    const postSession = apiPost(
      `/v1/admin/quiz/${postQuiz.getParsedBody().quizId}/session/start`,
      { autoStartNum: 3 },
      { token: postRegister.getParsedBody().token }
    );
    const getSession = apiGet(
      `/v1/admin/quiz/${postQuiz.getParsedBody().quizId + 1}/session/${
        postSession.getParsedBody().sessionId + 1
      }`,
      { token: postRegister.getParsedBody().token }
    );

    expect(getSession.response.statusCode).toStrictEqual(400);
  });

  test('Error - Token is empty or invalid (does not refer to valid logged in user session)', () => {
    // make user
    const postRegister = apiPost('/v1/admin/auth/register', person2, {});
    // make quiz
    const postQuiz = apiPost(
      '/v1/admin/quiz',
      {
        token: postRegister.getParsedBody().token,
        name: 'my quiz',
        description: 'quiz description'
      },
      {}
    );
    // start session
    const postSession = apiPost(
      `/v1/admin/quiz/${postQuiz.getParsedBody().quizId}/session/start`,
      { autoStartNum: 3 },
      { token: postRegister.getParsedBody().token }
    );
    const getSession = apiGet(
      `/v1/admin/quiz/${postQuiz.getParsedBody().quizId}/session/${
        postSession.getParsedBody().sessionId
      }`,
      {
        token: -1
      }
    );

    expect(getSession.response.statusCode).toStrictEqual(401);
  });

  test('Error - Valid token is provided, but user is not authorised to view this session', () => {
    // make user
    const postRegister = apiPost('/v1/admin/auth/register', person2, {});
    const postRegisterInvalid = apiPost('/v1/admin/auth/register', person3, {});
    // make quiz
    const postQuiz = apiPost(
      '/v1/admin/quiz',
      {
        token: postRegister.getParsedBody().token,
        name: 'my quiz',
        description: 'quiz description'
      },
      {}
    );
    // start session
    const postSession = apiPost(
      `/v1/admin/quiz/${postQuiz.getParsedBody().quizId}/session/start`,
      { autoStartNum: 3 },
      { token: postRegister.getParsedBody().token }
    );
    const getSession = apiGet(
      `/v1/admin/quiz/${postQuiz.getParsedBody().quizId}/session/${
        postSession.getParsedBody().sessionId
      }`,
      {
        token: postRegisterInvalid.getParsedBody().token
      }
    );
    expect(getSession.response.statusCode).toStrictEqual(403);
  });
});
