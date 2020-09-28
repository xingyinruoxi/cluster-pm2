const http = require("http");

const server = http.createServer((req, res) => {
    Math.random() > 0.5 ? aa() : "2";
    res.end("Hi,world!" + Math.random());
});

if (!module.parent) {
    server.listen(3000);
    console.log("app started at port 3000...");
} else {
    module.exports = server;
}