const request = require('request-promise');

module.exports = async function command({ uri, body, method }) {
  const opts = {
    uri,
    method,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    resolveWithFullResponse: true,
  };

  if (body) {
    opts.body = JSON.stringify(body);
  }

  let response;
  let data;

  try {
    response = await request(opts);
    response = await response.toJSON();

    data = await JSON.parse(response.body).data;
  } catch (error) {
    console.error('request faield', error);
  }

  return { response, data };
};
