import jwt from "jsonwebtoken";
import constants from "../constants.js";

export const verifiJWT = (req, res, next) => {
  //When token is passed by header
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res
      .status(constants.UNAUTHORIZED)
      .json({ message: "Redirection vers la connexion..." });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err)
      return res
        .status(constants.FORBIDDEN)
        .json({ message: "Votre temps de connexion a expiré..." });
    req.email = decoded.UserInfo.email;
    req.role = decoded.UserInfo.role;
    next();
  });
};
