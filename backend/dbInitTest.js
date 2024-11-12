import mongoose from "mongoose";
import Role from "./models/roleModel.js";
import User from "./models/userModel.js";
import Company from "./models/companyModel.js";
import Project from "./models/projectModel.js";
import Thematic from "./models/thematicModel.js";
import QuestionType from "./models/questionTypeModel.js";

const ObjectId = mongoose.Types.ObjectId;
const roleDatas = [
  {
    _id: new ObjectId("5f8e6e7e5f8e6e7e5f8e6e7a"),
    name: "ADMIN",
  },
  {
    _id: new ObjectId("5f8e6e7e5f8e6e7e5f8e6e7b"),
    name: "JOUEUR",
  },
];

const userDatas = [
  {
    _id: new ObjectId("5f8e6e7e5f8e6e7e5f8e6e7c"),
    firstname: "John",
    lastname: "Doe",
    email: "johndoe@me.com",
    password: "$2a$10$feqhGAGwOGBs7bSIXv8vX.e/sKtoDoR74VK0TIYWBWLvMNXjTfXzW", //johndoe123
    role: "5f8e6e7e5f8e6e7e5f8e6e7a",
  },
  {
    _id: new ObjectId("5f8e6e7e5f8e6e7e5f8e6e8a"),
    firstname: "Jane",
    lastname: "Doe",
    email: "janedoe@me.com",
    password: "$2a$10$feqhGAGwOGBs7bSIXv8vX.e/sKtoDoR74VK0TIYWBWLvMNXjTfXzW", //johndoe123
    role: "5f8e6e7e5f8e6e7e5f8e6e7b",
  },
];

const companyDatas = [
  {
    _id: new ObjectId("5f8e6e7e5f8e6e7e5f8e6e7d"),
    name: "Burger King",
  },
];

const projectDatas = [
  {
    _id: new ObjectId("5f8e6e7e5f8e6e7e5f8e6e7e"),
    name: "Mon projet",
    company: "5f8e6e7e5f8e6e7e5f8e6e7d",
    admin: "5f8e6e7e5f8e6e7e5f8e6e7c",
  },
];

const thematicDatas = [
  {
    _id: new ObjectId("5f8e6e7e5f8e6e7e5f8e6e9a"),
    name: "Ambition",
  },
  {
    _id: new ObjectId("5f8e6e7e5f8e6e7e5f8e6e9b"),
    name: "Audace",
  },
  {
    _id: new ObjectId("5f8e6e7e5f8e6e7e5f8e6e9c"),
    name: "Immersion",
  },
  {
    _id: new ObjectId("5f8e6e7e5f8e6e7e5f8e6e9d"),
    name: "Assertivité",
  },
  {
    _id: new ObjectId("5f8e6e7e5f8e6e7e5f8e6e9e"),
    name: "Agilité",
  },
  {
    _id: new ObjectId("5f8e6e7e5f8e6e7e5f8e6e9f"),
    name: "Acuité",
  },
];

const questionsTypeDatas = [
  {
    _id: new ObjectId("5f8e6e7e5f8e6e7e5f8e6ea0"),
    name: "proposition",
  },
  {
    _id: new ObjectId("5f8e6e7e5f8e6e7e5f8e6ea1"),
    name: "proposition_multiple",
  },
  {
    _id: new ObjectId("5f8e6e7e5f8e6e7e5f8e6ea2"),
    name: "town",
  },
  {
    _id: new ObjectId("5f8e6e7e5f8e6e7e5f8e6ea3"),
    name: "personnage",
  },
  {
    _id: new ObjectId("5f8e6e7e5f8e6e7e5f8e6ea4"),
    name: "classement",
  },
  {
    _id: new ObjectId("5f8e6e7e5f8e6e7e5f8e6ea5"),
    name: "pourcentage",
  },
  {
    _id: new ObjectId("5f8e6e7e5f8e6e7e5f8e6ea6"),
    name: "texte",
  },
  {
    _id: new ObjectId("5f8e6e7e5f8e6e7e5f8e6ea7"),
    name: "texte_ville",
  },
  {
    _id: new ObjectId("5f8e6e7e5f8e6e7e5f8e6ea8"),
    name: "notation",
  },
  {
    _id: new ObjectId("5f8e6e7e5f8e6e7e5f8e6ea9"),
    name: "reponse_double",
  },
];

export const initializeDB = async (app) => {
  try {
    mongoose.connect("mongodb://localhost:27017/exploria_test").then(() => {
      app.listen(5555, () => {
        console.log(`Server started on 5555`);
      });
      console.log("App connected to database test");
    });

    //Delete existng datas
    // await mongoose.connection.dropDatabase();

    // //Add Roles
    // await Role.insertMany(roleDatas);

    // //Add Users
    // await User.insertMany(userDatas);

    // //Add Companies
    // await Company.insertMany(companyDatas);

    // //Add Projects
    // await Project.insertMany(projectDatas);

    // //Add Thematics
    // await Thematic.insertMany(thematicDatas);

    // //Add Question Types
    // await QuestionType.insertMany(questionsTypeDatas);

    // console.log("Database initialized with test datas");
  } catch (err) {
    console.log("Error while initializing test database", err);
  }
};
