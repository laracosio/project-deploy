// import statements
<<<<<<< HEAD
import { getUnixTime } from 'date-fns';
import { getData, setData, CreateQuestionReturn, Question, Answer, QuestionCreate, Colours } from '../dataStore';
=======
import { Question, Answer, QuestionCreate, Colours } from '../dataStore';
import { tokenValidation, getTotalDurationOfQuiz, getRandomColorAndRemove } from './other';
import { getData, setData, QuestionReturn } from '../dataStore';
>>>>>>> 55d36cb (updateQuestion: Working code and passing all tests)
import { HttpStatusCode } from '../enums/HttpStatusCode';
import { ApiError } from '../errors/ApiError';
import { findQuestionByQuiz, findQuizById, findToken, tokenValidation, getTotalDurationOfQuiz, getRandomColorAndRemove } from './other';

<<<<<<< HEAD
function quizCreateQuestion(quizId: number, token: string, questionBody: QuestionCreate): CreateQuestionReturn {
=======
// code
function quizCreateQuestion(quizId: number, token: string, questionBody: QuestionCreate): QuestionReturn {
>>>>>>> 55d36cb (updateQuestion: Working code and passing all tests)
  const dataStore = getData();

  if (questionBody.question.length < 5 || questionBody.question.length > 50) {
    throw new ApiError('Question string is less than 5 characters in length or greater than 50 characters in length', HttpStatusCode.BAD_REQUEST);
  }
  if (questionBody.answers.length > 6 || questionBody.answers.length < 2) {
    throw new ApiError('The question has more than 6 answers or less than 2 answers', HttpStatusCode.BAD_REQUEST);
  }
  if (questionBody.duration < 1) {
    throw new ApiError('The question duration is not a positive number', HttpStatusCode.BAD_REQUEST);
  }
  if ((getTotalDurationOfQuiz(quizId) + questionBody.duration) > 180) {
    throw new ApiError('The sum of the question durations in the quiz exceeds 3 minutes', HttpStatusCode.BAD_REQUEST);
  }
  if (questionBody.points < 1 || questionBody.points > 10) {
    throw new ApiError('The points awarded for the question are less than 1 or greater than 10', HttpStatusCode.BAD_REQUEST);
  }
  if (questionBody.answers.find(answer => answer.answer.length < 1) || questionBody.answers.find(answer => answer.answer.length > 30)) {
    throw new ApiError('The length of any answer is shorter than 1 character long, or longer than 30 characters long', HttpStatusCode.BAD_REQUEST);
  }

  const answerMap = new Map <string, boolean>();

  questionBody.answers.map(answer => answerMap.set(answer.answer, answer.correct));
  if (answerMap.size !== questionBody.answers.length) {
    throw new ApiError('Answer strings are duplicates of one another', HttpStatusCode.BAD_REQUEST);
  }

  if (!(questionBody.answers.find(answer => answer.correct === true))) {
    throw new ApiError('There are no correct answers', HttpStatusCode.BAD_REQUEST);
  }
  if (!tokenValidation(token)) {
    throw new ApiError('Token is empty or invalid', HttpStatusCode.UNAUTHORISED);
  }

  if (!dataStore.quizzes.some((quiz) => quiz.quizId === quizId)) {
    throw new ApiError('Invalid quiz ID', HttpStatusCode.BAD_REQUEST);
  }

  const authUser = dataStore.tokens.find(user => user.sessionId === token);
  const quiz = dataStore.quizzes.find(quiz => quiz.quizId === quizId);
  if (quiz.quizOwner !== authUser.userId) {
    throw new ApiError('Valid token is provided, but user is not an owner of this quiz', HttpStatusCode.FORBIDDEN);
  }

  // edit timeLastEdited
  quiz.timeLastEdited = getUnixTime(new Date());

  // create questionId
  const questionId = quiz.numQuestions + 1;
  // assign colour and answerId to answer
  const availableColours = [...Colours];
  const arrayOfAnswers = [];

  for (const element of questionBody.answers) {
    const newAnswerId = (arrayOfAnswers.length + 1);
    const questionAnswerBody: Answer = {
      answerId: newAnswerId,
      answer: element.answer,
      correct: element.correct,
      colour: getRandomColorAndRemove(availableColours),
    };
    arrayOfAnswers.push(questionAnswerBody);
  }

  const newQuestion: Question = {
    questionId: questionId,
    question: questionBody.question,
    duration: questionBody.duration,
    points: questionBody.points,
    answers: arrayOfAnswers,
  };

  quiz.questions.push(newQuestion);
  quiz.quizDuration = getTotalDurationOfQuiz(quiz.quizId);
  quiz.numQuestions++;

  setData(dataStore);

  return {
    questionId: questionId,
  };
}

<<<<<<< HEAD
/**
 * Move a question from one particular position in the quiz to another
 * When this route is called, the timeLastEdited is updated
 * @param sessionId - sessionId contained within a token
 * @param quizId - quizId where question exists
 * @param questionId - question to move
 * @param newPosition - position to move question to
 * @returns - {} OR error
*/
function adminMoveQuestion(sessionId: string, quizId: number, questionId: number, newPosition: number): object {
  const dataStore = getData();

  // quiz invalid
  const matchedQuiz = findQuizById(quizId);
  if (matchedQuiz === undefined) {
    throw new ApiError('Quiz ID does not refer to a valid quiz', HttpStatusCode.BAD_REQUEST);
  }
  // question invalid
  const matchedQuestion = findQuestionByQuiz(matchedQuiz, questionId);
  if (matchedQuestion === undefined) {
    throw new ApiError('Question Id does not refer to a valid question within this quiz', HttpStatusCode.BAD_REQUEST);
  }
  // newPosition invalid
  if (newPosition < 0 || (newPosition > (matchedQuiz.questions.length - 1))) {
    throw new ApiError('NewPosition is less than 0, or NewPosition is greater than n-1 where n is the number of questions', HttpStatusCode.BAD_REQUEST);
  }
  // position is the position of current question
  const currentIndex = matchedQuiz.questions.findIndex(element => element.questionId === questionId);
  if (currentIndex === newPosition) {
    throw new ApiError('NewPosition is the position of the current question', HttpStatusCode.BAD_REQUEST);
  }
  // invalid token
  if (!tokenValidation(sessionId)) {
    throw new ApiError('Token is empty or invalid (does not refer to valid logged in user session)', HttpStatusCode.UNAUTHORISED);
  }
  // valid token but not quizOwner
  const matchedToken = findToken(sessionId);
  if (matchedToken.userId !== matchedQuiz.quizOwner) {
    throw new ApiError('Valid token is provided, but user is not an owner of this quiz', HttpStatusCode.FORBIDDEN);
  }

  const questionToMove = matchedQuiz.questions.splice(currentIndex, 1)[0];
  matchedQuiz.questions.splice(newPosition, 0, questionToMove);
  matchedQuiz.timeLastEdited = getUnixTime(new Date());
=======
function quizUpdateQuestion (quizId: number, questionId: number, token: string, questionBody: QuestionCreate): object {
  const dataStore = getData();

  const quiz = dataStore.quizzes.find(quiz => quiz.quizId === quizId);

  if (!quiz.questions.some((question) => question.questionId === questionId)) {
    throw new ApiError('Question Id does not refer to a valid question within this quiz', HttpStatusCode.BAD_REQUEST);
  }

  if (questionBody.question.length < 5 || questionBody.question.length > 50) {
    throw new ApiError('Question string is less than 5 characters in length or greater than 50 characters in length', HttpStatusCode.BAD_REQUEST);
  }
  if (questionBody.answers.length > 6 || questionBody.answers.length < 2) {
    throw new ApiError('The question has more than 6 answers or less than 2 answers', HttpStatusCode.BAD_REQUEST);
  }
  if (questionBody.duration < 1) {
    throw new ApiError('The question duration is not a positive number', HttpStatusCode.BAD_REQUEST);
  }
  if ((getTotalDurationOfQuiz(quizId) + questionBody.duration) > 180) {
    throw new ApiError('The sum of the question durations in the quiz exceeds 3 minutes', HttpStatusCode.BAD_REQUEST);
  }
  if (questionBody.points < 1 || questionBody.points > 10) {
    throw new ApiError('The points awarded for the question are less than 1 or greater than 10', HttpStatusCode.BAD_REQUEST);
  }
  if (questionBody.answers.find(answer => answer.answer.length < 1) || questionBody.answers.find(answer => answer.answer.length > 30)) {
    throw new ApiError('The length of any answer is shorter than 1 character long, or longer than 30 characters long', HttpStatusCode.BAD_REQUEST);
  }

  const answerMap = new Map <string, boolean>();

  questionBody.answers.map(answer => answerMap.set(answer.answer, answer.correct));
  if (answerMap.size !== questionBody.answers.length) {
    throw new ApiError('Answer strings are duplicates of one another', HttpStatusCode.BAD_REQUEST);
  }

  if (!(questionBody.answers.find(answer => answer.correct === true))) {
    throw new ApiError('There are no correct answers', HttpStatusCode.BAD_REQUEST);
  }
  if (!tokenValidation(token)) {
    throw new ApiError('Token is empty or invalid', HttpStatusCode.UNAUTHORISED);
  }

  if (!dataStore.quizzes.some((quiz) => quiz.quizId === quizId)) {
    throw new ApiError('Invalid quiz ID', HttpStatusCode.BAD_REQUEST);
  }

  const authUser = dataStore.tokens.find(user => user.sessionId === token);
  if (quiz.quizOwner !== authUser.userId) {
    throw new ApiError('Valid token is provided, but user is not an owner of this quiz', HttpStatusCode.FORBIDDEN);
  }

  quiz.timeLastEdited = getUnixTime(new Date());

  const availableColours = [...Colours];
  const arrayOfAnswers = [];

  for (const element of questionBody.answers) {
    const newAnswerId = (arrayOfAnswers.length + 1);
    const questionAnswerBody: Answer = {
      answerId: newAnswerId,
      answer: element.answer,
      correct: element.correct,
      colour: getRandomColorAndRemove(availableColours),
    };
    arrayOfAnswers.push(questionAnswerBody);
  }

  const question = quiz.questions.find(question => question.questionId === questionId);

  const questionToUpdate = question;
  questionToUpdate.question = questionBody.question;
  questionToUpdate.points = questionBody.points;
  questionToUpdate.duration = questionBody.duration;
  questionToUpdate.answers = arrayOfAnswers;
  quiz.quizDuration = getTotalDurationOfQuiz(quiz.quizId);
>>>>>>> 55d36cb (updateQuestion: Working code and passing all tests)

  setData(dataStore);
  return {};
}
<<<<<<< HEAD
export { quizCreateQuestion, adminMoveQuestion };
=======
export { quizCreateQuestion, quizUpdateQuestion };
>>>>>>> 55d36cb (updateQuestion: Working code and passing all tests)
