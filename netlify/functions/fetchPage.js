const axios = require('axios');

exports.handler = async function(event, context) {
  const { url } = event.queryStringParameters;

  if (!url) {
    return {
      statusCode: 400,
      body: 'Missing URL'
    };
  }

  try {
    const response = await axios.get(url);
    let html = response.data;

    // Inject <base href="..."> into the <head>
    const baseHref = `<base href="${url}">`;
    html = html.replace(/<head([^>]*)>/i, `<head$1>${baseHref}`);

    return {
      statusCode: 200,
      body: html,
      headers: {
        'Content-Type': 'text/html',
        'Access-Control-Allow-Origin': '*'
      }
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: 'Error fetching page: ' + err.message
    };
  }
};
