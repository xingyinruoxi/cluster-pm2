const cluster = require("cluster");
const os = require("os");
const numCPUs = os.cpus().length; //获取CPU的数量
// console.log("numCPUS", numCPUS);
const process = require("process");
const workers = {};
if (cluster.isMaster) {
    // 主进程分支
    cluster.on("exit", (worker, code, signal) => {
        console.log(
            "工作进程 %d 关闭 (%s). 重启中...",
            worker.process.pid,
            signal || code
        );
        delete workers[worker.process.pid];
        worker = cluster.fork();
        workers[worker.process.pid] = worker;
    });
    for (var i = 0; i < numCPUs; i++) {
        var worker = cluster.fork();
        console.log("init ... pid", worker.process.pid);
        workers[worker.process.pid] = worker;
    }
} else {
    var app = require("./app");
    app.listen(3000);
}
// 当主进程被终⽌时，关闭所有⼯作进程
process.on("SIGTERM", function() {
    for (var pid in workers) {
        process.kill(pid);
    }
    process.exit(0);
});
require("./test");