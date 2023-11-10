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
      { token: postRegister.parsedBody.token, name: 'my quiz', description: 'quiz description' },
      {}
    );
    // start session
    const postSession = apiPost(
      `/v1/admin/quiz/${postQuiz.parsedBody.quizId}/session/start`,
      { autoStartNum: 3 },
      { token: postRegister.parsedBody.token }
    );
    const getSession = apiGet(
      `v1/admin/quiz${postQuiz.parsedBody.quizId}/session/${postSession.parsedBody.sessionId}`,
      { token: postRegister.parsedBody.token }
    );
    const session: SessionStatus = getSession.parsedBody;
    expect(session.state).toStrictEqual('LOBBY');
    expect(session.atQuestion).toStrictEqual(3);
    expect(session.players).toContain('Hayden');
    expect(session.metadata.quizId).toStrictEqual(postQuiz.parsedBody.quizId);
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
      { token: postRegister.parsedBody.token, name: 'my quiz', description: 'quiz description' },
      {}
    );
    // start session
    const postSession = apiPost(
      `/v1/admin/quiz/${postQuiz.parsedBody.quizId}/session/start`,
      { autoStartNum: 3 },
      { token: postRegister.parsedBody.token }
    );
    const getSession = apiGet(
      `v1/admin/quiz${postQuiz.parsedBody.quizId + 1}/session/${postSession.parsedBody.session + 1}`,
      { token: postRegister.parsedBody.token }
    );

    expect(getSession.statusCode).toStrictEqual(400);
  });

  test('Error - Token is empty or invalid (does not refer to valid logged in user session)', () => {
    // make user
    const postRegister = apiPost('/v1/admin/auth/register', person2, {});
    // make quiz
    const postQuiz = apiPost(
      '/v1/admin/quiz',
      { token: postRegister.parsedBody.token, name: 'my quiz', description: 'quiz description' },
      {}
    );
    // start session
    const postSession = apiPost(
      `/v1/admin/quiz/${postQuiz.parsedBody.quizId}/session/start`,
      { autoStartNum: 3 },
      { token: postRegister.parsedBody.token }
    );
    const getSession = apiGet(`v1/admin/quiz${postQuiz.parsedBody.quizId}/session/${postSession.parsedBody.session}`, {
      token: -1
    });

    expect(getSession.statusCode).toStrictEqual(401);
  });

  test('Error - Valid token is provided, but user is not authorised to view this session', () => {
    // make user
    const postRegister = apiPost('/v1/admin/auth/register', person2, {});
    const postRegisterInvalid = apiPost('/v1/admin/auth/register', person3, {});
    // make quiz
    const postQuiz = apiPost(
      '/v1/admin/quiz',
      { token: postRegister.parsedBody.token, name: 'my quiz', description: 'quiz description' },
      {}
    );
    // start session
    const postSession = apiPost(
      `/v1/admin/quiz/${postQuiz.parsedBody.quizId}/session/start`,
      { autoStartNum: 3 },
      { token: postRegister.parsedBody.token }
    );
    const getSession = apiGet(`v1/admin/quiz${postQuiz.parsedBody.quizId}/session/${postSession.parsedBody.session}`, {
      token: postRegisterInvalid.parsedBody.token
    });
    expect(getSession.statusCode).toStrictEqual(403);
  });
});
