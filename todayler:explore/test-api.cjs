const https = require('https');

const options = {
  hostname: 'api.pexels.com',
  path: '/v1/search?query=baby',
  method: 'GET',
  headers: {
    'Authorization': 'MsiwySszmWhgL2eMAyPKAsdXZtuIlNG0JVAuGf0fyCthXxcpHJ2AcPUL'
  }
};

const req = https.request(options, res => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => console.log(data.slice(0, 100)));
});
req.end();
