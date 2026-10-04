export class Student {
  constructor(id, name, grades = {}) {
    this.id = id;
    this.name = name;
    this.grades = grades;
  }

  addGrade(subject, grade) {
    this.grades[subject] = grade;
  }

  getAverageGrade() {
    const grades = Object.values(this.grades);
    if (grades.length === 0) {
      return 0;
    }
    return grades.reduce((sum, grade) => sum + grade, 0) / grades.length;
  }

  get summary() {
    return `Студент ${this.name} (id: ${this.id}) — средний балл: ${this.getAverageGrade()}`;
  }
}

export function groupStudentsByAverageGrade(students) {
  const groups = new Map();
  students.forEach((student) => {
    const avg = student.getAverageGrade();
    if (!groups.has(avg)) {
      groups.set(avg, []);
    }
    groups.get(avg).push(student);
  });
  return groups;
}

export function getUniqueSubjects(students) {
  const subjects = new Set();
  students.forEach((student) => {
    Object.keys(student.grades).forEach((subject) => subjects.add(subject));
  });
  return [...subjects].sort();
}

export function groupStudentsBySubject(students) {
  const map = new Map();
  students.forEach((student) => {
    Object.keys(student.grades).forEach((subject) => {
      if (!map.has(subject)) {
        map.set(subject, []);
      }
      map.get(subject).push(student);
    });
  });
  return map;
}

export function getStudentsWithMaxAverageGrade(students) {
  if (students.length === 0) {
    return [];
  }
  const maxAvg = Math.max(...students.map((s) => s.getAverageGrade()));
  return students.filter((s) => s.getAverageGrade() === maxAvg);
}

export function getStudentsBySubject(students, subject) {
  return students.filter((s) => Object.hasOwn(s.grades, subject));
}
