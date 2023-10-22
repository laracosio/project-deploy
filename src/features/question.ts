// import statements
import { formatDuration, getUnixTime } from "date-fns";
import { getData } from "../dataStore";
import { HttpStatusCode } from "../enums/HttpStatusCode";
import { ApiError } from "../errors/ApiError";
import { findTokenUser, tokenValidation } from "./other";

// interface
// interface CreateQuestionReturn {
//   questionId: number
// }
interface duplicateQuestionReturn {
  newQuestionId: number
}

/**
 * A particular question gets duplicated to immediately after where the source question is
 * When this route is called, the timeLastEdited is update
 * @param sessionId - sessionId of token
 * @param quizId - quizId of question to be duplicated
 * @param questionId - question within quiz to be duplicated
 */
function duplicateQuestion (sessionId: string, quizId: number, questionId: number): duplicateQuestionReturn {
  const dataStore = getData();
  const quizBody = dataStore.quizzes.find((quiz) => quiz.quizId === quizId);
  // invalid quiz
  if (quizBody === undefined) {
    throw new ApiError('Quiz ID does not refer to a valid quiz', HttpStatusCode.BAD_REQUEST);
  }
  // invalid question in quiz
  const questionToCopy = quizBody.questions.find((question) => question.questionId === questionId);
  if (questionToCopy === undefined) {
    throw new ApiError('Question Id does not refer to a valid question within this quiz', HttpStatusCode.BAD_REQUEST);
  }
  // invalid token
  if (!tokenValidation(sessionId)) {
    throw new ApiError('Token is empty or invalid (does not refer to valid logged in user session)', HttpStatusCode.UNAUTHORISED);
  }
  
  const tokenUser = findTokenUser(sessionId);
  // token user is not the owner of question
  if (dataStore.quizzes.some((quiz) => (quiz.quizOwner !== tokenUser.userId && quiz.quizId === quizId))) {
    throw new ApiError('User does not own quiz to change owner', HttpStatusCode.FORBIDDEN);
  }

  // needs to call questionCreate
  const duplicatedQuestion: Question = {
    questionId: number,
    question: questionToCopy.question,
    duration: questionToCopy.duration,
    points: questionToCopy.points,
    answers: questionToCopy.answers,
    position: -100,
    timeCreated: getUnixTime(new Date()),
    timeLastEdited: getUnixTime(new Date()),
  }

  const questionIndex = quizBody.questions.findIndex((question) => question.questionId === questionId);
  quizBody.questions.splice(questionIndex, 0, duplicatedQuestion);
  quizBody.questions.forEach((question, index) => question.position = index);
  quizBody.timeLastEdited = getUnixTime(new Date());
  quizBody.quizDuration = TO_BE_IMPLEMENTED!!!
  
  return { newQuestionId: duplicatedQuestion.questionId }
}

export { duplicateQuestion };