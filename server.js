const http = require("http");
const fs = require("fs");
const db = require("./DatabaseMethods");
const qs = require("querystring");
const albums = [];
const formidable = require("formidable");

function readAlbums() {
    albums.length = 0;
    fs.readdir("static/media/", function (err, files) {
        if (err) {
            return console.log(err);
        }
        //
        files.forEach(element => {
            albums.push(element);
        });

    });
}

function niceBytes(x) {
    const units = ['bytes', 'KB', 'MB', 'GB', 'TB'];
    let l = 0, n = parseInt(x, 10) || 0;
    while (n >= 1024 && ++l) {
        n = n / 1024;
    }
    return (n.toFixed(n < 10 && l > 0 ? 1 : 0) + ' ' + units[l]);
}

function checkError404(req, res) {
    let uri = decodeURIComponent(req.url).split("/")[1];
    let exists = false;
    albums.forEach(element => {
        if (element === uri)
            exists = true;
    });
    if (uri === "icons")
        exists = true;
    if (!exists) {
        fs.readFile("./static/404.html/", function (error, data) {
            res.writeHead(404, {'Content-Type': 'text/html;'});
            res.write(data);
            res.end();
        });
    }
}

function servResponse(req, res) {
    if (req.url === "/first") {
        req.on("data", function (data) {
        });
        req.on("end", function () {
            let songs = [];
            fs.readdir("static/media/" + albums[0], function (err, files) {
                if (err) {
                    return console.log(err);
                }
                //
                files.forEach(element => {
                    let stats = fs.statSync("./static/media/" + albums[0] + "/" + element);
                    let size = niceBytes(stats.size);
                    if (element.split(".")[1] !== "jpg") {
                        songs.push({
                            name: element,
                            size: size
                        })
                    }
                });
                let finish = {albums, songs};
                res.end(JSON.stringify(finish));
            });
        });
    } else if (req.url === "/add_to_favourites") {
        let allData = "";
        req.on("data", function (data) {
            allData += data
        });
        req.on("end", function () {
            allData = qs.parse(allData);
            db.addRecord(req, res, allData);

        });
    } else if (req.url === "/show_favourites") {
        req.on("data", function (data) {
        });
        req.on("end", function () {
            db.selectRecords(req, res);
        });
    } else if (req.url === "/songs_upload") {
        let dir;

        function dirName() {
            let album_number = Math.random() * 100000 | 0;
            dir = "./static/media/album_" + album_number;
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir);
                form.uploadDir = dir
            } else {
                dirName()
            }
        }

        let form = new formidable.IncomingForm();
        form.keepExtensions = true;
        dirName();
        let data_to_send = [];
        form.on("file", function (fields, file) {
            let file_obj = {
                name: file.name,
                jpg: false,
                mp3: false,
            };
            if (file.path.split("\\")[3].split(".")[1] === "jpg") {
                file_obj.jpg = true;
                fs.rename(dir + "/" + file.path.split("\\")[3], dir + "/cover.jpg", function (err) {
                    if (err)
                        console.log(err);
                });
            } else {
                file_obj.mp3 = true;
                fs.rename(dir + "/" + file.path.split("\\")[3], dir + "/" + file.name, function (err) {
                    if (err)
                        console.log(err);
                });
            }
            data_to_send.push(file_obj);
        });
        form.parse(req, function (err, fields, files) {
            res.end(JSON.stringify(data_to_send));
        });
    } else {
        req.on("data", function (data) {
        });
        req.on("end", function () {
            let songs = [];
            fs.readdir("static/media" + decodeURIComponent(req.url), function (err, files) {
                if (err) {
                    return console.log(err);
                }
                //
                files.forEach(element => {
                    let stats = fs.statSync("./static/media" + decodeURIComponent(req.url) + "/" + element);
                    let size = niceBytes(stats.size);
                    if (element.split(".")[1] !== "jpg") {
                        songs.push({
                            name: element,
                            size: size
                        });
                    }
                });
                let finish = {songs};
                res.end(JSON.stringify(finish));
            });
        });
    }
}

