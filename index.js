require("dotenv").config();

const qoveryClient = require("./src/apis/qovery");
const notionClient = require("./src/apis/notion");

qoveryClient.listProjects()
  .then((projects) => console.log("QOVERY PROJECTS:", projects))
  .catch((e) => console.log("ERROR", e.message));

notionClient.getPage()
  .then((page) => console.log("NOTION PAGE:", page))
  .catch((e) => console.log("ERROR", e.message));
