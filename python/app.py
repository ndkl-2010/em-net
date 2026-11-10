# EM-NET · Python / FastAPI
# Read-only demo API with hard-coded (dummy) school data.
# Run locally:  uvicorn app:app --reload --port 8000

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="EM-NET Students API",
    description="A tiny school demo API used in the EM-NET Cloudflare Tunnel lesson.",
    version="1.0.0",
)

# Dummy data: fine to allow browsers from any origin.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

STUDENTS = [
    {"id": 1, "first_name": "Ava", "last_name": "Bennett", "grade": "10-A", "email": "ava.bennett@school.test", "gpa": 3.8},
    {"id": 2, "first_name": "Liam", "last_name": "Costa", "grade": "10-A", "email": "liam.costa@school.test", "gpa": 3.4},
    {"id": 3, "first_name": "Mia", "last_name": "Fernandez", "grade": "10-B", "email": "mia.fernandez@school.test", "gpa": 3.9},
    {"id": 4, "first_name": "Noah", "last_name": "Kim", "grade": "11-A", "email": "noah.kim@school.test", "gpa": 3.1},
    {"id": 5, "first_name": "Sofia", "last_name": "Ivanova", "grade": "11-B", "email": "sofia.ivanova@school.test", "gpa": 3.7},
    {"id": 6, "first_name": "Ethan", "last_name": "Mwangi", "grade": "10-B", "email": "ethan.mwangi@school.test", "gpa": 2.9},
]

ATTENDANCE = [
    {"student_id": 1, "date": "2026-11-02", "status": "present"},
    {"student_id": 1, "date": "2026-11-03", "status": "present"},
    {"student_id": 2, "date": "2026-11-02", "status": "late"},
    {"student_id": 2, "date": "2026-11-03", "status": "present"},
    {"student_id": 3, "date": "2026-11-02", "status": "present"},
    {"student_id": 3, "date": "2026-11-03", "status": "absent"},
    {"student_id": 4, "date": "2026-11-02", "status": "present"},
    {"student_id": 4, "date": "2026-11-03", "status": "late"},
    {"student_id": 5, "date": "2026-11-02", "status": "present"},
    {"student_id": 5, "date": "2026-11-03", "status": "present"},
    {"student_id": 6, "date": "2026-11-02", "status": "absent"},
    {"student_id": 6, "date": "2026-11-03", "status": "present"},
]


@app.get("/")
def root():
    """Landing payload, handy when the tunnel URL is opened in a browser."""
    return {
        "service": "EM-NET Students API",
        "language": "Python / FastAPI",
        "version": "1.0.0",
        "endpoints": ["/health", "/api/students", "/api/students/{id}", "/api/attendance", "/docs"],
    }


@app.get("/health")
def health():
    return {"status": "ok", "service": "python-students-api"}


@app.get("/api/students")
def list_students():
    return {"count": len(STUDENTS), "students": STUDENTS}


@app.get("/api/students/{student_id}")
def get_student(student_id: int):
    for student in STUDENTS:
        if student["id"] == student_id:
            return student
    raise HTTPException(status_code=404, detail=f"Student {student_id} was not found.")


@app.get("/api/attendance")
def list_attendance():
    return {"count": len(ATTENDANCE), "attendance": ATTENDANCE}