const server = http.createServer(function (req, res) {
    switch (req.method) {
        case "GET":
            switch (req.url) {
                case "/":
                    readAlbums();
                    fs.readFile("./static/index.html", function (error, data) {
                        res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
                        res.write(data);
                        res.end();
                    });
                    break;
                case "/admin":
                    fs.readFile("./static/admin.html", function (error, data) {
                        res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
                        res.write(data);
                        res.end();
                    });
                    break;
                case "/style":
                    fs.readFile("./static/style.css", function (error, data) {
                        res.writeHead(200, {'Content-Type': 'text/css; charset=utf-8'});
                        res.write(data);
                        res.end();
                    });
                    break;
                case "/Main.js":
                    fs.readFile("./static/Main.js", function (error, data) {
                        res.writeHead(200, {'Content-Type': 'application/javascript;'});
                        res.write(data);
                        res.end();
                    });
                    break;
                case "/Net.js":
                    fs.readFile("./static/Net.js", function (error, data) {
                        res.writeHead(200, {'Content-Type': 'application/javascript;'});
                        res.write(data);
                        res.end();
                    });
                    break;
                case "/Music.js":
                    fs.readFile("./static/Music.js", function (error, data) {
                        res.writeHead(200, {'Content-Type': 'application/javascript;'});
                        res.write(data);
                        res.end();
                    });
                    break;
                case "/UI.js":
                    fs.readFile("./static/UI.js", function (error, data) {
                        res.writeHead(200, {'Content-Type': 'application/javascript;'});
                        res.write(data);
                        res.end();
                    });
                    break;
                case "/drag.js":
                    fs.readFile("./static/drag.js", function (error, data) {
                        res.writeHead(200, {'Content-Type': 'application/javascript;'});
                        res.write(data);
                        res.end();
                    });
                    break;
                default:
                    if (req.url.split("/")[1] === "icons") {
                        fs.readdir("./static/icons", function (err, files) {
                            if (err) {
                                return console.log(err);
                            }
                            files.forEach(element => {
                                if (req.url === "/icons/" + encodeURIComponent(element)) {
                                    fs.readFile("./static/icons/" + element, function (error, data) {
                                        res.writeHead(200, {'Content-Type': 'image/svg+xml;'});
                                        res.write(data);
                                        res.end();
                                    });
                                }
                            });
                        });
                    } else {
                        checkError404(req, res);
                        albums.forEach(element => {
                            fs.readdir("./static/media/" + element, function (err, files) {
                                if (err) {
                                    return console.log(err);
                                }
                                files.forEach(e => {
                                    if (req.url === "/" + encodeURIComponent(element) + "/" + encodeURIComponent(e)) {
                                        if (e === "cover.jpg") {
                                            fs.readFile("./static/media/" + element + "/" + e, function (error, data) {
                                                res.writeHead(200, {'Content-Type': 'image/jpeg;'});
                                                res.write(data);
                                                res.end();
                                            })
                                        } else {
                                            const path = "./static/media/" + element + "/" + e;
                                            const stat = fs.statSync(path);
                                            const fileSize = stat.size;
                                            const range = req.headers.range;
                                            if (range) {
                                                const parts = range.replace(/bytes=/, "").split("-");
                                                const start = parseInt(parts[0], 10);
                                                const end = parts[1]
                                                    ? parseInt(parts[1], 10)
                                                    : fileSize - 1;
                                                const chunksize = (end - start) + 1;
                                                const file = fs.createReadStream(path, {start, end});
                                                const head = {
                                                    'Content-Range': `bytes ${start}-${end}/${fileSize}`,
                                                    'Accept-Ranges': 'bytes',
                                                    'Content-Length': chunksize,
                                                    'Content-Type': 'audio/mpeg',
                                                };
                                                res.writeHead(206, head);
                                                file.pipe(res);
                                            } else {
                                                const head = {
                                                    'Content-Length': fileSize,
                                                    'Content-Type': 'audio/mpeg',
                                                };
                                                res.writeHead(200, head);
                                                fs.createReadStream(path).pipe(res)
                                            }
                                        }
                                    }
                                })
                            })
                        });
                    }

                    break;
            }
            break;
        case "POST":
            servResponse(req, res);
            break;

    }

}).listen(3000);

