import constants from "../constants.js";
import bcrypt from "bcrypt";
import User from "../models/userModel.js";
import Account from "../models/accountModel.js";

// Registration for an user
// @access Private
export const createUser = async (req, res) => {
  try {
    const { firstname, lastname, email, password } = req.body;
    //Form not completed
    if (!firstname || !lastname || !email || !password) {
      return res
        .status(constants.VALIDATION_ERROR)
        .json({ message: "Veuillez renseigner tous les champs" });
    }

    // Check for duplicate username
    const duplicate = await Account.findOne({ email }).exec();
    if (duplicate) {
      return res.status(constants.CONFLICT).json({
        message: `Cette adresse mail existe déjà.`,
      });
    }

    //Hash password
    const hashedPwd = await bcrypt.hash(password, 10);

    const role = "JOUEUR";

    //Create and store new user
    const user = await User.create({
      firstname,
      lastname,
      role,
    });

    let account;
    if (user) {
      // Create and store new account
      account = await Account.create({
        email,
        password: hashedPwd,
        user: user._id,
      });
    }

    if (user && account)
      return res.status(constants.SUCCESS).send({
        message: `Nouveau compte créé : ${user.firstname} ${user.lastname}`,
      });
    else
      return res.status(constants.VALIDATION_ERROR).json({
        message:
          "Erreur dans la création de l'utilisateur. Veuillez recharger la page et rééssayer.",
      });
  } catch (error) {
    return res.status(constants.SERVER_ERROR).json({ message: error.message });
  }
};

export const getUser = async (req, res) => {
  try {
    let user;
    if (req.email)
      user = await Account.findOne({ email: req.email })
        .select("-password")
        .populate("user")
        .exec();
    if (user) return res.status(constants.SUCCESS).json(user);
    return res
      .status(constants.NOT_FOUND)
      .json({ message: "Cet utilisateur n'existe pas" });
  } catch (error) {
    console.log(error);
    return res.status(constants.SERVER_ERROR).json({ message: error.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await Account.find({}).populate("user").exec();
    if (users) return res.status(constants.SUCCESS).json(users);
    return res
      .status(constants.NOT_FOUND)
      .json({ message: "Aucun utilisateur trouvé" });
  } catch (error) {
    console.log(error);
    return res.status(constants.SERVER_ERROR).json({ message: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    // Get datas from request
    const {
      idUser,
      firstname,
      lastname,
      role,
      character,
      secondCharacter,
      motto,
      town,
      townName,
      townStatus,
      saves,
    } = req.body;

    // element to save
    const userToSave = {
      firstname,
      lastname,
      role,
      character,
      secondCharacter,
      motto,
      town,
      townName,
      townStatus,
      saves,
    };

    const newUser = await User.findByIdAndUpdate(idUser, userToSave);
    if (newUser)
      return res
        .status(constants.CREATED)
        .json({ message: "Données sauvegardées." });
    return res
      .status(constants.NOT_FOUND)
      .json({ message: "Ce utilisateur n'existe pas" });
  } catch (error) {
    console.log(error);
    return res.status(constants.SERVER_ERROR).json({ message: error.message });
  }
};
