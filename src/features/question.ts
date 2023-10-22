// import statements

import { Question, Answer } from "../dataStore";
import { tokenValidation, getTotalDurationOfQuiz } from './other';
import { getData, setData, Token } from '../dataStore';
import { HttpStatusCode } from '../enums/HttpStatusCode';
import { ApiError } from '../errors/ApiError';
import { getUnixTime } from 'date-fns';

// interface
interface CreateQuestionReturn {
    questionId: number,
}

// code
function quizCreateQuestion(quizId: number, token: string, questionBody: Question): CreateQuestionReturn {
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
    if (questionBody.answers.find(answer => answer.answer.length < 1) || questionBody.answers.find(answer => answer.answer.length > 10)) {
        throw new ApiError('The length of any answer is shorter than 1 character long, or longer than 30 characters long', HttpStatusCode.BAD_REQUEST);
    }

    var set = new Set(questionBody.answers);
    if (set.size !== questionBody.answers.length) {
        throw new ApiError('Answer strings are duplicates of one another', HttpStatusCode.BAD_REQUEST);
    }
    if (!(questionBody.answers.find(answer => answer.correct === true))) {
        throw new ApiError('There are no correct answers', HttpStatusCode.BAD_REQUEST);
    }

    if (!tokenValidation(token)) {
        throw new ApiError('Token is empty or invalid', HttpStatusCode.UNAUTHORISED);
    }

    const authUser = dataStore.tokens.find(user => user.sessionId === token);
    if (dataStore.quizzes[quizId].quizOwner !== authUser.userId) {
        throw new ApiError('Valid token is provided, but user is not an owner of this quiz', HttpStatusCode.FORBIDDEN);
    }

    dataStore.quizzes[quizId].timeLastEdited = getUnixTime(new Date());;
    
    /*
    const assignedColour = randomColourGenerator();
    
    answers[] = populateAnswersWithColor()

    [{color=}, {}, {}]

    */

    let questionId = 0;
    if (dataStore.quizzes[quizId].numQuestions === 0) {
        questionId = 1;
    } else {
        const reversedQuestionId = dataStore.quizzes.map(q => q.quizId).reverse();
        const currLastQuestionId = reversedQuestionId[0];
        questionId = currLastQuestionId + 1;
    }

    //TODO ASSIGNING ANSWER ID FOR ALL ANSWERS
    let answerId = 0;
    for (var answer of questionBody.answers) {
        if (dataStore.quizzes[quizId].questions[questionId].answers.length === 0) {
            answerId = 1;
            answer.answerId = answerId;
        } else {
            answerId = answerId + 1;
            answer.answerId = answerId;
        }
    }
    let position = 0;
    for (var answer of questionBody.answers) {
        answer.position++;
    }

    const newQuestion: Question = {
        "questionId": questionId,
        "question": questionBody.question,
        "duration": questionBody.duration,
        "points": questionBody.points,
        "answers": questionBody.answers,
    }

    return questionId;
};

export { quizCreateQuestion };