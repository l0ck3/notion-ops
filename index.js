require("dotenv").config();

const qoveryClient = require("./src/apis/qovery");
const notionClient = require("./src/apis/notion");

const refreshNotion = async () => {
  const projects = await qoveryClient.listProjects();
  
  for (project of projects) {
    const notionProject = await notionClient.createOrUpdateProject(project);
    const apps = await qoveryClient.listAllApplications(project.id);

    for (app of apps) {
      await notionClient.createOrUpdateApplication(notionProject.id, app)
    }
  }
}

refreshNotion()
  .then(async => console.log("SUCCESS", "Notion has been refreshed"))
  .catch((e) => console.log("ERROR", e.message));

