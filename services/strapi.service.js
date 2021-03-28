const axios = require("axios");

module.exports = {
  getLabels: async function Labels(url) {
    return axios({
      url: url,
      method: "post",
      data: {
        query: `
            query {
              categories {
                name
                icon {
                  url
                }
              }
            }`,
      },
    }).then((res) => {
      return res.data.data.categories;
    });
  },

  getProjects: async function Projects(url) {
    return axios({
      url: url,
      method: "post",
      data: {
        query: `
          query {
            projects(sort: "created_at:desc", limit: 3) {
              permalink
              title
              subtitle
            }
          }
        `,
      },
    }).then((res) => {
      return res.data.data.projects;
    });
  },
};
