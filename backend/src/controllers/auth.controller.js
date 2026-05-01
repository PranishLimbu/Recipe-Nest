const authService = require("../services/auth.service");

exports.register = async (req, res) => {
  try {
    const { user, token } = await authService.register(req.body);
    res.status(201).json({ user, token });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.registerChef = async (req, res) => {
  try {
    const { user, chef, token } = await authService.registerChef(req.body);
    res.status(201).json({ user, chef, token });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.registerAdmin= async(req, res)=>{
  try{
    const { user, token } = await authService.registerAdmin(req.body);
    res.status(201).json({ user, token });

  }
  catch(err){
    res.status(400).json({ error: err.message });
  }

};


exports.login = async (req, res) => {
  try {
    const { user, token } = await authService.login(req.body);
    res.json({ user, token });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
