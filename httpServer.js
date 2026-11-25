
import http from "http";
import fs from "fs";

const employees = [
    {
        id: 1,
        name: "Rahul Sharma",
        employeeId: "EMP101",
        department: "IT",
        salary: 45000
    },
    {
        id: 2,
        name: "Priya Singh",
        employeeId: "EMP102",
        department: "HR",
        salary: 35000
    },
    {
        id: 3,
        name: "Aman Verma",
        employeeId: "EMP103",
        department: "Sales",
        salary: 40000
    }
];

const server = http.createServer((req, res) => {

    const url = req.url;
    const method = req.method;

    // GET /
    if (url === "/" && method === "GET") {

        fs.readFile("index.html", "utf8", (err, data) => {
            if (err) {
                res.writeHead(500, {
                    "Content-Type": "text/plain"
                });
                res.end("Error reading HTML file");
                return;
            }

            res.writeHead(200, {
                "Content-Type": "text/html"
            });

            res.end(data);
        });

    }

    else if (url === "/employees" && method === "GET") {

        res.writeHead(200, {
            "Content-Type": "application/json"
        });

        res.end(JSON.stringify(employees));

    }

    else if (url === "/add-employee" && method === "POST") {

        let body = "";

        req.on("data", chunk => {
            body += chunk;
        });

        req.on("end", () => {

            try {
                const employee = JSON.parse(body);

                const requiredFields = [
                    "id",
                    "name",
                    "employeeId",
                    "department",
                    "salary"
                ];

                const valid = requiredFields.every(field =>
                    employee[field] !== undefined &&
                    employee[field] !== null &&
                    employee[field] !== ""
                );

                if (!valid) {
                    res.writeHead(400, {
                        "Content-Type": "application/json"
                    });

                    res.end(JSON.stringify({
                        message: "All fields are required"
                    }));

                    return;
                }

                employees.push(employee);

                res.writeHead(201, {
                    "Content-Type": "application/json"
                });

                res.end(JSON.stringify({
                    message: "Employee added successfully",
                    employee: employee
                }));

            } catch (error) {

                res.writeHead(400, {
                    "Content-Type": "application/json"
                });

                res.end(JSON.stringify({
                    message: "Invalid JSON data"
                }));
            }
        });

    }

    else if (url === "/about" && method === "GET") {

        res.writeHead(200, {
            "Content-Type": "text/html"
        });

        res.end("<h1>Employee Management Application</h1>");

    }

    else {

        res.writeHead(404, {
            "Content-Type": "text/plain"
        });

        res.end("404 - Route Not Found");
    }

});

server.listen(3000, () => {
    console.log("HTTP Server running at http://localhost:3000");
});
