// EM-NET · C# / ASP.NET Core minimal API
// A tiny read-only demo API with hard-coded (dummy) school data.
// Perfect for showing how one container gets exposed through Cloudflare Tunnel.

var builder = WebApplication.CreateBuilder(args);

// Allow any browser on the internet to call this demo API (fine for dummy data).
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
        policy.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod());
});

var app = builder.Build();
app.UseCors();

var courses = new List<Course>
{
    new(1, "CS-101", "Introduction to Programming", "Ms. Rivera", "Room A-12", 4, 28),
    new(2, "CS-204", "Web Development Basics", "Mr. Okafor", "Room B-04", 3, 24),
    new(3, "DB-150", "Databases for Beginners", "Ms. Tanaka", "Room A-21", 3, 19),
    new(4, "NET-110", "Networks & The Internet", "Mr. Novak", "Lab C-01", 4, 31),
    new(5, "SEC-220", "Intro to Cybersecurity", "Dr. Haddad", "Lab C-03", 3, 22)
};

var students = new List<Student>
{
    new(1, "Ava", "Bennett", "10-A", "ava.bennett@school.test", 3.8),
    new(2, "Liam", "Costa", "10-A", "liam.costa@school.test", 3.4),
    new(3, "Mia", "Fernandez", "10-B", "mia.fernandez@school.test", 3.9),
    new(4, "Noah", "Kim", "11-A", "noah.kim@school.test", 3.1),
    new(5, "Sofia", "Ivanova", "11-B", "sofia.ivanova@school.test", 3.7),
    new(6, "Ethan", "Mwangi", "10-B", "ethan.mwangi@school.test", 2.9)
};

// Simple landing payload so a browser hitting the tunnel root sees something useful.
app.MapGet("/", () => Results.Ok(new
{
    service = "EM-NET Courses API",
    language = "C# / ASP.NET Core (.NET 10)",
    version = "1.0.0",
    endpoints = new[] { "/health", "/api/courses", "/api/courses/{id}", "/api/students" }
}));

app.MapGet("/health", () => Results.Ok(new { status = "ok", service = "csharp-courses-api" }));

app.MapGet("/api/courses", () => Results.Ok(courses));

app.MapGet("/api/courses/{id:int}", (int id) =>
{
    var course = courses.FirstOrDefault(c => c.Id == id);
    return course is null
        ? Results.NotFound(new { error = $"Course {id} was not found." })
        : Results.Ok(course);
});

app.MapGet("/api/students", () => Results.Ok(students));

app.Run();

// Records keep the demo tiny: no database, no migrations, just data.
record Course(int Id, string Code, string Title, string Teacher, string Room, int Credits, int Enrolled);
record Student(int Id, string FirstName, string LastName, string Grade, string Email, double Gpa);
