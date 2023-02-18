import supertest from 'supertest';
import app from '../index';
import { image, imgdir } from '../utils/utils';
import fs from 'fs';
import path from 'path';

const request = supertest(app);
const resizesFolder = path.join(imgdir(), 'resized');

describe('Test endpoint responses', () => {
  it(`tests the image endpoint with no queries`, async () => {
    const response = await request.get('/image');
    expect(response.status).toBe(400);
  });
  it(`tests the image endpoint with invalid file name`, async () => {
    const response = await request.get('/image').query({ filename: 'invalid' });
    expect(response.status).toBe(404);
  });
  it(`tests the image endpoint with valid filename and invalid height`, async () => {
    const response = await request.get('/image').query({ filename: 'fjord', height: 'fdfd' });
    expect(response.status).toBe(400);
  });
  it(`tests the image endpoint with valid filename and valid height`, async () => {
    const response = await request.get('/image').query({ filename: 'fjord', height: 200 });
    expect(response.status).toBe(200);
    expect(fs.existsSync(resizesFolder)).toBeTrue();
  });
});

describe('Test image processing function responses', () => {
  it(`tests image processing function with invalid file`, async () => {
    const response = await image('fjord', 300, 250);
    expect(response).toBe(path.join(path.join(imgdir(), 'resized'), `fjord--w300--h250.jpg`));
  });
});
