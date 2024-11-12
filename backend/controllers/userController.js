import constants from "../utils/constants.js";
import bcrypt from "bcrypt";
import User from "../models/userModel.js";
import Role from "../models/roleModel.js";
import Project from "../models/projectModel.js";
import { sendMail } from "../utils/mail.js";

// Registration for an user
// @access Private
export const createUser = async (req, res) => {
  try {
    const { firstname, lastname, email, password, role, project } = req.body;
    //Form not completed
    if (!firstname || !lastname || !email || !password || !role) {
      return res
        .status(constants.VALIDATION_ERROR)
        .json({ message: "Veuillez renseigner tous les champs" });
    }

    // Check if user for JOUEUR role has a project assigned
    if (role === "JOUEUR" && !project) {
      return res.status(constants.VALIDATION_ERROR).json({
        message: "Veuillez renseigner le projet",
      });
    }

    // Check for duplicate username
    const duplicate = await User.findOne({ email }).exec();
    if (duplicate) {
      return res.status(constants.CONFLICT).json({
        message: `Cette adresse mail existe déjà.`,
      });
    }

    // Get project
    const projectData = await Project.findOne({ _id: project });
    if (!projectData && role === "JOUEUR") {
      return res.status(constants.VALIDATION_ERROR).json({
        message: "Le projet est invalide",
      });
    }

    //Hash password
    const hashedPwd = await bcrypt.hash(password, 10);

    //Get user role id
    const roleId = await Role.findOne({ name: role }).select("_id");
    if (!roleId) {
      return res.status(constants.VALIDATION_ERROR).json({
        message: "le rôle est invalide",
      });
    }

    //Create and store new user
    const user = await User.create({
      firstname,
      lastname,
      email,
      password: hashedPwd,
      role: roleId,
      project,
    });

    if (user) {
      // send mail
      const subject = "Activation de votre compte Exploria";
      let full_message = "";

      //Get defined email message from project
      let email_message = projectData?.email_message || "";
      if (email_message) {
        email_message = email_message.replace(/\r\n|\n/, "<br>");
        full_message = `${email_message}<br><br>
      Votre mot de passe est: <b>${password}</b>
      </b><br> Afin de pouvoir vous connecter et ainsi valider votre compte, vous devez le changer dans votre espace personnel.<br>
      Accédez à la plateforme via ce lien: <a href="${process.env.URL_FRONT}">Exploria</a>`;
      } else
        full_message = `Bienvenue ${firstname} ${lastname} en tant que nouvel administrateur sur Exploria. <br>Votre mot de passe est: <b>${password}</b>
      </br><br> Afin de pouvoir vous connecter et ainsi valider votre compte, vous devez le changer dans votre espace personnel.<br>
      Accédez à la plateforme via ce lien: <a href="${process.env.URL_FRONT}">Exploria</a>`;

      sendMail({
        to: user.email,
        subject,
        text: full_message,
        html: full_message,
      })
        .then(() => {
          console.log("email sent");
        })
        .catch((error) => {
          console.log(error);
        });

      return res.status(constants.SUCCESS).send({
        message: `Nouveau compte créé : ${user.firstname} ${user.lastname}`,
        user: user,
      });
    } else
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
      user = await User.findOne({ email: req.email })
        .populate("role")
        .populate("currentAct")
        .populate("secondCharacter")
        .populate("town")
        .populate("comments.question")
        .populate("saves.logScores.thematic")
        .exec();
    if (user)
      return res
        .status(constants.SUCCESS)
        .json({ message: "Utilisateur trouvé", user });
    return res
      .status(constants.NOT_FOUND)
      .json({ message: "Cet utilisateur n'existe pas" });
  } catch (error) {
    console.log(error);
    return res.status(constants.SERVER_ERROR).json({ message: error.message });
  }
};

export const getUsersByProject = async (req, res) => {
  try {
    const { projectId } = req.query;
    const users = await User.find({
      project: projectId,
      isDeleted: false,
    })
      .populate("currentAct")
      .populate("secondCharacter")
      .populate("character")
      .populate("town")
      .populate("comments.question")
      .populate("saves.logScores.thematic")
      .populate("saves.logAnswers.thematic")
      .populate("saves.act")
      .exec();
    if (users)
      return res
        .status(constants.SUCCESS)
        .json({ message: "Joueurs du projet", users });

    return res
      .status(constants.NOT_FOUND)
      .json({ message: "Aucun utilisateur dans ce projet" });
  } catch (error) {
    console.log(error);
    return res.status(constants.SERVER_ERROR).json({ message: error.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const { idUser } = req.query;
    const user = await User.findById(idUser).exec();
    if (user)
      return res
        .status(constants.SUCCESS)
        .json({ message: "Joueur trouvé", user });
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
    const users = await User.find({}).exec();
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
    const { userToSave, idUser } = req.body;

    const updatedUser = await User.findByIdAndUpdate(idUser, userToSave);
    if (updatedUser)
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

export const editPassword = async (req, res) => {
  try {
    const { idUser, currentPassword, newPassword } = req.body;
    const user = await User.findById(idUser);
    if (!user)
      return res
        .status(constants.NOT_FOUND)
        .json({ message: "Utilisateur introuvable" });

    const match = await bcrypt.compare(currentPassword, user.password);
    if (!match)
      return res
        .status(constants.NOT_FOUND)
        .json({ message: "Mot de passe actuel invalide" });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const updatedUser = await User.findByIdAndUpdate(idUser, {
      password: hashedPassword,
    });
    if (updatedUser)
      return res
        .status(constants.CREATED)
        .json({ message: "Mot de passe modifié avec succès !" });
  } catch (error) {
    console.log(error);
    return res.status(constants.SERVER_ERROR).json({ message: error.message });
  }
};

export const definePassword = async (req, res) => {
  try {
    const { idUser, newPassword } = req.body;
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const updatedUser = await User.findByIdAndUpdate(idUser, {
      password: hashedPassword,
      isPasswordChanged: true,
    });

    if (updatedUser)
      return res
        .status(constants.CREATED)
        .json({ message: "Mot de passe défini avec succès !" });
  } catch (error) {
    console.log(error);
    return res.status(constants.SERVER_ERROR).json({ message: error.message });
  }
};
