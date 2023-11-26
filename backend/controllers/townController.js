import constants from "../constants.js";
import Town from "../models/townModel.js";

//Add
export const addTown = async (req, res) => {
  try {
    //Save multiples towns
    if (Array.isArray(req.body)) {
      const datas = [...req.body];
      for (const data of datas) {
        await Town.create({
          name: data.name,
          description: data.description,
          labelImg: data.labelImg,
          top: data.top,
          left: data.left,
          feedback: data.feedback,
        });
      }

      return res
        .status(constants.CREATED)
        .json({ message: "Villes créées avec succès !" });
    } else {
      const { name, description, labelImg, top, left, feedback } = req.body;
      await Town.create({
        name,
        description,
        labelImg,
        top,
        left,
        feedback,
      });

      return res
        .status(constants.CREATED)
        .json({ message: "Ville créée avec succès !" });
    }
  } catch (error) {
    console.log(error.message);
    return res.status(constants.SERVER_ERROR).json({ message: error.message });
  }
};

//Get
export const getTowns = async (req, res) => {
    try {
        const towns = await Town.find({});

        if(towns) return res.status(constants.SUCCESS).send(towns);
        return res.status(constants.SUCCESS).json({message: 'Aucune ville trouvée'})
    } catch (error) {
        console.log(error.message);
        return res.status(constants.SERVER_ERROR).json({ message: error.message });
    }
}
