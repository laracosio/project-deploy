import {
  apiPost,
  apiPut,
  apiGet,
  ParsedResponse
} from '../../serverTestHelperIt3';
import { person2, person3, postQuestionBody } from '../../../testingData';
import { clearRequest } from '../../it2/serverTestHelperIt2';
import { AdminActions } from '../../../enums/AdminActions';
import { HttpStatusCode } from '../../../enums/HttpStatusCode';

beforeEach(() => {
  clearRequest();
});

// quizFinalResults tests
describe('GET /v1/admin/quiz/{quizid}/session/{sessionid}/* - Success', () => {
  let postQuiz: ParsedResponse;
  let postSession: ParsedResponse;
  let postRegister: ParsedResponse;

  beforeEach(async () => {
    postRegister = apiPost('/v1/admin/auth/register', person2, {});

    postQuiz = apiPost(
      '/v1/admin/quiz',
      {
        token: postRegister.getParsedBody().token,
        name: 'my quiz',
        description: 'quiz description',
      }
    );

    apiPost(
        `/v2/admin/quiz/${postQuiz.getParsedBody().quizId}/question`,
        postQuestionBody,
        { token: postRegister.getParsedBody().token }
    );

    // start session
    postSession = apiPost(
            `/v1/admin/quiz/${postQuiz.getParsedBody().quizId}/session/start`,
            { autoStartNum: 3 }, // change this from 3 to 4
            { token: postRegister.getParsedBody().token }
    );

    // three players join
    const postPlayer1 = apiPost(
      '/v1/player/join',
      { sessionId: postSession.getParsedBody().sessionId, name: 'Harry' }
    );
    const postPlayer2 = apiPost(
      '/v1/player/join',
      { sessionId: postSession.getParsedBody().sessionId, name: 'Hermione' }
    );
    const postPlayer3 = apiPost(
      '/v1/player/join',
      { sessionId: postSession.getParsedBody().sessionId, name: 'Ron' }
    );
  
    // LOBBY -> QUESTION_COUNTDOWN automatically since autoStartNum 3 = 3 players
    // should print current action: NEXT_QUESTION and current state: QUESTION_COUNTDOWN

    apiPut(
        `/v1/admin/quiz/${postQuiz.getParsedBody().quizId}/session/${postSession.getParsedBody().sessionId}`,
        { action: AdminActions.NEXT_QUESTION },
        { token: postRegister.getParsedBody().token }
    );

    await new Promise((r) => setTimeout(r, 4000));

    const getQuizInfo = apiGet(
      `/v2/admin/quiz/${postQuiz.getParsedBody().quizId}`,
      { token: postRegister.getParsedBody().token }
    );

    // TODO: uncomment once quiz answers is done

    // const quizAnswers = getQuizInfo.getParsedBody().questions[0].answers;

    // apiPut(
    //   `/v1/players/${postPlayer1.getParsedBody().playerId}/question/${1}/answer`,
    //   { answerIds: [quizAnswers[0]] }
    // );
    // apiPut(
    //   `/v1/players/${postPlayer2.getParsedBody().playerId}/question/${1}/answer`,
    //   { answerIds: [quizAnswers[0]] }
    // );
    // apiPut(
    //   `/v1/players/${postPlayer3.getParsedBody().playerId}/question/${1}/answer`,
    //   { answerIds: [quizAnswers[0]] }
    // );

    apiPut(
        `/v1/admin/quiz/${postQuiz.getParsedBody().quizId}/session/${postSession.getParsedBody().sessionId}`,
        { action: AdminActions.GO_TO_ANSWER },
        { token: postRegister.getParsedBody().token }
    );
    apiPut(
        `/v1/admin/quiz/${postQuiz.getParsedBody().quizId}/session/${postSession.getParsedBody().sessionId}`,
        { action: AdminActions.GO_TO_FINAL_RESULTS },
        { token: postRegister.getParsedBody().token }
    );
  });

  test.only('/results/csv - Success', async () => {
    const getResultsCsv = apiGet(
      `/v1/admin/quiz/${postQuiz.getParsedBody().quizId}/session/${postSession.getParsedBody().sessionId}/results/csv`,
      { token: postRegister.getParsedBody().token }
    );

    expect(getResultsCsv.getParsedBody().url).toMatch(/.csv$/);
  });

  test('/results - Success', async () => {
    const getResults = apiGet(
      `/v1/admin/quiz/${postQuiz.getParsedBody().quizId}/session/${postSession.getParsedBody().sessionId}/results`,
      { token: postRegister.getParsedBody().token }
    );

    const { usersRankedByScore, questionResults } = getResults.getParsedBody();

    expect(usersRankedByScore[0].name).toStrictEqual('Hermione');
    expect(usersRankedByScore[0].score).toStrictEqual(10);
    expect(usersRankedByScore[1].name).toStrictEqual('Harry');
    expect(usersRankedByScore[1].score).toStrictEqual(5);
    expect(usersRankedByScore[2].name).toStrictEqual('Ron');
    expect(usersRankedByScore[2].score).toStrictEqual(3.3);

    expect(questionResults.questionId).toStrictEqual(1);
    expect(questionResults.playersCorrectList).toContain('Harry');
    expect(questionResults.playersCorrectList).toContain('Hermione');
    expect(questionResults.playersCorrectList).toContain('Ron');
    expect(questionResults.averageAnswerTime).toEqual(expect.any(Number));
    expect(questionResults.percentCorrect).toStrictEqual(100);
  });
});

