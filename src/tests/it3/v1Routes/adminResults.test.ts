import {
  apiPost,
  apiPut,
  apiGet,
  ParsedResponse
} from '../../serverTestHelperIt3';
import { person2, postQuestionBody } from '../../../testingData';
import { clearRequest } from '../../it2/serverTestHelperIt2';
import { AdminActions } from '../../../enums/AdminActions';

beforeEach(() => {
  clearRequest();
});

// quizFinalResults tests
describe('GET /v1/admin/quiz/{quizid}/session/{sessionid}/*', () => {
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

    postSession = apiPost(
            `/v1/admin/quiz/${postQuiz.getParsedBody().quizId}/session/start`,
            { autoStartNum: 4 },
            { token: postRegister.getParsedBody().token }
    );

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

  test('/results/csv - Success', async () => {
    const getResultsCsv = apiGet(
      `/v1/admin/quiz/${postQuiz.getParsedBody().quizId}/session/${postSession.getParsedBody().sessionId}/results/csv`,
      { token: postRegister.getParsedBody().token }
    );

    expect(getResultsCsv.getParsedBody().url).toMatch(/.csv$/);
  });

  test.only('/results - Success', async () => {
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
