const axios = require('axios');

const qoveryAPIToken = process.env.QOVERY_API_TOKEN;
const qoveryOrganizationID = process.env.QOVERY_ORGANIZATION_ID;

const qoveryClient = axios.create({
  baseURL: 'https://api.qovery.com',
  headers: {'Authorization': 'Bearer ' + qoveryAPIToken}
});

exports.listProjects = async () => {
  const res = await qoveryClient.get(`/organization/${qoveryOrganizationID}/project`);

  return res.data.results.map(({id, name, description}) =>(
    {
      id,
      name,
      description
    }
  ));
}
