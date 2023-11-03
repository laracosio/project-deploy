import { authLoginRequest, clearRequest, authRegisterRequest, quizCreateRequest, createQuizQuestionRequest, moveQuestionRequest, quizInfoRequest, updateQuizQuestionRequest, duplicateQuestionRequest, deleteQuizQuestionRequest, authLogoutRequest } from './serverTestHelperIt2';
import {
  person1, person2, validQuestionInput1, validQuestionInput2, validQuestionInput3, validQuizDescription, validQuizName, validCreateQuestion, invalidQCShortQuestion, invalidQCLongQuestion, invalidQCOneAnswers, invalidQCManyAnswers, invalidQCDurationNegative,
  invalidQCDurationExceeds, invalidQCNoPoints, invalidQCPointsExceeds, invalidQCEmptyAnswer, invalidQCLongAnswer, invalidQCDuplicateAnswers, invalidQCNoAnswers, validUpdateQuestion, invalidUpdateQuestionShortQuestion, invalidUpdateQuestionLongQuestion,
  invalidUpdateQuestionManyAnswers, invalidUpdateQuestionOneAnswer, invalidUpdateQuestionNegativeDuration, invalidUpdateQuestionMoreThan180, invalidUpdateQuestionZeroPoints, invalidUpdateQuestionMoreThan10Points, invalidUpdateQuestionBlankAnswer,
  invalidUpdateQuestionLongAnswer, invalidUpdateQuestionDuplicateAnswer, invalidUpdateQuestionNoCorrectAnswer, validCreateQuestion2
} from '../../testingData';
import { Response } from 'sync-request-curl';
import { getUnixTime } from 'date-fns';

beforeEach(() => {
  clearRequest();
});
// create Question
describe('Successful tests: Create a quiz question', () => {
  test('Create a Quiz Question test', () => {
    authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const personLogin = authLoginRequest(person1.email, person1.password);
    const personLoginParsed = JSON.parse(personLogin.body.toString());
    const quizId = quizCreateRequest(personLoginParsed.token, validQuizName, validQuizDescription);
    const quizIdParsed = JSON.parse(quizId.body.toString());

    const res = createQuizQuestionRequest(quizIdParsed.quizId, personLoginParsed.token, validCreateQuestion);
    const data = JSON.parse(res.body.toString());
    expect(data).toStrictEqual({ questionId: expect.any(Number) });
  });
});

describe('Unsuccessful tests (400): Create a quiz question', () => {
  test('Unsuccessful (400): Question string is less than 5 characters in length', () => {
    authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const personLogin = authLoginRequest(person1.email, person1.password);
    const personLoginParsed = JSON.parse(personLogin.body.toString());
    const quizId = quizCreateRequest(personLoginParsed.token, validQuizName, validQuizDescription);
    const quizIdParsed = JSON.parse(quizId.body.toString());

    const res = createQuizQuestionRequest(quizIdParsed.quizId, personLoginParsed.token, invalidQCShortQuestion);

    const data = JSON.parse(res.body.toString());

    expect(data).toStrictEqual({ error: expect.any(String) });
  });
  test('Unsuccessful (400): Question string is greater than 50 characters in length', () => {
    authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const personLogin = authLoginRequest(person1.email, person1.password);
    const personLoginParsed = JSON.parse(personLogin.body.toString());
    const quizId = quizCreateRequest(personLoginParsed.token, validQuizName, validQuizDescription);
    const quizIdParsed = JSON.parse(quizId.body.toString());
    const res = createQuizQuestionRequest(quizIdParsed.quizId, personLoginParsed.token, invalidQCLongQuestion);

    const data = JSON.parse(res.body.toString());
    expect(data).toStrictEqual({ error: expect.any(String) });
  });
  test('Unsuccessful (400): The question has more than 6 answers', () => {
    authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const personLogin = authLoginRequest(person1.email, person1.password);
    const personLoginParsed = JSON.parse(personLogin.body.toString());
    const quizId = quizCreateRequest(personLoginParsed.token, validQuizName, validQuizDescription);
    const quizIdParsed = JSON.parse(quizId.body.toString());
    const res = createQuizQuestionRequest(quizIdParsed.quizId, personLoginParsed.token, invalidQCManyAnswers);

    const data = JSON.parse(res.body.toString());

    expect(data).toStrictEqual({ error: expect.any(String) });
  });
  test('Unsuccessful (400): The question has less than 2 answers', () => {
    authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const personLogin = authLoginRequest(person1.email, person1.password);
    const personLoginParsed = JSON.parse(personLogin.body.toString());
    const quizId = quizCreateRequest(personLoginParsed.token, validQuizName, validQuizDescription);
    const quizIdParsed = JSON.parse(quizId.body.toString());
    const res = createQuizQuestionRequest(quizIdParsed.quizId, personLoginParsed.token, invalidQCOneAnswers);

    const data = JSON.parse(res.body.toString());

    expect(data).toStrictEqual({ error: expect.any(String) });
  });
  test('Unsuccessful (400): The question duration is not a positive number', () => {
    authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const personLogin = authLoginRequest(person1.email, person1.password);
    const personLoginParsed = JSON.parse(personLogin.body.toString());
    const quizId = quizCreateRequest(personLoginParsed.token, validQuizName, validQuizDescription);
    const quizIdParsed = JSON.parse(quizId.body.toString());
    const res = createQuizQuestionRequest(quizIdParsed.quizId, personLoginParsed.token, invalidQCDurationNegative);

    const data = JSON.parse(res.body.toString());
    expect(data).toStrictEqual({ error: expect.any(String) });
  });
  test('Unsuccessful (400): The sum of the question durations in the quiz exceeds 3 minutes', () => {
    authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const personLogin = authLoginRequest(person1.email, person1.password);
    const personLoginParsed = JSON.parse(personLogin.body.toString());
    const quizId = quizCreateRequest(personLoginParsed.token, validQuizName, validQuizDescription);
    const quizIdParsed = JSON.parse(quizId.body.toString());
    const res = createQuizQuestionRequest(quizIdParsed.quizId, personLoginParsed.token, invalidQCDurationExceeds);

    const data = JSON.parse(res.body.toString());
    expect(data).toStrictEqual({ error: expect.any(String) });
  });
  test('Unsuccessful (400): The points awarded for the question are less than 1', () => {
    authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const personLogin = authLoginRequest(person1.email, person1.password);
    const personLoginParsed = JSON.parse(personLogin.body.toString());
    const quizId = quizCreateRequest(personLoginParsed.token, validQuizName, validQuizDescription);
    const quizIdParsed = JSON.parse(quizId.body.toString());
    const res = createQuizQuestionRequest(quizIdParsed.quizId, personLoginParsed.token, invalidQCNoPoints);

    const data = JSON.parse(res.body.toString());
    expect(data).toStrictEqual({ error: expect.any(String) });
  });
  test('Unsuccessful (400): The points awarded for the question are  greater than 10', () => {
    authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const personLogin = authLoginRequest(person1.email, person1.password);
    const personLoginParsed = JSON.parse(personLogin.body.toString());
    const quizId = quizCreateRequest(personLoginParsed.token, validQuizName, validQuizDescription);
    const quizIdParsed = JSON.parse(quizId.body.toString());
    const res = createQuizQuestionRequest(quizIdParsed.quizId, personLoginParsed.token, invalidQCPointsExceeds);

    const data = JSON.parse(res.body.toString());
    expect(data).toStrictEqual({ error: expect.any(String) });
  });
  test('Unsuccessful (400): The length of any answer is shorter than 1 character long', () => {
    authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const personLogin = authLoginRequest(person1.email, person1.password);
    const personLoginParsed = JSON.parse(personLogin.body.toString());
    const quizId = quizCreateRequest(personLoginParsed.token, validQuizName, validQuizDescription);
    const quizIdParsed = JSON.parse(quizId.body.toString());
    const res = createQuizQuestionRequest(quizIdParsed.quizId, personLoginParsed.token, invalidQCEmptyAnswer);

    const data = JSON.parse(res.body.toString());
    expect(data).toStrictEqual({ error: expect.any(String) });
  });
  test('Unsuccessful (400): The length of any answer is longer than 30 characters long', () => {
    authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const personLogin = authLoginRequest(person1.email, person1.password);
    const personLoginParsed = JSON.parse(personLogin.body.toString());
    const quizId = quizCreateRequest(personLoginParsed.token, validQuizName, validQuizDescription);
    const quizIdParsed = JSON.parse(quizId.body.toString());
    const res = createQuizQuestionRequest(quizIdParsed.quizId, personLoginParsed.token, invalidQCLongAnswer);

    const data = JSON.parse(res.body.toString());
    expect(data).toStrictEqual({ error: expect.any(String) });
  });
  test('Unsuccessful (400): Any answer strings are duplicates of one another', () => {
    authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const personLogin = authLoginRequest(person1.email, person1.password);
    const personLoginParsed = JSON.parse(personLogin.body.toString());
    const quizId = quizCreateRequest(personLoginParsed.token, validQuizName, validQuizDescription);
    const quizIdParsed = JSON.parse(quizId.body.toString());
    const res = createQuizQuestionRequest(quizIdParsed.quizId, personLoginParsed.token, invalidQCDuplicateAnswers);

    const data = JSON.parse(res.body.toString());
    expect(data).toStrictEqual({ error: expect.any(String) });
  });
  test('Unsuccessful (400):There are no correct answers', () => {
    authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const personLogin = authLoginRequest(person1.email, person1.password);
    const personLoginParsed = JSON.parse(personLogin.body.toString());
    const quizId = quizCreateRequest(personLoginParsed.token, validQuizName, validQuizDescription);
    const quizIdParsed = JSON.parse(quizId.body.toString());
    const res = createQuizQuestionRequest(quizIdParsed.quizId, personLoginParsed.token, invalidQCNoAnswers);

    const data = JSON.parse(res.body.toString());
    expect(data).toStrictEqual({ error: expect.any(String) });
  });
});

