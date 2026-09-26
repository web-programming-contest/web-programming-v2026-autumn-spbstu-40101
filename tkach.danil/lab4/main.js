import {Student} from './model.js';

const STORAGE_KEY = 'lab4-students';

const entityForm = document.querySelector('[data-testid="entity-form"]');
const entityList = document.querySelector('[data-testid="entity-list"]');

let students = loadStudents();

function loadStudents() {
  const savedStudents = localStorage.getItem(STORAGE_KEY);

  if (savedStudents === null) {
    return [];
  }

  const parsedStudents = JSON.parse(savedStudents);

  return parsedStudents.map(
    (student) => new Student(student.id, student.name, student.grades),
  );
}

function saveStudents() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
}

function delay() {
  return new Promise((resolve) => {
    setTimeout(resolve, 300);
  });
}

async function addStudent(id, name) {
  await delay();

  const studentExists = students.some((student) => student.id === id);

  if (studentExists) {
    throw new Error('Студент с таким ID уже существует');
  }

  students.push(new Student(id, name));

  saveStudents();
  renderStudents();
}

async function deleteStudent(id) {
  await delay();

  students = students.filter((student) => student.id !== id);

  saveStudents();
  renderStudents();
}

async function addGrade(studentId, subject, grade) {
  await delay();

  const student = students.find((item) => item.id === studentId);

  if (student === undefined) {
    return;
  }

  student.addGrade(subject, grade);

  saveStudents();
  renderStudents();
}

async function deleteGrade(studentId, subject) {
  await delay();

  const student = students.find((item) => item.id === studentId);

  if (student === undefined) {
    return;
  }

  student.removeGrade(subject);

  saveStudents();
  renderStudents();
}

function createGradeList(student) {
  const list = document.createElement('ul');

  for (const [subject, grade] of Object.entries(student.grades)) {
    const item = document.createElement('li');
    item.className = 'grade-row';

    const text = document.createElement('span');
    text.textContent = `${subject}: ${grade}`;

    const deleteButton = document.createElement('button');
    deleteButton.type = 'button';
    deleteButton.textContent = 'Удалить оценку';

    deleteButton.addEventListener('click', async () => {
      await deleteGrade(student.id, subject);
    });

    item.append(text, deleteButton);
    list.append(item);
  }

  return list;
}

function createGradeForm(student) {
  const form = document.createElement('form');
  form.className = 'grade-form';

  const subjectLabel = document.createElement('label');
  subjectLabel.textContent = 'Предмет';

  const subjectInput = document.createElement('input');
  subjectInput.name = 'subject';
  subjectInput.required = true;

  subjectLabel.append(subjectInput);

  const gradeLabel = document.createElement('label');
  gradeLabel.textContent = 'Оценка';

  const gradeInput = document.createElement('input');
  gradeInput.name = 'grade';
  gradeInput.type = 'number';
  gradeInput.min = '2';
  gradeInput.max = '5';
  gradeInput.required = true;

  gradeLabel.append(gradeInput);

  const submitButton = document.createElement('button');
  submitButton.type = 'submit';
  submitButton.textContent = 'Добавить оценку';

  form.append(subjectLabel, gradeLabel, submitButton);

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const subject = subjectInput.value.trim();
    const grade = Number(gradeInput.value);

    if (subject === '') {
      return;
    }

    await addGrade(student.id, subject, grade);
  });

  return form;
}

function createStudentCard(student) {
  const card = document.createElement('article');
  card.className = 'student-card';
  card.dataset.testid = 'entity-card';

  const title = document.createElement('h3');
  title.textContent = student.name;

  const id = document.createElement('p');
  id.textContent = `ID: ${student.id}`;

  const average = document.createElement('p');
  average.textContent = `Средний балл: ${student.getAverageGrade()}`;

  const gradesTitle = document.createElement('h4');
  gradesTitle.textContent = 'Оценки';

  const grades = createGradeList(student);
  const gradeForm = createGradeForm(student);

  const deleteButton = document.createElement('button');
  deleteButton.type = 'button';
  deleteButton.className = 'delete-student';
  deleteButton.dataset.testid = 'delete-entity';
  deleteButton.textContent = 'Удалить студента';

  deleteButton.addEventListener('click', async () => {
    await deleteStudent(student.id);
  });

  card.append(title, id, average, gradesTitle, grades, gradeForm, deleteButton);

  return card;
}

function renderStudents() {
  entityList.replaceChildren();

  for (const student of students) {
    entityList.append(createStudentCard(student));
  }
}

entityForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const formData = new FormData(entityForm);

  const id = Number(formData.get('id'));
  const name = String(formData.get('name')).trim();

  if (name === '') {
    return;
  }

  try {
    await addStudent(id, name);
    entityForm.reset();
  } catch (error) {
    alert(error.message);
  }
});

renderStudents();
