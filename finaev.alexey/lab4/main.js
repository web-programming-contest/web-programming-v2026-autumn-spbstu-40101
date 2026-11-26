import {User} from './model.js';

const STORAGE_KEY = 'lab4_users';
const listElement = document.querySelector('#entity-list');
const createForm = document.querySelector('#create-user-form');
const addFriendForm = document.querySelector('#add-friend-form');

let users = [];
function loadUsers() {
  const data = localStorage.getItem(STORAGE_KEY);
  if (data) {
    const parsed = JSON.parse(data);
    users = parsed.map((u) => {
      const user = new User(u.id, u.name);
      user.friends = u.friends;
      return user;
    });
  }
}

function saveUsers() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}

function asyncDelay(ms = 300) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function render() {
  listElement.innerHTML = '';

  users.forEach((user) => {
    const card = document.createElement('div');
    card.setAttribute('data-testid', 'entity-card');
    card.className = 'card';

    card.innerHTML = `
      <div class="card-info">
        <h2>${user.name} (ID: ${user.id})</h2>
        <p>Друзья: ${user.friends.length > 0 ? user.friends.join(', ') : 'нет'}</p>
      </div>
      <div class="card-actions">
        <button class="remove-friend" data-userid="${user.id}">Удалить друга</button>
        <button data-testid="delete-entity" class="delete-user" data-userid="${user.id}">Удалить пользователя</button>
      </div>
    `;

    card.querySelector('.delete-user').addEventListener('click', async (e) => {
      const idToDelete = Number(e.target.dataset.userid);
      e.target.disabled = true;

      await asyncDelay();

      users = users.filter((u) => u.id !== idToDelete);
      saveUsers();
      render();
    });

    card
      .querySelector('.remove-friend')
      .addEventListener('click', async (e) => {
        const userId = Number(e.target.dataset.userid);

        const friendIdStr = prompt(
          `Введите ID друга, которого хотите удалить у ${user.name}:`,
        );
        if (friendIdStr === null) {
          return;
        }
        const friendId = Number(friendIdStr);
        e.target.disabled = true;

        await asyncDelay();

        const targetUser = users.find((u) => u.id === userId);
        if (targetUser) {
          targetUser.removeFriend(friendId);
          saveUsers();
        }
        e.target.disabled = false;
        render();
      });

    listElement.appendChild(card);
  });
}

createForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(createForm);
  const id = Number(formData.get('id'));
  const name = formData.get('name');

  if (users.some((u) => u.id === id)) {
    alert('Пользователь с таким ID уже существует!');
    return;
  }

  const submitBtn = createForm.querySelector('button');
  submitBtn.disabled = true;

  await asyncDelay();

  const newUser = new User(id, name);
  users.push(newUser);
  saveUsers();

  submitBtn.disabled = false;
  createForm.reset();
  render();
});

addFriendForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(addFriendForm);
  const userId = Number(formData.get('userId'));
  const friendId = Number(formData.get('friendId'));

  const targetUser = users.find((u) => u.id === userId);

  if (!targetUser) {
    alert('Пользователь с таким ID не найден!');
    return;
  }

  const submitBtn = addFriendForm.querySelector('button');
  submitBtn.disabled = true;

  await asyncDelay();

  targetUser.addFriend(friendId);
  saveUsers();

  submitBtn.disabled = false;
  addFriendForm.reset();
  render();
});

loadUsers();
render();
