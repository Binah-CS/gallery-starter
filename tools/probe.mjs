// Sends one request to the running server (npm start) and prints exactly what came back.
//
// Usage:  node tools/probe.mjs <user|-> [METHOD] [path] [json-body]
//   node tools/probe.mjs dana                                   GET /api/galleries as dana
//   node tools/probe.mjs -                                      GET /api/galleries with NO identity
//   node tools/probe.mjs dana POST /api/galleries "{\"name\":\"Rosen engagement\"}"
//   node tools/probe.mjs noa POST /api/galleries/1/publish
const [user = '-', method = 'GET', path = '/api/galleries', body] = process.argv.slice(2);
const headers = {};
if (user !== '-') headers['X-User-Id'] = user;
if (body !== undefined) headers['Content-Type'] = 'application/json';
try {
  const res = await fetch(`http://localhost:${process.env.PORT ?? 3000}${path}`, { method, headers, body });
  const text = await res.text();
  let shown = text;
  try { shown = JSON.stringify(JSON.parse(text), null, 2); } catch {}
  console.log(`${method} ${path}  as: ${user === '-' ? '(no identity)' : user}${body ? `  body: ${body}` : ''}`);
  console.log(`Status: ${res.status}`);
  console.log(shown);
} catch {
  console.log('Could not reach the server. Is it running (npm start)?');
  process.exit(1);
}
