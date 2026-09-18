const http = require("http");
const fs = require("fs");
const path = require("path");
const root = __dirname;
const types = {".html":"text/html; charset=utf-8",".css":"text/css; charset=utf-8",".js":"application/javascript; charset=utf-8",".png":"image/png",".jpg":"image/jpeg",".jpeg":"image/jpeg",".svg":"image/svg+xml"};
http.createServer((req,res)=>{
  let pathname;
  try { pathname = decodeURIComponent(new URL(req.url, "http://localhost").pathname); }
  catch { res.writeHead(400); return res.end("Bad request"); }
  let rel = pathname === "/" ? "index.html" : pathname.replace(/^\/+/, "");
  let file = path.resolve(root, rel);
  if (!file.startsWith(path.resolve(root) + path.sep) && file !== path.resolve(root,"index.html")) { res.writeHead(403); return res.end("Forbidden"); }
  fs.stat(file,(err,st)=>{
    if(err || !st.isFile()){ res.writeHead(404,{"Content-Type":"text/plain; charset=utf-8"}); return res.end("No encontrado"); }
    res.writeHead(200,{"Content-Type":types[path.extname(file).toLowerCase()]||"application/octet-stream","Cache-Control":"no-cache"});
    fs.createReadStream(file).pipe(res);
  });
}).listen(process.env.PORT || 3000, "0.0.0.0");