describe('Unsuccessful tests (401): Create a quiz question', () => {
  test('Unsuccesful (401): Token is empty', () => {
    authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const personLogin = authLoginRequest(person1.email, person1.password);
    const personLoginParsed = JSON.parse(personLogin.body.toString());
    const invalidToken = '';
    const quizId = quizCreateRequest(personLoginParsed.token, validQuizName, validQuizDescription);
    const quizIdParsed = JSON.parse(quizId.body.toString());
    const res = createQuizQuestionRequest(quizIdParsed.quizId, invalidToken, validCreateQuestion);

    const data = JSON.parse(res.body.toString());
    expect(data).toStrictEqual({ error: expect.any(String) });
  });
  test('Unsuccesful (401): Token does not refer to valid logged in user session', () => {
    authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const personLogin = authLoginRequest(person1.email, person1.password);
    const personLoginParsed = JSON.parse(personLogin.body.toString());
    const invalidToken = 'gj138914TAYLOR23852';
    const quizId = quizCreateRequest(personLoginParsed.token, validQuizName, validQuizDescription);
    const quizIdParsed = JSON.parse(quizId.body.toString());
    const res = createQuizQuestionRequest(quizIdParsed.quizId, invalidToken, validCreateQuestion);

    const data = JSON.parse(res.body.toString());
    expect(data).toStrictEqual({ error: expect.any(String) });
  });
});

describe('Unsuccessful tests (403): Create a quiz question', () => {
  test('Unsuccesful (403): Valid token is provided, but user is not an owner of this quiz', () => {
    authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    authRegisterRequest(person2.email, person2.password, person2.nameFirst, person2.nameLast);
    const person2Login = authLoginRequest(person2.email, person2.password);
    const person2LoginParsed = JSON.parse(person2Login.body.toString());
    const personLogin = authLoginRequest(person1.email, person1.password);
    const personLoginParsed = JSON.parse(personLogin.body.toString());
    const quizId = quizCreateRequest(personLoginParsed.token, validQuizName, validQuizDescription);
    const quizIdParsed = JSON.parse(quizId.body.toString());
    const res = createQuizQuestionRequest(quizIdParsed.quizId, person2LoginParsed.token, validCreateQuestion);

    const data = JSON.parse(res.body.toString());
    expect(data).toStrictEqual({ error: expect.any(String) });
  });
});

