import constants from "../constants.js";
import cloudinary from "../utils/cloudinary.js";

// Get images
export const getImages = async (req, res) => {
  try {
    const { resources } = await cloudinary.search
      .expression("folder:exploria")
      .execute();

    const publicIds = resources.map((file) => file.public_id);
    return res.status(constants.SUCCESS).send(publicIds);
  } catch (error) {
    console.log(error);
    return res.status(constants.SERVER_ERROR).json({ message: error.message });
  }
};

// Upload images
export const uploadImage = async (req, res) => {
  try {
    const fileStr = req.body.data;
    const uploadResponse = await cloudinary.uploader.upload(fileStr, {
      upload_preset: "samples",
    });

    return res.status(constants.CREATED).json({message: 'Image uploadée avec succès !'});
  } catch (error) {
    console.log(error);
    return res.status(constants.SERVER_ERROR).json({ message: error.message });
  }
};
