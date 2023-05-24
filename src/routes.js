const routes = require('express').Router();

const LoginController = require('./app/controllers/LoginController');
const authenticateMiddleware = require('./app/middlewares/authenticate');
const { User } = require('./app/models');


routes.get('/', async (req, res) => {
    try {
        const user = await User.create({
            name: "Rob",
            email: "jao@gmail.com",
            password: "123456"
        });    

        return res.status(200).json({ message: "User created!"});
    } catch (e) {
        return res.status(400).json({
            errors: e.errors.map((err) => err.message),
        });
    }
});

routes.post('/login', LoginController.login);

routes.use(authenticateMiddleware);

//Closed Routes

routes.get('/profile', (req, res) => {
    return res.status(200).json({ message: `Your token is fine! Id: ${req.userId}` });
});


module.exports = routes;
