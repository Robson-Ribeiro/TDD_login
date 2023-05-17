const { User } = require('../models');

class LoginController {
    async login(req, res) {
        try{
            const user = await User.findOne({ where: { email: req.body.email } });
            
            if(!user) {
                 return res.status(401).json({ error: ["User doesn't exist"]});
            }

            if(!(await user.validatePassword(req.body.password))) { 
                return res.status(401).json({ error: ["User doesn't exist"]});
            } 

            const token = user.tokenGenerator();
            return res.status(200).json({ token });
        }catch(e){
            console.log(e);
        }
    }
};

module.exports = new LoginController();