const request = require('supertest');
const app = require('../src/index.js');

test('search users', async () => {
  const res = await request(app).get('/api/search/users?q=octocat');
  expect(res.statusCode).toBe(200);
  expect(res.body.items).toBeDefined();
  expect(Array.isArray(res.body.items)).toBe(true);
  if (res.body.items.length > 0) {
    expect(res.body.items[0]).toHaveProperty('login');
    expect(res.body.items[0]).toHaveProperty('avatar_url');
    expect(res.body.items[0]).toHaveProperty('html_url');
  }
});

test('user details', async () => {
  const res = await request(app).get('/api/user/octocat');
  expect(res.statusCode).toBe(200);
  expect(res.body.login).toBe('octocat');
  expect(res.body).toHaveProperty('html_url');
});

test('repo details', async () => {
  const res = await request(app).get('/api/repo/octocat/Hello-World');
  expect(res.statusCode).toBe(200);
  expect(res.body.full_name).toBe('octocat/Hello-World');
  expect(res.body).toHaveProperty('name');
});
