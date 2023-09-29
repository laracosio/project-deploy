// requires authregister and quizCreate to be imported
import { adminAuthRegister } from './auth.js';
import { adminQuizCreate} from 'quiz.js';
import { person1, person2 } from '.testingData.js';

describe('clear - Success Cases', () => {
    test('clear - user', () => {
        adminAuthRegister(person1.email, person1.password, person1.nameFirst, person1.nameLast);
        adminAuthRegister(person2.email, person2.password, person2.nameFirst, person2.nameLast);
        expect(clear().toBe({}));
    })
    test('clear - user and quiz', () => {
        adminAuthRegister(person1.email, person1.password, person1.nameFirst, person1.nameLast);
        adminQuizCreate(1, 'Misc Quiz Name', 'Misc Description');
        expect(clear().toBe({}));
    })
    test('clear - multiple users and quizzes', () => {
        adminAuthRegister(person1.email, person1.password, person1.nameFirst, person1.nameLast);
        adminAuthRegister(person2.email, person2.password, person2.nameFirst, person2.nameLast);
        adminQuizCreate(1, 'Misc Quiz Name', 'Misc Description');
        adminQuizCreate(2, 'Misc Quiz Name2', 'Misc Description2');
        expect(clear().toBe({}));
    })
})