// 1. Jam & Greeting + Custom Name
function updateClock() {
  const now = new Date();
  const timeStr = now.toLocaleTimeString('id-ID');
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const dateStr = now.toLocaleDateString('id-ID', options);

  document.getElementById('clock').textContent = timeStr;
  document.getElementById('date-str').textContent = dateStr;

  const hours = now.getHours();
  let greeting = 'Selamat Pagi';
  if (hours >= 12 && hours < 15) greeting = 'Selamat Siang';
  else if (hours >= 15 && hours < 18) greeting = 'Selamat Sore';
  else if (hours >= 18 || hours < 4) greeting = 'Selamat Malam';

  const savedName = localStorage.getItem('dashboard_username') || '';
  document.getElementById('greeting-text').textContent = savedName ? `${greeting}, ${savedName}!` : greeting;
}
setInterval(updateClock, 1000);
updateClock();

const nameInput = document.getElementById('user-name-input');
nameInput.value = localStorage.getItem('dashboard_username') || '';
nameInput.addEventListener('input', (e) => {
  localStorage.setItem('dashboard_username', e.target.value.trim());
  updateClock();
});

// 2. Focus Timer
let timeLeft = 25 * 60;
let timerId = null;

function updateTimerDisplay() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  document.getElementById('timer-display').textContent = 
    `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

document.getElementById('btn-start').addEventListener('click', () => {
  if (timerId) return;
  timerId = setInterval(() => {
    if (timeLeft > 0) {
      timeLeft--;
      updateTimerDisplay();
    } else {
      clearInterval(timerId);
      timerId = null;
      alert('Waktu fokus selesai!');
    }
  }, 1000);
});

document.getElementById('btn-stop').addEventListener('click', () => {
  clearInterval(timerId);
  timerId = null;
});

document.getElementById('btn-reset').addEventListener('click', () => {
  clearInterval(timerId);
  timerId = null;
  timeLeft = 25 * 60;
  updateTimerDisplay();
});

// 3. To-Do List + Prevent Duplicates + LocalStorage
let todos = JSON.parse(localStorage.getItem('dashboard_todos')) || [];

function saveAndRenderTodos() {
  localStorage.setItem('dashboard_todos', JSON.stringify(todos));
  const todoList = document.getElementById('todo-list');
  todoList.innerHTML = '';

  todos.forEach((todo, index) => {
    const li = document.createElement('li');
    li.className = todo.completed ? 'done' : '';
    
    const span = document.createElement('span');
    span.textContent = todo.text;
    span.style.cursor = 'pointer';
    span.addEventListener('click', () => {
      todos[index].completed = !todos[index].completed;
      saveAndRenderTodos();
    });

    const delBtn = document.createElement('button');
    delBtn.textContent = 'Hapus';
    delBtn.style.marginLeft = '10px';
    delBtn.addEventListener('click', () => {
      todos.splice(index, 1);
      saveAndRenderTodos();
    });

    li.appendChild(span);
    li.appendChild(delBtn);
    todoList.appendChild(li);
  });
}

document.getElementById('todo-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const input = document.getElementById('todo-input');
  const text = input.value.trim();

  if (!text) return;

  const isDuplicate = todos.some(t => t.text.toLowerCase() === text.toLowerCase());
  if (isDuplicate) {
    alert('Tugas ini sudah ada di dalam daftar!');
    return;
  }

  todos.push({ text, completed: false });
  input.value = '';
  saveAndRenderTodos();
});
saveAndRenderTodos();

// 4. Dark/Light Mode Toggle
const btnTheme = document.getElementById('btn-theme');
const currentTheme = localStorage.getItem('dashboard_theme') || 'light';
document.documentElement.setAttribute('data-theme', currentTheme);
btnTheme.textContent = currentTheme === 'dark' ? '☀️ Mode Terang' : '🌙 Mode Gelap';

btnTheme.addEventListener('click', () => {
  const newTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('dashboard_theme', newTheme);
  btnTheme.textContent = newTheme === 'dark' ? '☀️ Mode Terang' : '🌙 Mode Gelap';
});