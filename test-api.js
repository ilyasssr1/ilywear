const fs = require('fs');
const key = 'BOUT_qSnliOWKqflJWvzMQSrItXMxT3oeBkmv';
const urls = [
  'https://bouaitafaffiliate.com/api/products',
  'https://bouaitafaffiliate.com/api/v1/products',
  'https://bouaitafaffiliate.com/api/affiliate/products',
  'https://bouaitafaffiliate.com/api/affiliate/products/all',
  'https://bouaitafaffiliate.com/api/user/products'
];

async function test() {
  let log = '';
  for (const url of urls) {
    log += `Testing ${url}...\n`;
    try {
      const res = await fetch(url, { 
        headers: { 
          'Authorization': `Bearer ${key}`,
          'Accept': 'application/json'
        } 
      });
      log += `Status: ${res.status}\n`;
      const text = await res.text();
      log += `Is JSON: ${text.startsWith('{') || text.startsWith('[')}\n`;
      log += `Snippet: ${text.substring(0, 100)}\n\n`;
    } catch(e) {
      log += `Error: ${e.message}\n\n`;
    }
  }
  fs.writeFileSync('api-log.txt', log);
}
test().catch(console.error);
