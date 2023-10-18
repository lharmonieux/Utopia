import constants from "../constants.js";
import bcrypt from "bcrypt";
import User from "../models/userModel.js";

//Registration for an user
export const register = async (req, res) => {
    try {
        const { username, password } = req.body;
        //Form not completed
        if (!username || !password) {
            return res.status(constants.VALIDATION_ERROR)
                .json({ message: "Veuillez renseigner tous les champs" });
        }

        //Hash password
        const hashed_pwd = await bcrypt.hash(password, 5);

        const role = "JOUEUR";
        const user = await User.create({
            username,
            hashed_pwd,
            role
        });

        return res.status(constants.SUCCESS).send({message: "Utilisateur créé"});

    } catch (error) {
        return res.status(constants.SERVER_ERROR).send({message: error.message});
    }
}