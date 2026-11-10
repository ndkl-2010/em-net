import { Component, computed, signal } from '@angular/core';

type Attendance = 'present' | 'late' | 'absent';

interface Student {
  id: number;
  name: string;
  grade: string;
  gpa: number;
  attendance: Attendance;
}

// Dummy data: no HTTP calls, no database, no secrets.
const STUDENTS: Student[] = [
  { id: 1, name: 'Ava Bennett', grade: '10-A', gpa: 3.8, attendance: 'present' },
  { id: 2, name: 'Liam Costa', grade: '10-A', gpa: 3.4, attendance: 'late' },
  { id: 3, name: 'Mia Fernandez', grade: '10-B', gpa: 3.9, attendance: 'present' },
  { id: 4, name: 'Noah Kim', grade: '11-A', gpa: 3.1, attendance: 'present' },
  { id: 5, name: 'Sofia Ivanova', grade: '11-B', gpa: 3.7, attendance: 'absent' },
  { id: 6, name: 'Ethan Mwangi', grade: '10-B', gpa: 2.9, attendance: 'present' },
];

@Component({
  selector: 'app-root',
  imports: [],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly query = signal('');
  protected readonly students = signal<Student[]>(STUDENTS);

  protected readonly filtered = computed(() => {
    const needle = this.query().trim().toLowerCase();
    if (!needle) return this.students();
    return this.students().filter((student) =>
      `${student.name} ${student.grade}`.toLowerCase().includes(needle)
    );
  });

  protected readonly averageGpa = computed(() => {
    const list = this.students();
    const sum = list.reduce((total, student) => total + student.gpa, 0);
    return (sum / list.length).toFixed(2);
  });

  protected readonly presentCount = computed(
    () => this.students().filter((student) => student.attendance !== 'absent').length
  );

  protected onSearch(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
  }
}