// updateQuestion
describe('Successful tests: Update a quiz question', () => {
  test('Update a quiz question test', () => {
    authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const personLogin = authLoginRequest(person1.email, person1.password);
    const personLoginParsed = JSON.parse(personLogin.body.toString());
    const quizId = quizCreateRequest(personLoginParsed.token, validQuizName, validQuizDescription);
    const quizIdParsed = JSON.parse(quizId.body.toString());
    const createQuestion = createQuizQuestionRequest(quizIdParsed.quizId, personLoginParsed.token, validCreateQuestion);
    const createQuestionParsed = JSON.parse(createQuestion.body.toString());

    const res = updateQuizQuestionRequest(quizIdParsed.quizId, createQuestionParsed.questionId, personLoginParsed.token, validUpdateQuestion);
    const data = JSON.parse(res.body.toString());
    expect(data).toStrictEqual({});
  });
});
describe('Unsuccessful tests (400): Update a quiz question', () => {
  test('Unsuccesful (400): Question Id does not refer to a valid question within this quiz', () => {
    authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const personLogin = authLoginRequest(person1.email, person1.password);
    const personLoginParsed = JSON.parse(personLogin.body.toString());
    const quizId = quizCreateRequest(personLoginParsed.token, validQuizName, validQuizDescription);
    const quizIdParsed = JSON.parse(quizId.body.toString());
    createQuizQuestionRequest(quizIdParsed.quizId, personLoginParsed.token, validCreateQuestion);
    const invalidCreateQuestion = 42;
    const res = updateQuizQuestionRequest(quizIdParsed.quizId, invalidCreateQuestion, personLoginParsed.token, validUpdateQuestion);
    const data = JSON.parse(res.body.toString());

    expect(data).toStrictEqual({ error: expect.any(String) });
  });
  test('Unsuccesful (400): Question string is less than 5 characters in length', () => {
    authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const personLogin = authLoginRequest(person1.email, person1.password);
    const personLoginParsed = JSON.parse(personLogin.body.toString());
    const quizId = quizCreateRequest(personLoginParsed.token, validQuizName, validQuizDescription);
    const quizIdParsed = JSON.parse(quizId.body.toString());
    const createQuestion = createQuizQuestionRequest(quizIdParsed.quizId, personLoginParsed.token, validCreateQuestion);
    const createQuestionParsed = JSON.parse(createQuestion.body.toString());
    const res = updateQuizQuestionRequest(quizIdParsed.quizId, createQuestionParsed.questionId, personLoginParsed.token, invalidUpdateQuestionShortQuestion);
    const data = JSON.parse(res.body.toString());

    expect(data).toStrictEqual({ error: expect.any(String) });
  });
  test('Unsuccesful (400): Question string is greater than 50 characters in length', () => {
    authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const personLogin = authLoginRequest(person1.email, person1.password);
    const personLoginParsed = JSON.parse(personLogin.body.toString());
    const quizId = quizCreateRequest(personLoginParsed.token, validQuizName, validQuizDescription);
    const quizIdParsed = JSON.parse(quizId.body.toString());
    const createQuestion = createQuizQuestionRequest(quizIdParsed.quizId, personLoginParsed.token, validCreateQuestion);
    const createQuestionParsed = JSON.parse(createQuestion.body.toString());
    const res = updateQuizQuestionRequest(quizIdParsed.quizId, createQuestionParsed.questionId, personLoginParsed.token, invalidUpdateQuestionLongQuestion);
    const data = JSON.parse(res.body.toString());

    expect(data).toStrictEqual({ error: expect.any(String) });
  });
  test('Unsuccesful (400): The question has more than 6 answers', () => {
    authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const personLogin = authLoginRequest(person1.email, person1.password);
    const personLoginParsed = JSON.parse(personLogin.body.toString());
    const quizId = quizCreateRequest(personLoginParsed.token, validQuizName, validQuizDescription);
    const quizIdParsed = JSON.parse(quizId.body.toString());
    const createQuestion = createQuizQuestionRequest(quizIdParsed.quizId, personLoginParsed.token, validCreateQuestion);
    const createQuestionParsed = JSON.parse(createQuestion.body.toString());
    const res = updateQuizQuestionRequest(quizIdParsed.quizId, createQuestionParsed.questionId, personLoginParsed.token, invalidUpdateQuestionManyAnswers);
    const data = JSON.parse(res.body.toString());

    expect(data).toStrictEqual({ error: expect.any(String) });
  });
  test('Unsuccesful (400): The question has less than 2 answers', () => {
    authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const personLogin = authLoginRequest(person1.email, person1.password);
    const personLoginParsed = JSON.parse(personLogin.body.toString());
    const quizId = quizCreateRequest(personLoginParsed.token, validQuizName, validQuizDescription);
    const quizIdParsed = JSON.parse(quizId.body.toString());
    const createQuestion = createQuizQuestionRequest(quizIdParsed.quizId, personLoginParsed.token, validCreateQuestion);
    const createQuestionParsed = JSON.parse(createQuestion.body.toString());
    const res = updateQuizQuestionRequest(quizIdParsed.quizId, createQuestionParsed.questionId, personLoginParsed.token, invalidUpdateQuestionOneAnswer);
    const data = JSON.parse(res.body.toString());

    expect(data).toStrictEqual({ error: expect.any(String) });
  });
  test('Unsuccesful (400): The question duration is not a positive number', () => {
    authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const personLogin = authLoginRequest(person1.email, person1.password);
    const personLoginParsed = JSON.parse(personLogin.body.toString());
    const quizId = quizCreateRequest(personLoginParsed.token, validQuizName, validQuizDescription);
    const quizIdParsed = JSON.parse(quizId.body.toString());
    const createQuestion = createQuizQuestionRequest(quizIdParsed.quizId, personLoginParsed.token, validCreateQuestion);
    const createQuestionParsed = JSON.parse(createQuestion.body.toString());
    const res = updateQuizQuestionRequest(quizIdParsed.quizId, createQuestionParsed.questionId, personLoginParsed.token, invalidUpdateQuestionNegativeDuration);
    const data = JSON.parse(res.body.toString());

    expect(data).toStrictEqual({ error: expect.any(String) });
  });
  test('Unsuccesful (400): If this question were to be updated, the sum of the question durations in the quiz exceeds 3 minutes', () => {
    authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const personLogin = authLoginRequest(person1.email, person1.password);
    const personLoginParsed = JSON.parse(personLogin.body.toString());
    const quizId = quizCreateRequest(personLoginParsed.token, validQuizName, validQuizDescription);
    const quizIdParsed = JSON.parse(quizId.body.toString());
    const createQuestion = createQuizQuestionRequest(quizIdParsed.quizId, personLoginParsed.token, validCreateQuestion);
    const createQuestionParsed = JSON.parse(createQuestion.body.toString());
    const res = updateQuizQuestionRequest(quizIdParsed.quizId, createQuestionParsed.questionId, personLoginParsed.token, invalidUpdateQuestionMoreThan180);
    const data = JSON.parse(res.body.toString());

    expect(data).toStrictEqual({ error: expect.any(String) });
  });
  test('Unsuccesful (400): The points awarded for the question are less than 1', () => {
    authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const personLogin = authLoginRequest(person1.email, person1.password);
    const personLoginParsed = JSON.parse(personLogin.body.toString());
    const quizId = quizCreateRequest(personLoginParsed.token, validQuizName, validQuizDescription);
    const quizIdParsed = JSON.parse(quizId.body.toString());
    const createQuestion = createQuizQuestionRequest(quizIdParsed.quizId, personLoginParsed.token, validCreateQuestion);
    const createQuestionParsed = JSON.parse(createQuestion.body.toString());
    const res = updateQuizQuestionRequest(quizIdParsed.quizId, createQuestionParsed.questionId, personLoginParsed.token, invalidUpdateQuestionZeroPoints);
    const data = JSON.parse(res.body.toString());

    expect(data).toStrictEqual({ error: expect.any(String) });
  });
  test('Unsuccesful (400): The points awarded for the question are more than 10', () => {
    authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const personLogin = authLoginRequest(person1.email, person1.password);
    const personLoginParsed = JSON.parse(personLogin.body.toString());
    const quizId = quizCreateRequest(personLoginParsed.token, validQuizName, validQuizDescription);
    const quizIdParsed = JSON.parse(quizId.body.toString());
    const createQuestion = createQuizQuestionRequest(quizIdParsed.quizId, personLoginParsed.token, validCreateQuestion);
    const createQuestionParsed = JSON.parse(createQuestion.body.toString());
    const res = updateQuizQuestionRequest(quizIdParsed.quizId, createQuestionParsed.questionId, personLoginParsed.token, invalidUpdateQuestionMoreThan10Points);
    const data = JSON.parse(res.body.toString());

    expect(data).toStrictEqual({ error: expect.any(String) });
  });
  test('Unsuccesful (400): The length of any answer is shorter than 1 character long', () => {
    authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const personLogin = authLoginRequest(person1.email, person1.password);
    const personLoginParsed = JSON.parse(personLogin.body.toString());
    const quizId = quizCreateRequest(personLoginParsed.token, validQuizName, validQuizDescription);
    const quizIdParsed = JSON.parse(quizId.body.toString());
    const createQuestion = createQuizQuestionRequest(quizIdParsed.quizId, personLoginParsed.token, validCreateQuestion);
    const createQuestionParsed = JSON.parse(createQuestion.body.toString());
    const res = updateQuizQuestionRequest(quizIdParsed.quizId, createQuestionParsed.questionId, personLoginParsed.token, invalidUpdateQuestionBlankAnswer);
    const data = JSON.parse(res.body.toString());

    expect(data).toStrictEqual({ error: expect.any(String) });
  });

  test('Unsuccesful (400): The length of any answer is longer than 30 character long', () => {
    authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const personLogin = authLoginRequest(person1.email, person1.password);
    const personLoginParsed = JSON.parse(personLogin.body.toString());
    const quizId = quizCreateRequest(personLoginParsed.token, validQuizName, validQuizDescription);
    const quizIdParsed = JSON.parse(quizId.body.toString());
    const createQuestion = createQuizQuestionRequest(quizIdParsed.quizId, personLoginParsed.token, validCreateQuestion);
    const createQuestionParsed = JSON.parse(createQuestion.body.toString());
    const res = updateQuizQuestionRequest(quizIdParsed.quizId, createQuestionParsed.questionId, personLoginParsed.token, invalidUpdateQuestionLongAnswer);
    const data = JSON.parse(res.body.toString());

    expect(data).toStrictEqual({ error: expect.any(String) });
  });
  test('Unsuccesful (400): Any answer strings are duplicates of one another (within the same question)', () => {
    authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const personLogin = authLoginRequest(person1.email, person1.password);
    const personLoginParsed = JSON.parse(personLogin.body.toString());
    const quizId = quizCreateRequest(personLoginParsed.token, validQuizName, validQuizDescription);
    const quizIdParsed = JSON.parse(quizId.body.toString());
    const createQuestion = createQuizQuestionRequest(quizIdParsed.quizId, personLoginParsed.token, validCreateQuestion);
    const createQuestionParsed = JSON.parse(createQuestion.body.toString());
    const res = updateQuizQuestionRequest(quizIdParsed.quizId, createQuestionParsed.questionId, personLoginParsed.token, invalidUpdateQuestionDuplicateAnswer);
    const data = JSON.parse(res.body.toString());

    expect(data).toStrictEqual({ error: expect.any(String) });
  });
  test('Unsuccesful (400): There are no correct answers', () => {
    authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const personLogin = authLoginRequest(person1.email, person1.password);
    const personLoginParsed = JSON.parse(personLogin.body.toString());
    const quizId = quizCreateRequest(personLoginParsed.token, validQuizName, validQuizDescription);
    const quizIdParsed = JSON.parse(quizId.body.toString());
    const createQuestion = createQuizQuestionRequest(quizIdParsed.quizId, personLoginParsed.token, validCreateQuestion);
    const createQuestionParsed = JSON.parse(createQuestion.body.toString());
    const res = updateQuizQuestionRequest(quizIdParsed.quizId, createQuestionParsed.questionId, personLoginParsed.token, invalidUpdateQuestionNoCorrectAnswer);
    const data = JSON.parse(res.body.toString());

    expect(data).toStrictEqual({ error: expect.any(String) });
  });
});
describe('Unsuccessful tests (401): Update a quiz question', () => {
  test('Unsuccesful (401): Token is empty', () => {
    authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const personLogin = authLoginRequest(person1.email, person1.password);
    const personLoginParsed = JSON.parse(personLogin.body.toString());
    const quizId = quizCreateRequest(personLoginParsed.token, validQuizName, validQuizDescription);
    const quizIdParsed = JSON.parse(quizId.body.toString());
    const createQuestion = createQuizQuestionRequest(quizIdParsed.quizId, personLoginParsed.token, validCreateQuestion);
    const createQuestionParsed = JSON.parse(createQuestion.body.toString());
    const invalidToken = '';

    const res = updateQuizQuestionRequest(quizIdParsed.quizId, createQuestionParsed.questionId, invalidToken, validUpdateQuestion);
    const data = JSON.parse(res.body.toString());
    expect(data).toStrictEqual({ error: expect.any(String) });
  });
  test('Unsuccesful (401): Token is empty', () => {
    authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const personLogin = authLoginRequest(person1.email, person1.password);
    const personLoginParsed = JSON.parse(personLogin.body.toString());
    const quizId = quizCreateRequest(personLoginParsed.token, validQuizName, validQuizDescription);
    const quizIdParsed = JSON.parse(quizId.body.toString());
    const createQuestion = createQuizQuestionRequest(quizIdParsed.quizId, personLoginParsed.token, validCreateQuestion);
    const createQuestionParsed = JSON.parse(createQuestion.body.toString());
    const invalidToken = 'gj138914TAYLOR23852';

    const res = updateQuizQuestionRequest(quizIdParsed.quizId, createQuestionParsed.questionId, invalidToken, validUpdateQuestion);
    const data = JSON.parse(res.body.toString());
    expect(data).toStrictEqual({ error: expect.any(String) });
  });
});
describe('Unsuccessful tests (403): Update a quiz question', () => {
  test('Unsuccesful (403): Valid token is provided, but user is unauthorised to complete this action', () => {
    authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const personLogin = authLoginRequest(person1.email, person1.password);
    const personLoginParsed = JSON.parse(personLogin.body.toString());
    const quizId = quizCreateRequest(personLoginParsed.token, validQuizName, validQuizDescription);
    const quizIdParsed = JSON.parse(quizId.body.toString());
    const createQuestion = createQuizQuestionRequest(quizIdParsed.quizId, personLoginParsed.token, validCreateQuestion);
    const createQuestionParsed = JSON.parse(createQuestion.body.toString());

    const person2Login = authLoginRequest(person2.email, person2.password);
    const person2LoginParsed = JSON.parse(person2Login.body.toString());
    const res = updateQuizQuestionRequest(quizIdParsed.quizId, createQuestionParsed.questionId, person2LoginParsed.token, validUpdateQuestion);
    const data = JSON.parse(res.body.toString());
    expect(data).toStrictEqual({ error: expect.any(String) });
  });
});

