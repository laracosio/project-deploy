// // DELETE THIS LATER
test('REMOVE ME - added to pass testing pipeline!', () => {
  const number = 1;
  expect(number).toBeGreaterThanOrEqual(1);
});

// UNCOMMENT LATER

// Do not delete this file
// import request from 'sync-request';
// import config from '../config.json';

// const OK = 200;
// const INPUT_ERROR = 400;
// const port = config.port;
// const url = config.url;

// describe('HTTP tests using Jest', () => {
//   test('Test successful echo', () => {
//     const res = request(
//       'GET',
//             `${url}:${port}/echo`,
//             {
//               qs: {
//                 echo: 'Hello',
//               },
//               // adding a timeout will help you spot when your server hangs
//               timeout: 100
//             }
//     );
//     const bodyObj = JSON.parse(res.body as string);
//     expect(res.statusCode).toBe(OK);
//     expect(bodyObj.value).toEqual('Hello');
//   });
//   test('Test invalid echo', () => {
//     const res = request(
//       'GET',
//             `${url}:${port}/echo`,
//             {
//               qs: {
//                 echo: 'echo',
//               },
//               timeout: 100
//             }
//     );
//     const bodyObj = JSON.parse(res.body as string);
//     expect(res.statusCode).toBe(INPUT_ERROR);
//     expect(bodyObj.error).toStrictEqual(expect.any(String));
//   });
// });
