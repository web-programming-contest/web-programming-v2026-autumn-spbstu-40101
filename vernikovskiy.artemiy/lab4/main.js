import {Student} from './model.js';

const STORAGE_KEY = 'students';

function loadStudents() {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    return [];
  }
  try {
    const parsed = JSON.parse(data);
    return parsed.map(
      (item) => new Student(item.id, item.name, item.grades || {}),
    );
  } catch {
    return [];
  }
}

function saveStudents(students) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(
      students.map((s) => ({id: s.id, name: s.name, grades: s.grades})),
    ),
  );
}

const students = loadStudents();
const studentList = document.querySelector('[data-testid="entity-list"]');

function render() {
  studentList.innerHTML = '';
  students.forEach((student) => {
    const card = document.createElement('div');
    card.className = 'student-card';
    card.setAttribute('data-testid', 'entity-card');

    const info = document.createElement('div');
    info.innerHTML = `
      <p><strong>ID:</strong> ${student.id}</p>
      <p><strong>Имя:</strong> ${student.name}</p>
      <p><strong>Средний балл:</strong> ${Math.round(student.getAverageGrade() * 100) / 100}</p>
    `;

    const subjectsDiv = document.createElement('div');
    subjectsDiv.innerHTML = '<strong>Предметы:</strong>';
    Object.entries(student.grades).forEach(([subject, grade]) => {
      const row = document.createElement('div');
      row.className = 'subject-row';
      row.textContent = `${subject}: ${grade} `;
      const deleteGradeBtn = document.createElement('button');
      deleteGradeBtn.textContent = 'удалить';
      deleteGradeBtn.addEventListener('click', () => {
        deleteGrade(student.id, subject);
      });
      row.appendChild(deleteGradeBtn);
      subjectsDiv.appendChild(row);
    });

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Удалить студента';
    deleteBtn.setAttribute('data-testid', 'delete-entity');
    deleteBtn.addEventListener('click', () => {
      deleteStudent(student.id);
    });

    card.appendChild(info);
    card.appendChild(subjectsDiv);
    card.appendChild(deleteBtn);
    studentList.appendChild(card);
  });
}

async function addStudent(id, name) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (students.some((s) => s.id === id)) {
        reject(new Error('Студент с таким ID уже существует'));
      } else {
        const newStudent = new Student(id, name);
        students.push(newStudent);
        saveStudents(students);
        render();
        resolve(newStudent);
      }
    }, 100);
  });
}

async function deleteStudent(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = students.findIndex((s) => s.id === id);
      if (index === -1) {
        reject(new Error('Студент не найден'));
      } else {
        students.splice(index, 1);
        saveStudents(students);
        render();
        resolve();
      }
    }, 100);
  });
}

async function addGrade(studentId, subject, grade) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const student = students.find((s) => s.id === studentId);
      if (!student) {
        reject(new Error('Студент не найден'));
      } else {
        student.addGrade(subject, grade);
        saveStudents(students);
        render();
        resolve(student);
      }
    }, 100);
  });
}

async function deleteGrade(studentId, subject) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const student = students.find((s) => s.id === studentId);
      if (!student || !Object.hasOwn(student.grades, subject)) {
        reject(new Error('Оценка не найдена'));
      } else {
        delete student.grades[subject];
        saveStudents(students);
        render();
        resolve();
      }
    }, 100);
  });
}

document
  .getElementById('student-form')
  .addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = e.target;
    const id = parseInt(form.id.value, 10);
    const name = form.name.value.trim();
    try {
      await addStudent(id, name);
      form.reset();
    } catch (err) {
      alert(err.message);
    }
  });

document.getElementById('grade-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.target;
  const studentId = parseInt(form.studentId.value, 10);
  const subject = form.subject.value.trim();
  const grade = parseInt(form.grade.value, 10);
  try {
    await addGrade(studentId, subject, grade);
    form.reset();
  } catch (err) {
    alert(err.message);
  }
});

render();
