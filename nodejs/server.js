// EM-NET · Node.js / Express
// Read-only demo API with hard-coded (dummy) school data.
// Run locally:  npm install && npm start

import express from "express";
import cors from "cors";

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(cors());
app.use(express.json());

const teachers = [
    { id: 1, name: "Ms. Rivera", subject: "Computer Science", email: "rivera@school.test", room: "A-12", years: 8 },
    { id: 2, name: "Mr. Okafor", subject: "Web Development", email: "okafor@school.test", room: "B-04", years: 5 },
    { id: 3, name: "Ms. Tanaka", subject: "Databases", email: "tanaka@school.test", room: "A-21", years: 11 },
    { id: 4, name: "Mr. Novak", subject: "Networking", email: "novak@school.test", room: "C-01", years: 6 },
    { id: 5, name: "Dr. Haddad", subject: "Cybersecurity", email: "haddad@school.test", room: "C-03", years: 14 },
];

const timetable = [
    { id: 1, day: "Monday", time: "08:00", course: "CS-101", teacher_id: 1, room: "A-12" },
    { id: 2, day: "Monday", time: "10:00", course: "NET-110", teacher_id: 4, room: "C-01" },
    { id: 3, day: "Tuesday", time: "09:00", course: "CS-204", teacher_id: 2, room: "B-04" },
    { id: 4, day: "Wednesday", time: "11:00", course: "DB-150", teacher_id: 3, room: "A-21" },
    { id: 5, day: "Thursday", time: "13:00", course: "SEC-220", teacher_id: 5, room: "C-03" },
    { id: 6, day: "Friday", time: "08:00", course: "CS-101", teacher_id: 1, room: "A-12" },
];

app.get("/", (_req, res) => {
    res.json({
        service: "EM-NET Teachers API",
        language: "Node.js / Express",
        version: "1.0.0",
        endpoints: ["/health", "/api/teachers", "/api/teachers/:id", "/api/timetable"],
    });
});

app.get("/health", (_req, res) => {
    res.json({ status: "ok", service: "nodejs-teachers-api", uptime: Math.round(process.uptime()) });
});

app.get("/api/teachers", (_req, res) => {
    res.json({ count: teachers.length, teachers });
});

app.get("/api/teachers/:id", (req, res) => {
    const id = Number(req.params.id);
    const teacher = teachers.find((t) => t.id === id);
    if (!teacher) {
        return res.status(404).json({ error: `Teacher ${req.params.id} was not found.` });
    }
    res.json(teacher);
});

app.get("/api/timetable", (_req, res) => {
    res.json({ count: timetable.length, timetable });
});

// Friendly JSON 404 instead of Express' default HTML page.
app.use((_req, res) => {
    res.status(404).json({ error: "Not found. Try GET /api/teachers or /api/timetable." });
});

const server = app.listen(PORT, () => {
    console.log(`EM-NET Teachers API listening on http://localhost:${PORT}`);
});

// Clean shutdown so `docker compose down` is quick.
for (const signal of ["SIGINT", "SIGTERM"]) {
    process.on(signal, () => server.close(() => process.exit(0)));
}