// move question
describe('PUT /v1/admin/quiz/{quizid}/question/{questionid}/move - Success', () => {
  let sess1: Response, quiz1: Response;
  beforeEach(() => {
    sess1 = authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const sess1Data = JSON.parse(sess1.body.toString());
    quiz1 = quizCreateRequest(sess1Data.token, validQuizName, validQuizDescription);
  });
  test('Move Question 2 to new Position and check lastEdited', () => {
    const sess1Data = JSON.parse(sess1.body.toString());
    const quiz1Data = JSON.parse(quiz1.body.toString());
    const quest1 = createQuizQuestionRequest(quiz1Data.quizId, sess1Data.token, validQuestionInput1);
    const quest1Data = JSON.parse(quest1.body.toString());
    const quest2 = createQuizQuestionRequest(quiz1Data.quizId, sess1Data.token, validQuestionInput2);
    const quest2Data = JSON.parse(quest2.body.toString());
    const res = moveQuestionRequest(sess1Data.token, quiz1Data.quizId, quest2Data.questionId, 0);
    const data = JSON.parse(res.body.toString());
    expect(data).toStrictEqual({});

    // const quizInfo = quizInfoRequest(sess1Data.token, quiz1Data.quizId);
    // const quizInfoData = JSON.parse(quizInfo.body.toString());
    // expect(quizInfoData.timeLastEdited).toBeGreaterThanOrEqual(getUnixTime(new Date()));
    // expect(quizInfoData.questions).toStrictEqual(
    //   [
    //     {
    //       questionId: quest2Data.questionId,
    //       question: validQuestionInput2.question,
    //       duration: validQuestionInput2.duration,
    //       points: validQuestionInput2.points,
    //       answers: expect.any(Array)
    //     },
    //     {
    //       questionId: quest1Data.questionId,
    //       question: validQuestionInput1.question,
    //       duration: validQuestionInput1.duration,
    //       points: validQuestionInput1.points,
    //       answers: expect.any(Array)
    //     }
    //   ]
    // );
  });
});

