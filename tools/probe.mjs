// Sends one request to the running server and prints what came back.
// Usage:  node tools/probe.mjs [userId] [path]
//   node tools/probe.mjs dana            -> GET /api/galleries as dana
//   node tools/probe.mjs                 -> GET /api/galleries with NO X-User-Id header
//   node tools/probe.mjs noa /api/galleries
const [userId, path = '/api/galleries'] = process.argv.slice(2);
const headers = userId ? { 'X-User-Id': userId } : {};
try {
  const res = await fetch(`http://localhost:3000${path}`, { headers });
  const text = await res.text();
  let body = text;
  try { body = JSON.stringify(JSON.parse(text), null, 2); } catch {}
  console.log(`GET ${path}  as: ${userId ?? '(no X-User-Id header)'}`);
  console.log(`Status: ${res.status}`);
  console.log(body);
} catch (e) {
  console.log('Could not reach http://localhost:3000. Is the server running (npm start)?');
  process.exit(1);
}
