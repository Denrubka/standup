import http from 'node:http';
import fs from "node:fs/promises";

const PORT = 8080;

http
    .createServer(async (req, res) => {

        await fs.writeFile('clients.json', '[]');

        try {
            await fs.access('comedians.json');
            if(req.method === "GET" && req.url === "/comedians") {

                try {
                    const data = await fs.readFile('comedians.json', 'utf-8');
                    res.writeHead(200, {
                        "Content-Type": "text/json; charset=UTF-8",
                        "Access-Control-Allow-Origin": "*",
                    });
                    res.end(data);
                } catch(error) {
                    res.writeHead(500, {
                        "Content-Type": "text/plain; charset=UTF-8",
                    });
                    res.end(`Ошибка сервера ${error}`);
                }

            } else {
                res.writeHead(404, {
                    "Content-Type": "text/plain; charset=UTF-8",
                });
                res.end('Page not found');
            }
        } catch {
            res.writeHead(404, {
                "Content-Type": "text/plain; charset=UTF-8",
            });
            res.end('File not found');
        }
    })
    .listen(PORT);

console.log(`Сервер запущен по адресу http://localhost:${PORT}`);

