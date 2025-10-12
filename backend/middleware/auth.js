const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  // Obter o token do cabeçalho
  const token = req.header("x-auth-token");

  // Verificar se não há token
  if (!token) {
    return res.status(401).json({ msg: "Nenhum token, autorização negada" });
  }

  // Verificar token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token não é válido" });
  }
};

