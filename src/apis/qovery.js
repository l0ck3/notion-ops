const { makeConsoleLogger } = require("@notionhq/client/build/src/logging");
const axios = require("axios");

const qoveryAPIToken = process.env.QOVERY_API_TOKEN;
const qoveryOrganizationID = process.env.QOVERY_ORGANIZATION_ID;

const qoveryClient = axios.create({
  baseURL: "https://api.qovery.com",
  headers: { Authorization: "Bearer " + qoveryAPIToken },
});

const listEnvironments = async (projectID) => {
  const res = await qoveryClient.get(`/project/${projectID}/environment`);

  return res.data.results.map(({ id, name }) => ({
    id,
    name,
  }));
};

const listApplications = async (environmentID) => {
  const res = await qoveryClient.get(
    `/environment/${environmentID}/application`
  );

  return res.data.results.map(({ id, name }) => ({
    id,
    name
  }));
};

exports.listProjects = async () => {
  const res = await qoveryClient.get(
    `/organization/${qoveryOrganizationID}/project`
  );

  return res.data.results.map(({ id, name, description }) => ({
    id,
    name,
    description,
  }));
};

exports.listAllApplications = async (projectID) => {
  const envs = await listEnvironments(projectID);
  const apps = [];

  for (env of envs) {
    const res = await listApplications(env.id);

    apps.push(
      res.map((app) => ({
        id: app.id,
        name: app.name,
        environment: {
          id: env.id,
          name: env.name
        },
        status: "unknown",
      }))
    );
  }

  return apps.flat();
};
