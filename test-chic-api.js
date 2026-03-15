const fs = require('fs');
const key = 'CHIC_8cnupliKkaGGYsxm2JCGAnlwRG5ivy9n';
const urls = [
  'https://chic-affiliate.com/api/product',
  'https://chic-affiliate.com/api/get-products',
  'https://chic-affiliate.com/api/v1/product',
  'https://chic-affiliate.com/api/v1/get-products',
  'https://chic-affiliate.com/api/affiliates/products',
  'https://chic-affiliate.com/api/products/list',
  'https://chic-affiliate.com/api/store/products',
  'https://chic-affiliate.com/api/catalog',
  'https://chic-affiliate.com/api/items'
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
  fs.writeFileSync('chic-api-log2.txt', log);
}
test().catch(console.error);
