require("dotenv").config();

const qoveryClient = require("./src/apis/qovery");
const notionClient = require("./src/apis/notion");

const createNotionProjects = async (projectsList) => {
  await Promise.all(projectsList.map((project) => (
    notionClient.createOrUpdateProject(project)
  )))
}

qoveryClient.listProjects()
  .then(async (projects) => await createNotionProjects(projects))
  .catch((e) => console.log("ERROR", e.message));
