import { useMemo, useState } from "react";

// Dummy data lives right here: no API, no database, no secrets.
const courses = [
  { id: 1, code: "CS-101", title: "Introduction to Programming", teacher: "Ms. Rivera", room: "A-12", credits: 4, enrolled: 28 },
  { id: 2, code: "CS-204", title: "Web Development Basics", teacher: "Mr. Okafor", room: "B-04", credits: 3, enrolled: 24 },
  { id: 3, code: "DB-150", title: "Databases for Beginners", teacher: "Ms. Tanaka", room: "A-21", credits: 3, enrolled: 19 },
  { id: 4, code: "NET-110", title: "Networks & The Internet", teacher: "Mr. Novak", room: "C-01", credits: 4, enrolled: 31 },
  { id: 5, code: "SEC-220", title: "Intro to Cybersecurity", teacher: "Dr. Haddad", room: "C-03", credits: 3, enrolled: 22 },
  { id: 6, code: "AI-230", title: "Friendly Introduction to AI", teacher: "Ms. Rivera", room: "A-12", credits: 3, enrolled: 26 },
];

export default function App() {
  const [query, setQuery] = useState("");

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return courses;
    return courses.filter((course) =>
      `${course.code} ${course.title} ${course.teacher} ${course.room}`
        .toLowerCase()
        .includes(needle)
    );
  }, [query]);

  return (
    <main className="page">
      <span className="badge">
        <span className="dot" /> React 19 · Vite · served by nginx
      </span>

      <h1>Course Catalog</h1>
      <p className="lead">
        A tiny single-page app built with React and Vite. Everything you see is
        dummy data stored in <code>src/App.jsx</code>, so the page works even
        without a backend.
      </p>

      <div className="toolbar">
        <input
          className="search"
          type="search"
          placeholder="Search code, title, teacher or room…"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          aria-label="Search courses"
        />
        <span className="count">
          {visible.length} of {courses.length} courses
        </span>
      </div>

      {visible.length === 0 ? (
        <p className="empty">No course matches “{query}”. Try “web” or “Ms. Tanaka”.</p>
      ) : (
        <section className="grid">
          {visible.map((course) => (
            <article className="card" key={course.id}>
              <div className="card-top">
                <span className="code">{course.code}</span>
                <span className="credits">{course.credits} credits</span>
              </div>
              <h2>{course.title}</h2>
              <p className="teacher">{course.teacher}</p>
              <div className="meta">
                <span>Room {course.room}</span>
                <span className="enrolled">{course.enrolled} enrolled</span>
              </div>
            </article>
          ))}
        </section>
      )}

      <footer>
        EM-NET school demo · React frontend container · exposed through a
        Cloudflare Tunnel. Data is fictional and resets on every reload.
      </footer>
    </main>
  );
}