describe('GET /v1/admin/quiz/{quizid}/session/{sessionid}/* - Errors', () => {
  let postQuiz: ParsedResponse, postRegister: ParsedResponse, postQuiz2: ParsedResponse;
  let postSession2: ParsedResponse, postRegisterUser2: ParsedResponse, postQuizUser2: ParsedResponse;

  beforeEach(() => {
    // user1 token
    postRegister = apiPost('/v1/admin/auth/register', person2, {});
    // user1 quiz
    postQuiz = apiPost(
      '/v1/admin/quiz',
      {
        token: postRegister.getParsedBody().token,
        name: 'my quiz',
        description: 'quiz description',
      },
      {}
    );
    // user1 quiz's question
    apiPost(
            `/v2/admin/quiz/${postQuiz.getParsedBody().quizId}/question`,
            postQuestionBody,
            { token: postRegister.getParsedBody().token }
    );
    // user1 quiz session
    apiPost(
            `/v1/admin/quiz/${postQuiz.getParsedBody().quizId}/session/start`,
            { autoStartNum: 3 },
            { token: postRegister.getParsedBody().token }
    );
    // user1 quiz2
    postQuiz2 = apiPost(
      '/v1/admin/quiz',
      {
        token: postRegister.getParsedBody().token,
        name: 'my quiz2',
        description: 'quiz description2',
      },
      {}
    );
    // user1 quiz2 question
    apiPost(
            `/v2/admin/quiz/${postQuiz2.getParsedBody().quizId}/question`,
            postQuestionBody,
            { token: postRegister.getParsedBody().token }
    );
    // user1 quiz2 session
    postSession2 = apiPost(
            `/v1/admin/quiz/${postQuiz2.getParsedBody().quizId}/session/start`,
            { autoStartNum: 3 },
            { token: postRegister.getParsedBody().token }
    );
    // user2 token
    postRegisterUser2 = apiPost('/v1/admin/auth/register', person3, {});
    postQuizUser2 = apiPost(
      '/v1/admin/quiz',
      {
        token: postRegister.getParsedBody().token,
        name: 'my quiz',
        description: 'quiz description',
      },
      {}
    );
    // user1 quiz's question
    apiPost(
            `/v2/admin/quiz/${postQuizUser2.getParsedBody().quizId}/question`,
            postQuestionBody,
            { token: postRegisterUser2.getParsedBody().token }
    );
    // user1 quiz session
    apiPost(
            `/v1/admin/quiz/${postQuizUser2.getParsedBody().quizId}/session/start`,
            { autoStartNum: 3 },
            { token: postRegisterUser2.getParsedBody().token }
    );
  });
  test('/results - Error - 400 - Session Id does not refer to a valid session within this quiz', () => {
    const getResults = apiGet(
      `/v1/admin/quiz/${postQuiz.getParsedBody().quizId}/session/${postSession2.getParsedBody().sessionId}/results`,
      { token: postRegister.getParsedBody().token }
    );
    expect(getResults.response.statusCode).toStrictEqual(HttpStatusCode.BAD_REQUEST);
  });
  test('/csv - Error - 400 - Session Id does not refer to a valid session within this quiz', () => {
    const getResultsCsv = apiGet(
      `/v1/admin/quiz/${postQuiz.getParsedBody().quizId}/session/${postSession2.getParsedBody().sessionId}/results/csv`,
      { token: postRegister.getParsedBody().token }
    );

    expect(getResultsCsv.response.statusCode).toStrictEqual(HttpStatusCode.BAD_REQUEST);
  });
});

