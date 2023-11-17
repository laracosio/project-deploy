import { Quiz } from '../dataStore';

export const quizToMetadata = (quiz: Quiz) => ({
  quizId: quiz.quizId,
  name: quiz.name,
  timeCreated: quiz.timeCreated,
  timeLastEdited: quiz.timeLastEdited,
  description: quiz.description,
  numQuestions: quiz.numQuestions,
  questions: quiz.questions,
  duration: quiz.quizDuration,
  thumbnailUrl: quiz.thumbnailUrl
});
