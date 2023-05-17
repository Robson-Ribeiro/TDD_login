const request = require('supertest');
const jwt = require("jsonwebtoken");

const app = require('../../src/app');
const { User } = require('../../src/app/models');
const truncate = require('../utils/truncate');

jest.useRealTimers();

describe('login', () => {
    beforeEach(async () => {
        await truncate();
    });

    it('should ', () => {
        expect(1).toBe(1);
    });

    it('should login with correct credentials', async () => {
        const user = await User.create({
            name: "Jon",
            email: "jonathan@gmail.com",
            password: "1234"
        });

        const response = await request(app)
            .post('/login')
            .send({
                email: "jonathan@gmail.com",
                password: "1234"
            });

        expect(response.status).toBe(200);
    });

    it('should not login with incorrect email', async () => {
        const user = await User.create({
            name: "Jon",
            email: "jonathan@gmail.com",
            password: "1234"
        });

        const response = await request(app)
            .post('/login')
            .send({
                email: "han@gmail.com",
                password: "1234"
            });

        expect(response.status).toBe(401);
    });

    it('should not login with incorrect password', async () => {
        const user = await User.create({
            name: "Jon",
            email: "jonathan@gmail.com",
            password: "1234"
        });

        const response = await request(app)
            .post('/login')
            .send({
                email: "jonathan@gmail.com",
                password: "12343123123"
            });

        expect(response.status).toBe(401);
    });

    it('should not login without credentials', async () => {
        const user = await User.create({
            name: "Jon",
            email: "jonathan@gmail.com",
            password: "1234"
        });

        const response = await request(app)
            .post('/login')
            .send({
                email: "",
                password: ""
            });

        expect(response.status).toBe(401);
    });

    it('should receive a token after login successfully', async () => {
        const user = await User.create({
            name: "Jon",
            email: "jonathan@gmail.com",
            password: "1234"
        });

        const response = await request(app)
            .post('/login')
            .send({
                email: "jonathan@gmail.com",
                password: "1234"
            });

        expect(response.body).toHaveProperty("token");
    });

    it('should receive a valid token after login successfully', async () => {
        const user = await User.create({
            name: "Jon",
            email: "jonathan@gmail.com",
            password: "1234"
        });

        const response = await request(app)
            .post('/login')
            .send({
                email: "jonathan@gmail.com",
                password: "1234"
            });
        const token = user.tokenGenerator();

        expect(response.body.token).toEqual(token);
    });

    it('should not enter in private routes without a valid token', async () => {
        const user = await User.create({
            name: "Jon",
            email: "jonathan@gmail.com",
            password: "1234"
        });

        const response = await request(app)
            .get('/profile');

        expect(response.status).toBe(401);
    });

    it('should enter in private routes with valid token', async () => {
        const user = await User.create({
            name: "Jon",
            email: "jonathan@gmail.com",
            password: "1234"
        });

        const response = await request(app)
            .get('/profile')
            .set("Authorization", `Bearer ${user.tokenGenerator()}`);

        expect(response.status).toBe(200);
    });

    it('should not enter in private routes with invalid token', async () => {
        const user = await User.create({
            name: "Jon",
            email: "jonathan@gmail.com",
            password: "1234"
        });

        const response = await request(app)
            .get('/profile')
            .set("Authorization", "Bearer 12345");

        expect(response.status).toBe(401);
    });

});
