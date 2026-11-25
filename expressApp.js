
import express from "express";

const app = express();

app.use(express.json());
let employees = [
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
function validateEmployee(employee) {
    return (
        employee.id !== undefined &&
        employee.name &&
        employee.employeeId &&
        employee.department &&
        employee.salary !== undefined
    );
}

app.get("/employees", (req, res) => {
    res.status(200).json(employees);
});
app.get("/employees/:id", (req, res) => {

    const id = Number(req.params.id);

    const employee = employees.find(emp => emp.id === id);

    if (!employee) {
        return res.status(404).json({
            message: "Employee not found"
        });
    }

    res.status(200).json(employee);
});

app.post("/employees", (req, res) => {

    const employee = req.body;

    if (!validateEmployee(employee)) {
        return res.status(400).json({
            message: "All employee fields are required"
        });
    }

    const exists = employees.find(
        emp => emp.id === Number(employee.id)
    );

    if (exists) {
        return res.status(400).json({
            message: "Employee ID already exists"
        });
    }

    employees.push(employee);

    res.status(201).json({
        message: "Employee added successfully",
        employee: employee
    });
});

app.put("/employees/:id", (req, res) => {

    const id = Number(req.params.id);

    const index = employees.findIndex(
        emp => emp.id === id
    );

    if (index === -1) {
        return res.status(404).json({
            message: "Employee not found"
        });
    }

    const updatedEmployee = {
        ...employees[index],
        ...req.body,
        id: id
    };

    if (!validateEmployee(updatedEmployee)) {
        return res.status(400).json({
            message: "Invalid employee data"
        });
    }

    employees[index] = updatedEmployee;

    res.status(200).json({
        message: "Employee updated successfully",
        employee: updatedEmployee
    });
});

app.delete("/employees/:id", (req, res) => {

    const id = Number(req.params.id);

    const index = employees.findIndex(
        emp => emp.id === id
    );

    if (index === -1) {
        return res.status(404).json({
            message: "Employee not found"
        });
    }

    const deletedEmployee = employees[index];

    employees.splice(index, 1);

    res.status(200).json({
        message: "Employee deleted successfully",
        employee: deletedEmployee
    });
});
app.use((req, res) => {
    res.status(404).json({
        message: "Route not found"
    });
});

app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400) {
        return res.status(400).json({
            message: "Invalid JSON data"
        });
    }

    res.status(500).json({
        message: "Internal Server Error"
    });
});

app.listen(4000, () => {
    console.log("Express Server running at http://localhost:4000");
});