describe('PUT /v1/admin/quiz/{quizid}/question/{questionid}/move - Error', () => {
  let sess1: Response, quiz1: Response;
  beforeEach(() => {
    sess1 = authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const sess1Data = JSON.parse(sess1.body.toString());
    quiz1 = quizCreateRequest(sess1Data.token, validQuizName, validQuizDescription);
  });
  test('Quiz ID does not refer to a valid quiz', () => {
    const sess1Data = JSON.parse(sess1.body.toString());
    const quiz1Data = JSON.parse(quiz1.body.toString());
    createQuizQuestionRequest(quiz1Data.quizId, sess1Data.token, validQuestionInput1);
    const quest2 = createQuizQuestionRequest(quiz1Data.quizId, sess1Data.token, validQuestionInput2);
    const quest2Data = JSON.parse(quest2.body.toString());
    const res = moveQuestionRequest(sess1Data.token, quiz1Data.quizId + 1, quest2Data.questionId, 0);
    const data = JSON.parse(res.body.toString());
    expect(data).toStrictEqual({ error: expect.any(String) });
    expect(res.statusCode).toStrictEqual(400);
  });
  test('Question Id does not refer to a valid question within this quiz', () => {
    const sess1Data = JSON.parse(sess1.body.toString());
    const quiz1Data = JSON.parse(quiz1.body.toString());
    createQuizQuestionRequest(quiz1Data.quizId, sess1Data.token, validQuestionInput1);
    const quest2 = createQuizQuestionRequest(quiz1Data.quizId, sess1Data.token, validQuestionInput2);
    const quest2Data = JSON.parse(quest2.body.toString());
    const res = moveQuestionRequest(sess1Data.token, quiz1Data.quizId, quest2Data.questionId + 1, 0);
    const data = JSON.parse(res.body.toString());
    expect(data).toStrictEqual({ error: expect.any(String) });
    expect(res.statusCode).toStrictEqual(400);
  });
  test('NewPosition is less than 0', () => {
    const sess1Data = JSON.parse(sess1.body.toString());
    const quiz1Data = JSON.parse(quiz1.body.toString());
    createQuizQuestionRequest(quiz1Data.quizId, sess1Data.token, validQuestionInput1);
    const quest2 = createQuizQuestionRequest(quiz1Data.quizId, sess1Data.token, validQuestionInput2);
    const quest2Data = JSON.parse(quest2.body.toString());
    const res = moveQuestionRequest(sess1Data.token, quiz1Data.quizId, quest2Data.questionId, -1);
    const data = JSON.parse(res.body.toString());
    expect(data).toStrictEqual({ error: expect.any(String) });
    expect(res.statusCode).toStrictEqual(400);
  });
  test('NewPosition is greater than n-1 where n is the number of questions', () => {
    const sess1Data = JSON.parse(sess1.body.toString());
    const quiz1Data = JSON.parse(quiz1.body.toString());
    createQuizQuestionRequest(quiz1Data.quizId, sess1Data.token, validQuestionInput1);
    const quest2 = createQuizQuestionRequest(quiz1Data.quizId, sess1Data.token, validQuestionInput2);
    const quest2Data = JSON.parse(quest2.body.toString());
    const res = moveQuestionRequest(sess1Data.token, quiz1Data.quizId, quest2Data.questionId, 4);
    const data = JSON.parse(res.body.toString());
    expect(data).toStrictEqual({ error: expect.any(String) });
    expect(res.statusCode).toStrictEqual(400);
  });
  test('NewPosition is the position of the current question', () => {
    const sess1Data = JSON.parse(sess1.body.toString());
    const quiz1Data = JSON.parse(quiz1.body.toString());
    createQuizQuestionRequest(quiz1Data.quizId, sess1Data.token, validQuestionInput1);
    const quest2 = createQuizQuestionRequest(quiz1Data.quizId, sess1Data.token, validQuestionInput2);
    const quest2Data = JSON.parse(quest2.body.toString());
    const res = moveQuestionRequest(sess1Data.token, quiz1Data.quizId, quest2Data.questionId, 1);
    const data = JSON.parse(res.body.toString());
    expect(data).toStrictEqual({ error: expect.any(String) });
    expect(res.statusCode).toStrictEqual(400);
  });
  test('Token is empty', () => {
    const sess1Data = JSON.parse(sess1.body.toString());
    const quiz1Data = JSON.parse(quiz1.body.toString());
    createQuizQuestionRequest(quiz1Data.quizId, sess1Data.token, validQuestionInput1);
    const quest2 = createQuizQuestionRequest(quiz1Data.quizId, sess1Data.token, validQuestionInput2);
    const quest2Data = JSON.parse(quest2.body.toString());
    const res = moveQuestionRequest('', quiz1Data.quizId, quest2Data.questionId, 0);
    const data = JSON.parse(res.body.toString());
    expect(data).toStrictEqual({ error: expect.any(String) });
    expect(res.statusCode).toStrictEqual(401);
  });
  test('Token is invalid (does not refer to valid logged in user session)', () => {
    const sess1Data = JSON.parse(sess1.body.toString());
    const quiz1Data = JSON.parse(quiz1.body.toString());
    createQuizQuestionRequest(quiz1Data.quizId, sess1Data.token, validQuestionInput1);
    const quest2 = createQuizQuestionRequest(quiz1Data.quizId, sess1Data.token, validQuestionInput2);
    const quest2Data = JSON.parse(quest2.body.toString());
    authLogoutRequest(sess1Data.token);
    const res = moveQuestionRequest(sess1Data.token, quiz1Data.quizId, quest2Data.questionId, 0);
    const data = JSON.parse(res.body.toString());
    expect(data).toStrictEqual({ error: expect.any(String) });
    expect(res.statusCode).toStrictEqual(401);
  });
  test('Valid token is provided, but user is not an owner of this quiz', () => {
    const sess2 = authRegisterRequest(person2.email, person2.password, person2.nameFirst, person2.nameLast);
    const sess2Data = JSON.parse(sess2.body.toString());
    const sess1Data = JSON.parse(sess1.body.toString());
    const quiz1Data = JSON.parse(quiz1.body.toString());
    createQuizQuestionRequest(quiz1Data.quizId, sess1Data.token, validQuestionInput1);
    const quest2 = createQuizQuestionRequest(quiz1Data.quizId, sess1Data.token, validQuestionInput2);
    const quest2Data = JSON.parse(quest2.body.toString());
    const res = moveQuestionRequest(sess2Data.token, quiz1Data.quizId, quest2Data.questionId, 0);
    const data = JSON.parse(res.body.toString());
    expect(data).toStrictEqual({ error: expect.any(String) });
    expect(res.statusCode).toStrictEqual(403);
  });
});

