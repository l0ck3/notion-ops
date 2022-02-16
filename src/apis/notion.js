const { Client } = require("@notionhq/client");

const notion = new Client({ auth: process.env.NOTION_INTEGRATION_TOKEN });
const notionPageID = process.env.NOTION_PAGE_ID;

const findProjectByQoveryID = async (qoveryID) => {
  const res = await notion.databases.query({
    database_id: notionPageID,
    filter: {
      property: "Qovery ID",
      text: {
        equals: qoveryID,
      },
    },
  });

  return res.results[0];
};

const getAppsList = async (projectID) => {
  const res = await notion.blocks.children.list({
    block_id: projectID,
  });

  return res.results[0];
};

const findApplicationByQoveryID = async (projectID, qoveryID) => {
  const appsList = await getAppsList(projectID);

  res = await notion.databases.query({
    database_id: appsList.id,
    filter: {
      property: "Qovery ID",
      text: {
        equals: qoveryID,
      },
    },
  });

  return res.results[0];
};

const createProject = async (project) => {
  const res = await notion.pages.create({
    parent: {
      type: "database_id",
      database_id: notionPageID,
    },
    cover: {
      type: "external",
      external: {
        url: `https://source.unsplash.com/random/900x700/?abstract,${project.id}`,
      },
    },
    properties: {
      Name: {
        title: [
          {
            text: {
              content: project.name,
            },
          },
        ],
      },
      "Qovery ID": {
        rich_text: [
          {
            text: {
              content: project.id,
            },
          },
        ],
      },
      Description: {
        rich_text: [
          {
            text: {
              content: project.description,
            },
          },
        ],
      },
    },
  });

  await notion.databases.create({
    parent: {
      type: "page_id",
      page_id: res.id,
    },
    title: [{ type: "text", text: { content: "Applications List" } }],
    properties: {
      Name: {
        title: {},
      },
      Environment: {
        rich_text: {},
      },
      Status: {
        select: {
          options: [
            {
              name: "Not Deployed",
              color: "gray",
            },
            {
              name: "Running",
              color: "green",
            },
            {
              name: "Error",
              color: "red",
            },
            {
              name: "Deploying",
              color: "yellow",
            },
          ],
        },
      },
      "Qovery ID": {
        rich_text: {},
      },
    },
  });

  return res;
};

const updateProject = async (notionID, project) => {
  const res = await notion.pages.update({
    page_id: notionID,
    properties: {
      Name: {
        title: [
          {
            text: {
              content: project.name,
            },
          },
        ],
      },
      Description: {
        rich_text: [
          {
            text: {
              content: project.description,
            },
          },
        ],
      },
    },
  });

  return res;
};

const createApplication = async (projectID, application) => {
  const appsList = await getAppsList(projectID);

  const res = await notion.pages.create({
    parent: {
      type: "database_id",
      database_id: appsList.id,
    },
    properties: {
      Name: {
        title: [
          {
            text: {
              content: application.name,
            },
          },
        ],
      },
      Environment: {
        rich_text: [
          {
            text: {
              content: application.environment.name,
            },
          },
        ],
      },
      Status: {
        select: {
          name: "Not Deployed",
        },
      },
      "Qovery ID": {
        rich_text: [
          {
            text: {
              content: application.id,
            },
          },
        ],
      },
    },
  });

  return res.id;
};

const updateApplication = async (applicationID, application) => {
  const res = await notion.pages.update({
    page_id: applicationID,
    properties: {
      Name: {
        title: [
          {
            text: {
              content: application.name,
            },
          },
        ],
      },
      Environment: {
        rich_text: [
          {
            text: {
              content: application.environment.name,
            },
          },
        ],
      },
      Status: {
        select: {
          name: "Not Deployed",
        },
      },
    },
  });

  return res;
};

exports.getPage = async () => {
  const response = await notion.pages.retrieve({ page_id: notionPageID });

  return response;
};

exports.createOrUpdateProject = async (project) => {
  let res;
  const notionProject = await findProjectByQoveryID(project.id);

  if (notionProject) {
    res = await updateProject(notionProject.id, project);
  } else {
    res = await createProject(project);
  }

  return res;
};

exports.createOrUpdateApplication = async (projectID, application) => {
  let res;
  const notionApplication = await findApplicationByQoveryID(
    projectID,
    application.id
  );

  if (notionApplication) {
    res = await updateApplication(notionApplication.id, application);
  } else {
    res = await createApplication(projectID, application);
  }

  return res;
};
