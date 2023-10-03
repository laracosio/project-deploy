```javascript
let data = {
  quizzes: [
      {
        quizId: exampleId,
        name: 'exampleName',
        timeCreated: numTimeCreated, 
        timeLastEdited: numTimeLastEdited,
        description: 'exampleDescription',
        quizOwner: authUserId,
      }
  ]

  users: [
    {
      userId: exampleId,
      nameFirst: 'exampleFirst',
      nameLast: 'exampleLast',
      password: 'examplePassword',
      email: 'example@example.com',
      numSuccessfulLogins: numSuccessfulLogin,
      numFailedPasswordsSinceLastLogin: numFailedLogin,
    }
  ]
}
```
[Optional] short description: 
assumptions:
  - userIds start at 1 and increment by 1 each time a new user is added