// duplicate Question
describe('POST /v1/admin/quiz/{quizid}/question/{questionid}/duplicate - Success', () => {
  let sess1: Response, quiz1: Response, quest1: Response;
  beforeEach(() => {
    sess1 = authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const sess1Data = JSON.parse(sess1.body.toString());
    quiz1 = quizCreateRequest(sess1Data.token, validQuizName, validQuizDescription);
    const quiz1Data = JSON.parse(quiz1.body.toString());
    quest1 = createQuizQuestionRequest(quiz1Data.quizId, sess1Data.token, validQuestionInput1);
  });
  test('Duplicate question successfully', () => {
    const sess1Data = JSON.parse(sess1.body.toString());
    const quiz1Data = JSON.parse(quiz1.body.toString());
    const quest1Data = JSON.parse(quest1.body.toString());
    const res = duplicateQuestionRequest(sess1Data.token, quiz1Data.quizId, quest1Data.questionId);
    const data = JSON.parse(res.body.toString());
    expect(data).toStrictEqual({ newQuestionId: expect.any(Number) });
    // const quizInfo = quizInfoRequest(sess1Data.token, quiz1Data.quizId);
    // const infoData = JSON.parse(quizInfo.body.toString());
    // expect(infoData.questions[1]).toStrictEqual(
    //   {
    //     questionId: data.newQuestionId,
    //     question: validQuestionInput1.question,
    //     duration: validQuestionInput1.duration,
    //     points: validQuestionInput1.points,
    //     answers: [
    //       {
    //         answerId: expect.any(Number),
    //         answer: validQuestionInput1.answers[0].answer,
    //         correct: validQuestionInput1.answers[0].correct,
    //         colour: expect.any(String)
    //       },
    //       {
    //         answerId: expect.any(Number),
    //         answer: validQuestionInput1.answers[1].answer,
    //         correct: validQuestionInput1.answers[1].correct,
    //         colour: expect.any(String)
    //       },
    //       {
    //         answerId: expect.any(Number),
    //         answer: validQuestionInput1.answers[2].answer,
    //         correct: validQuestionInput1.answers[2].correct,
    //         colour: expect.any(String)
    //       },
    //       {
    //         answerId: expect.any(Number),
    //         answer: validQuestionInput1.answers[3].answer,
    //         correct: validQuestionInput1.answers[3].correct,
    //         colour: expect.any(String)
    //       }
    //     ]
    //   }
    // );
  });
  test('Remove 1 twice duplicated question', () => {
    const sess1Data = JSON.parse(sess1.body.toString());
    const quiz1Data = JSON.parse(quiz1.body.toString());
    const quest1Data = JSON.parse(quest1.body.toString());
    const firstDupQ = duplicateQuestionRequest(sess1Data.token, quiz1Data.quizId, quest1Data.questionId);
    const firstDupQData = JSON.parse(firstDupQ.body.toString());
    const res = duplicateQuestionRequest(sess1Data.token, quiz1Data.quizId, quest1Data.questionId);
    const data = JSON.parse(res.body.toString());
    expect(data).toStrictEqual({ newQuestionId: expect.any(Number) });

    // remove first duplicated question. second duplicate to remain
    deleteQuizQuestionRequest(sess1Data.token, quiz1Data.quizId, firstDupQData.newQuestionId);
    // const quizInfo = quizInfoRequest(sess1Data.token, quiz1Data.quizId);
    // expect(JSON.parse(quizInfo.body.toString()).questions).toStrictEqual(
    //   [
    //     {
    //       questionId: quest1Data.questionId,
    //       question: validQuestionInput1.question,
    //       duration: validQuestionInput1.duration,
    //       points: validQuestionInput1.points,
    //       answers: expect.any(Array)
    //     },
    //     {
    //       questionId: data.newQuestionId,
    //       question: validQuestionInput1.question,
    //       duration: validQuestionInput1.duration,
    //       points: validQuestionInput1.points,
    //       answers: expect.any(Array)
    //     }
    //   ]
    // );
  });
  test('duplicateQuestion appears immediately after', () => {
    const sess1Data = JSON.parse(sess1.body.toString());
    const quiz1Data = JSON.parse(quiz1.body.toString());
    const quest2 = createQuizQuestionRequest(quiz1Data.quizId, sess1Data.token, validQuestionInput2);
    const quest2Data = JSON.parse(quest2.body.toString());
    createQuizQuestionRequest(quiz1Data.quizId, sess1Data.token, validQuestionInput3);
    const res = duplicateQuestionRequest(sess1Data.token, quiz1Data.quizId, quest2Data.questionId);
    const data = JSON.parse(res.body.toString());
    expect(data).toStrictEqual({ newQuestionId: expect.any(Number) });

    const quizInfo = quizInfoRequest(sess1Data.token, quiz1Data.quizId);
    expect(JSON.parse(quizInfo.body.toString())).toStrictEqual(
      {
        quizId: quiz1Data.quizId,
        name: validQuizName,
        timeCreated: expect.any(Number),
        timeLastEdited: expect.any(Number),
        description: validQuizDescription,
        numQuestions: 4,
        questions: expect.any(Array),
        duration: ((validQuestionInput1.duration) + (validQuestionInput2.duration * 2) + (validQuestionInput3.duration))
      }
    );
    // expect(JSON.parse(quizInfo.body.toString()).questions[2]).toStrictEqual(
    //   {
    //     questionId: data.newQuestionId,
    //     question: validQuestionInput2.question,
    //     duration: validQuestionInput2.duration,
    //     points: validQuestionInput2.points,
    //     answers: [
    //       {
    //         answerId: expect.any(Number),
    //         answer: validQuestionInput2.answers[0].answer,
    //         correct: validQuestionInput2.answers[0].correct,
    //         colour: expect.any(String)
    //       },
    //       {
    //         answerId: expect.any(Number),
    //         answer: validQuestionInput2.answers[1].answer,
    //         correct: validQuestionInput2.answers[1].correct,
    //         colour: expect.any(String)
    //       },
    //       {
    //         answerId: expect.any(Number),
    //         answer: validQuestionInput2.answers[2].answer,
    //         correct: validQuestionInput2.answers[2].correct,
    //         colour: expect.any(String)
    //       },
    //       {
    //         answerId: expect.any(Number),
    //         answer: validQuestionInput2.answers[3].answer,
    //         correct: validQuestionInput2.answers[3].correct,
    //         colour: expect.any(String)
    //       }
    //     ]
    //   }
    // );
  });
});

