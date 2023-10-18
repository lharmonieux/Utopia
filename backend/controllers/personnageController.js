import Personnage from "../models/personnageModel.js";
import constants from "../constants.js";

//Add personnage
export const addPersonnage = async (req, res) => {
    try {
        const { nom, caracteristique } = req.body;
        if (!nom || !caracteristique){
            return res.status(constants.VALIDATION_ERROR).send({
                message: "Veuillez renseigner tous les champs"
            });
        }

        //Save data
        const newPersonnage = await Personnage.create({
            nom: nom,
            caracteristique: caracteristique
        });
        return res.status(constants.CREATED).send(newPersonnage);
    } catch (error) {
        console.error(error);
        return res.status(constants.SERVER_ERROR).send({message: error.message});
    }
}

//Read personnage
export const getAllPersonnage = async (req, res) => {
    try {
        const personnages = await Personnage.find({});
    if (personnages) return res.status(constants.SUCCESS).send(personnages);

    return res.status(constants.SUCCESS).send({
        message: "Aucun personnage trouvé."
    });
    } catch (error) {
        console.error();
        return res.status(constants.SERVER_ERROR).send({
            message: error.message
        });
    }
    
}