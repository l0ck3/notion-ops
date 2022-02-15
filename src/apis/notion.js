const { Client } = require("@notionhq/client");

const notion = new Client({ auth: process.env.NOTION_INTEGRATION_TOKEN });
const notionPageID = process.env.NOTION_PAGE_ID;

exports.getPage = async () => {
  const response = await notion.pages.retrieve({ page_id: notionPageID });

  return response;
}