describe('POST /v1/admin/quiz/{quizid}/question/{questionid}/duplicate - Error', () => {
  let sess1: Response, sess2: Response, quiz1: Response, quest1: Response;
  beforeEach(() => {
    sess1 = authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const sess1Data = JSON.parse(sess1.body.toString());
    quiz1 = quizCreateRequest(sess1Data.token, validQuizName, validQuizDescription);
    const quiz1Data = JSON.parse(quiz1.body.toString());
    sess2 = authRegisterRequest(person2.email, person2.password, person2.nameFirst, person2.nameLast);
    quest1 = createQuizQuestionRequest(quiz1Data.quizId, sess1Data.token, validQuestionInput1);
  });
  test('invalid quizId', () => {
    const sess1Data = JSON.parse(sess1.body.toString());
    const quiz1Data = JSON.parse(quiz1.body.toString());
    const quest1Data = JSON.parse(quest1.body.toString());
    const res = duplicateQuestionRequest(sess1Data.token, quiz1Data.quizId + 1, quest1Data.questionId);
    const data = JSON.parse(res.body.toString());
    expect(data).toStrictEqual({ error: expect.any(String) });
    expect(res.statusCode).toStrictEqual(400);
  });
  test('questionId is invalid for question', () => {
    const sess1Data = JSON.parse(sess1.body.toString());
    const quiz1Data = JSON.parse(quiz1.body.toString());
    const quest1Data = JSON.parse(quest1.body.toString());
    const res = duplicateQuestionRequest(sess1Data.token, quiz1Data.quizId, quest1Data.questionId + 1);
    const data = JSON.parse(res.body.toString());
    expect(data).toStrictEqual({ error: expect.any(String) });
    expect(res.statusCode).toStrictEqual(400);
  });
  test('token is empty', () => {
    const quiz1Data = JSON.parse(quiz1.body.toString());
    const quest1Data = JSON.parse(quest1.body.toString());
    const res = duplicateQuestionRequest('', quiz1Data.quizId, quest1Data.questionId);
    const data = JSON.parse(res.body.toString());
    expect(data).toStrictEqual({ error: expect.any(String) });
    expect(res.statusCode).toStrictEqual(401);
  });
  test('token belongs to a logged out session', () => {
    const sess1Data = JSON.parse(sess1.body.toString());
    const quiz1Data = JSON.parse(quiz1.body.toString());
    const quest1Data = JSON.parse(quest1.body.toString());
    authLogoutRequest(sess1Data.token);
    const res = duplicateQuestionRequest(sess1Data.token, quiz1Data.quizId, quest1Data.questionId);
    const data = JSON.parse(res.body.toString());
    expect(data).toStrictEqual({ error: expect.any(String) });
    expect(res.statusCode).toStrictEqual(401);
  });
  test('Valid token is provided but user is not an owner', () => {
    const sess2Data = JSON.parse(sess2.body.toString());
    const quiz1Data = JSON.parse(quiz1.body.toString());
    const quest1Data = JSON.parse(quest1.body.toString());
    const res = duplicateQuestionRequest(sess2Data.token, quiz1Data.quizId, quest1Data.questionId);
    const data = JSON.parse(res.body.toString());
    expect(data).toStrictEqual({ error: expect.any(String) });
    expect(res.statusCode).toStrictEqual(403);
  });
});