describe('GET /v1/admin/quiz/{quizid}/session/{sessionid}/* - Errors', () => {
  let postQuiz: ParsedResponse, postSession: ParsedResponse, postRegister: ParsedResponse;
  let postRegisterInvalid: ParsedResponse;

  beforeEach(async () => {
    postRegister = apiPost('/v1/admin/auth/register', person2, {});

    postQuiz = apiPost(
      '/v1/admin/quiz',
      {
        token: postRegister.getParsedBody().token,
        name: 'my quiz',
        description: 'quiz description',
      }
    );

    apiPost(
        `/v2/admin/quiz/${postQuiz.getParsedBody().quizId}/question`,
        postQuestionBody,
        { token: postRegister.getParsedBody().token }
    );

    postSession = apiPost(
            `/v1/admin/quiz/${postQuiz.getParsedBody().quizId}/session/start`,
            { autoStartNum: 2 },
            { token: postRegister.getParsedBody().token }
    );
    postRegisterInvalid = apiPost('/v1/admin/auth/register', person3, {});
  });
  test('/results - Error - 400 - Session is not in FINAL_RESULTS state', () => {
    const getResults = apiGet(
      `/v1/admin/quiz/${postQuiz.getParsedBody().quizId}/session/${postSession.getParsedBody().sessionId}/results`,
      { token: postRegister.getParsedBody().token }
    );
    expect(getResults.response.statusCode).toStrictEqual(HttpStatusCode.BAD_REQUEST);
  });
  test('/csv - Error - 400 - Session is not in FINAL_RESULTS state', () => {
    const getResultsCsv = apiGet(
      `/v1/admin/quiz/${postQuiz.getParsedBody().quizId}/session/${postSession.getParsedBody().sessionId}/results/csv`,
      { token: postRegister.getParsedBody().token }
    );
    expect(getResultsCsv.response.statusCode).toStrictEqual(HttpStatusCode.BAD_REQUEST);
  });
  test('/results - Error - 401 - Token is empty or invalid (does not refer to valid logged in user session', () => {
    const getResults = apiGet(
      `/v1/admin/quiz/${postQuiz.getParsedBody().quizId}/session/${postSession.getParsedBody().sessionId}/results`,
      { token: postRegister.getParsedBody().token }
    );
    expect(getResults.response.statusCode).toStrictEqual(HttpStatusCode.UNAUTHORISED);
  });
  test('/csv - Error - 401 - Token is empty or invalid (does not refer to valid logged in user session', () => {
    // pass invalid token in
    const getResultsCsv = apiGet(
      `/v1/admin/quiz/${postQuiz.getParsedBody().quizId}/session/${postSession.getParsedBody().sessionId}/results/csv`,
      { token: 1234 }
    );
    expect(getResultsCsv.response.statusCode).toStrictEqual(HttpStatusCode.UNAUTHORISED);
  });
  test('/results - Error - 403 - Valid token is provided, but user is not authorised to view this session', () => {
    // pass user2's token in with user1's session
    const getResults = apiGet(
      `/v1/admin/quiz/${postQuiz.getParsedBody().quizId}/session/${postSession.getParsedBody().sessionId}/results`,
      { token: postRegisterInvalid.getParsedBody().token }
    );
    expect(getResults.response.statusCode).toStrictEqual(HttpStatusCode.FORBIDDEN);
  });
  test('/csv - Error - 403 - Valid token is provided, but user is not authorised to view this session', () => {
    const getResultsCsv = apiGet(
      `/v1/admin/quiz/${postQuiz.getParsedBody().quizId}/session/${postSession.getParsedBody().sessionId}/results/csv`,
      { token: postRegisterInvalid.getParsedBody().token }
    );
    expect(getResultsCsv.response.statusCode).toStrictEqual(HttpStatusCode.FORBIDDEN);
  });
});
