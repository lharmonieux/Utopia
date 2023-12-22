import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import constants from "../constants.js";
import Account from "../models/accountModel.js";

// @access Public
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Veuillez renseigner tous les champs" });
    }

    // search user
    const foundAccount = await Account.findOne({ email }).populate('user').exec();

    if (!foundAccount) {
      return res
        .status(constants.UNAUTHORIZED)
        .json({ message: `Email incorrect` });
    }

    const match = await bcrypt.compare(password, foundAccount.password);

    if (!match)
      return res
        .status(constants.UNAUTHORIZED)
        .json({ message: `Mot de passe incorrect` });

    const accessToken = jwt.sign(
      {
        UserInfo: {
          email: foundAccount.email,
          role: foundAccount.user.role,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "60m" }
    );

    const refreshToken = jwt.sign(
      { email: foundAccount.email },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "5h" }
    );

    // Create secure cookie with access token
    res.cookie("jwt", refreshToken, {
      httpOnly: true, //accessible only by web server
      secure: true, //https
      sameSite: "None", //cross-site cookie
      maxAge: 7 * 24 * 60 * 60 * 1000, //cookie expiry: set to match rT
    });

    return res.status(constants.SUCCESS).json({ accessToken });
  } catch (error) {
    console.log(error.message);
    return res.status(constants.SERVER_ERROR).json({ message: error.message });
  }
};

// @access Public
export const refresh = async (req, res) => {
  try {
    const cookies = req.cookies;

    if (!cookies?.jwt)
      return res
        .status(constants.UNAUTHORIZED)
        .json({
          message:
            "Il manque des informations d'authentification. Veuillez vous reconnecter",
        });

    const refreshToken = cookies.jwt;

    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      async (err, decoded) => {
        if (err)
          return res
            .status(constants.FORBIDDEN)
            .json({ message: "Veuillez vous reconnecter" });

        // Control of user's exist
        const foundAccount = await Account.findOne({
          email: decoded.email,
        }).populate('user').exec();

        if (!foundAccount)
          return res
            .status(constants.UNAUTHORIZED)
            .json({
              message: "Utilisateur introuvable. Veuillez vous reconnecter",
            });

        const accessToken = jwt.sign(
          {
            UserInfo: {
              email: foundAccount.email,
              role: foundAccount.user.role,
            },
          },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: "60m" }
        );

        return res.status(constants.SUCCESS).json({ accessToken });
      }
    );
  } catch (error) {
    console.log(error.message);
    return res.status(constants.SERVER_ERROR).json({ message: error.message });
  }
};