// delete question
describe('Successful tests: Delete a quiz question', () => {
  test('Delete a Quiz Question test', () => {
    authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const personLogin = authLoginRequest(person1.email, person1.password);
    const personLoginParsed = JSON.parse(personLogin.body.toString());
    const quizId = quizCreateRequest(personLoginParsed.token, validQuizName, validQuizDescription);
    const quizIdParsed = JSON.parse(quizId.body.toString());

    const toDelete = createQuizQuestionRequest(quizIdParsed.quizId, personLoginParsed.token, validCreateQuestion);
    const toDeleteParsed = JSON.parse(toDelete.body.toString());
    createQuizQuestionRequest(quizIdParsed.quizId, personLoginParsed.token, validCreateQuestion2);

    const res = deleteQuizQuestionRequest(personLoginParsed.token, quizIdParsed.quizId, toDeleteParsed.questionId);
    const data = JSON.parse(res.body.toString());
    expect(data).toStrictEqual({});
  });
});

describe('Successful tests: Delete a quiz question', () => {
  test('Delete a Quiz Question test', () => {
    authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const personLogin = authLoginRequest(person1.email, person1.password);
    const personLoginParsed = JSON.parse(personLogin.body.toString());
    const quizId = quizCreateRequest(personLoginParsed.token, validQuizName, validQuizDescription);
    const quizIdParsed = JSON.parse(quizId.body.toString());

    const toDelete = createQuizQuestionRequest(quizIdParsed.quizId, personLoginParsed.token, validCreateQuestion);
    const toDeleteParsed = JSON.parse(toDelete.body.toString());
    createQuizQuestionRequest(quizIdParsed.quizId, personLoginParsed.token, validCreateQuestion2);

    const res = deleteQuizQuestionRequest(personLoginParsed.token, quizIdParsed.quizId, toDeleteParsed.questionId);
    const data = JSON.parse(res.body.toString());
    expect(data).toStrictEqual({});
  });
});

describe('Unsuccessful tests (400): Delete a quiz question', () => {
  test('Unsucessful (400): Question Id does not refer to a valid question within this quiz', () => {
    authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const personLogin = authLoginRequest(person1.email, person1.password);
    const personLoginParsed = JSON.parse(personLogin.body.toString());
    const quizId = quizCreateRequest(personLoginParsed.token, validQuizName, validQuizDescription);
    const quizIdParsed = JSON.parse(quizId.body.toString());

    createQuizQuestionRequest(quizIdParsed.quizId, personLoginParsed.token, validCreateQuestion);

    createQuizQuestionRequest(quizIdParsed.quizId, personLoginParsed.token, validCreateQuestion2);

    const res = deleteQuizQuestionRequest(personLoginParsed.token, quizIdParsed.quizId, 23);

    const data = JSON.parse(res.body.toString());
    expect(data).toStrictEqual({ error: expect.any(String) });
  });
});

describe('Unsuccessful tests (401): Delete a quiz question', () => {
  test('Unsucessful (401): Token is empty', () => {
    authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const personLogin = authLoginRequest(person1.email, person1.password);
    const personLoginParsed = JSON.parse(personLogin.body.toString());
    const quizId = quizCreateRequest(personLoginParsed.token, validQuizName, validQuizDescription);
    const quizIdParsed = JSON.parse(quizId.body.toString());

    const toDelete = createQuizQuestionRequest(quizIdParsed.quizId, personLoginParsed.token, validCreateQuestion);
    const toDeleteParsed = JSON.parse(toDelete.body.toString());
    createQuizQuestionRequest(quizIdParsed.quizId, personLoginParsed.token, validCreateQuestion2);

    const invalidToken = '';
    const res = deleteQuizQuestionRequest(invalidToken, quizIdParsed.quizId, toDeleteParsed.questionId);

    const data = JSON.parse(res.body.toString());
    expect(data).toStrictEqual({ error: expect.any(String) });
  });
  test('Unsucessful (401): Token is invalid', () => {
    authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const personLogin = authLoginRequest(person1.email, person1.password);
    const personLoginParsed = JSON.parse(personLogin.body.toString());
    const quizId = quizCreateRequest(personLoginParsed.token, validQuizName, validQuizDescription);
    const quizIdParsed = JSON.parse(quizId.body.toString());

    const toDelete = createQuizQuestionRequest(quizIdParsed.quizId, personLoginParsed.token, validCreateQuestion);
    const toDeleteParsed = JSON.parse(toDelete.body.toString());
    createQuizQuestionRequest(quizIdParsed.quizId, personLoginParsed.token, validCreateQuestion2);

    const invalidToken = '492uTRAVIStaylor221';
    const res = deleteQuizQuestionRequest(invalidToken, quizIdParsed.quizId, toDeleteParsed.questionId);

    const data = JSON.parse(res.body.toString());
    expect(data).toStrictEqual({ error: expect.any(String) });
  });
});

describe('Unsuccessful tests (403): Delete a quiz question', () => {
  test('Unsucessful (403): Valid token is provided, but user is not an owner of this quiz', () => {
    authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const personLogin = authLoginRequest(person1.email, person1.password);
    const personLoginParsed = JSON.parse(personLogin.body.toString());
    authRegisterRequest(person2.email, person2.password, person2.nameFirst, person2.nameLast);
    const quizId = quizCreateRequest(personLoginParsed.token, validQuizName, validQuizDescription);
    const quizIdParsed = JSON.parse(quizId.body.toString());

    const toDelete = createQuizQuestionRequest(quizIdParsed.quizId, personLoginParsed.token, validCreateQuestion);
    const toDeleteParsed = JSON.parse(toDelete.body.toString());
    createQuizQuestionRequest(quizIdParsed.quizId, personLoginParsed.token, validCreateQuestion2);

    const personLogin2 = authLoginRequest(person2.email, person2.password);
    const personLoginParsed2 = JSON.parse(personLogin2.body.toString());
    const res = deleteQuizQuestionRequest(personLoginParsed2.token, quizIdParsed.quizId, toDeleteParsed.questionId);

    const data = JSON.parse(res.body.toString());
    expect(data).toStrictEqual({ error: expect.any(String) });
  });
});
