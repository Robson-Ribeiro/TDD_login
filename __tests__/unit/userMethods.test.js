require('dotenv').config({
    path: '.env.test'
});

const bcrypt = require('bcryptjs');
const { User } = require('../../src/app/models');
const truncate = require('../utils/truncate');
const jwt = require('jsonwebtoken');

describe('Testing User methods', () => {

    beforeEach(async () => {
        await truncate();
    });

    it('should encrypt the password correctly', async () => {
        const user = await User.create({
            name: "Marc",
            email: "doe@gmail.com",
            password:  "qwerty"
        });

        const compareEncryption = await bcrypt.compare("qwerty", user.password_hash);
        const methodResult = await user.validatePassword("qwerty");

        expect(compareEncryption).toEqual(methodResult);
    });

    it('should generate a correct token', async () => {
        const user = await User.create({
            name: "Marc",
            email: "doe@gmail.com",
            password:  "qwerty"
        });

        const userToken = user.tokenGenerator();
        const token = jwt.sign({ id: user.id }, process.env.TOKEN_SECRET);

        expect(userToken).toEqual(token);
    });
});