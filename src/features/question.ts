// import statements
import { Question, Answer, QuestionCreate, Colours } from '../dataStore';
import { tokenValidation, getTotalDurationOfQuiz, getRandomColorAndRemove, findToken, findQuizById, findQuestionByQuiz } from './other';
import { getData, setData } from '../dataStore';
import { HttpStatusCode } from '../enums/HttpStatusCode';
import { ApiError } from '../errors/ApiError';
import { getUnixTime } from 'date-fns';

interface adminDuplicateQuestionReturn {
  newQuestionId: number
}

export interface CreateQuestionReturn {
  questionId: number,
}

/**
 * Create a new stub question for a particular quiz.
 * When this route is called, and a question is created, the timeLastEdited is set as the same as the created time, and the colours of all answers of that question are randomly generated.
 * @param quizId
 * @param token
 * @param questionBody
 * @returns - CreateQuestionReturn returns a questionId
 */
function quizCreateQuestion(quizId: number, token: string, questionBody: QuestionCreate): CreateQuestionReturn {
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

/**
 * A particular question gets duplicated to immediately after where the source question is
 * When this route is called, the timeLastEdited is update
 * @param sessionId - sessionId of token
 * @param quizId - quizId of question to be duplicated
 * @param questionId - question within quiz to be duplicated
*/
function adminDuplicateQuestion (sessionId: string, quizId: number, questionId: number): adminDuplicateQuestionReturn {
  const dataStore = getData();

  // invalid token
  if (!tokenValidation(sessionId)) {
    throw new ApiError('Token is empty or invalid (does not refer to valid logged in user session)', HttpStatusCode.UNAUTHORISED);
  }
  const tokenUser = findToken(sessionId);
  const matchedQuiz = findQuizById(quizId);
  // token user is not the owner of question
  if (dataStore.quizzes.some((quiz) => (quiz.quizOwner !== tokenUser.userId && quiz.quizId === quizId))) {
    throw new ApiError('User does not own quiz to change owner', HttpStatusCode.FORBIDDEN);
  }
  // invalid quiz
  if (matchedQuiz === undefined) {
    throw new ApiError('Quiz ID does not refer to a valid quiz', HttpStatusCode.BAD_REQUEST);
  }
  // invalid question in quiz
  const questionToCopy = findQuestionByQuiz(matchedQuiz, questionId);
  if (questionToCopy === undefined) {
    throw new ApiError('Question Id does not refer to a valid question within this quiz', HttpStatusCode.BAD_REQUEST);
  }

  const duplicatedQuestion: Question = {
    questionId: matchedQuiz.numQuestions + 1,
    question: questionToCopy.question,
    duration: questionToCopy.duration,
    points: questionToCopy.points,
    answers: questionToCopy.answers,
  };

  const questionIndex = matchedQuiz.questions.findIndex((question) => question.questionId === questionId);
  matchedQuiz.questions.splice((questionIndex + 1), 0, duplicatedQuestion);
  matchedQuiz.timeLastEdited = getUnixTime(new Date());
  matchedQuiz.numQuestions = matchedQuiz.questions.length;
  matchedQuiz.quizDuration = getTotalDurationOfQuiz(quizId);
  setData(dataStore);

  return { newQuestionId: duplicatedQuestion.questionId };
}

export { quizCreateQuestion, adminDuplicateQuestion };
