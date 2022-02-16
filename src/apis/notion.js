const { Client } = require("@notionhq/client");

const notion = new Client({ auth: process.env.NOTION_INTEGRATION_TOKEN });
const notionPageID = process.env.NOTION_PAGE_ID;

const findProjectByQoveryID = async (qoveryID) => {
  const res = await notion.databases.query({
    database_id: notionPageID,
    filter: {
      property: 'Qovery ID',
      text: {
        equals: qoveryID,
      },
    }
  });

  return res.results[0];  
}

const createProject = async (project) => {
  const res = await notion.pages.create({
    parent: {
      type: "database_id",
      database_id: notionPageID,
    },
    cover: {
      type: "external",
      external: {
        url: `https://source.unsplash.com/random/900x700/?abstract,${project.id}`
      }
    },    
    properties: {
      Name: {
        title: [{
          text: {
            content: project.name
          }
        }]
      },
      "Qovery ID": {
        rich_text: [{
          text: {
            content: project.id
          }
        }]
      },      
      "Description": {
        rich_text: [{
          text: {
            content: project.description
          }
        }]
      },      
    }
  });  

  return res.id;
}

const updateProject = async (notionID, project) => {
  const res = await notion.pages.update({
    page_id: notionID,
    properties: {
      Name: {
        title: [{
          text: {
            content: project.name
          }
        }]
      },   
      "Description": {
        rich_text: [{
          text: {
            content: project.description
          }
        }]
      },
    },
  });

  return res;
}

exports.getPage = async () => {
  const response = await notion.pages.retrieve({ page_id: notionPageID });

  return response;
}

exports.createOrUpdateProject = async (project) => {
  let res;
  const notionProject = await findProjectByQoveryID(project.id);

  if (notionProject) {
    res = await updateProject(notionProject.id, project);
  } else {
    res = await createProject(project);
  }

  return res;
}
