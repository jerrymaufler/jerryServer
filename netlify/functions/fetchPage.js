const axios = require('axios');
// ok
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
    return {
      statusCode: 200,
      body: response.data,
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
