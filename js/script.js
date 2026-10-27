const form = document.getElementById('taskForm');
const input = document.getElementById('taskInput');
const priority = document.getElementById('priority');
const list = document.getElementById('taskList');
const empty = document.getElementById('empty');
const summary = document.getElementById('summary');
const filterButtons = document.querySelectorAll('.filter');

let tasks = [];
let filter = 'all';

// Load saved tasks from the browser
try { tasks = JSON.parse(localStorage.getItem('tasks')) || []; } catch (e) { tasks = []; }

function save() {
  try { localStorage.setItem('tasks', JSON.stringify(tasks)); } catch (e) {}
}

function render() {
  list.innerHTML = '';
  const shown = tasks.filter(t =>
    filter === 'all' || (filter === 'done' ? t.done : !t.done));

  shown.forEach(task => {
    const li = document.createElement('li');
    li.className = 'task' + (task.done ? ' done' : '');

    const box = document.createElement('input');
    box.type = 'checkbox';
    box.checked = task.done;
    box.setAttribute('aria-label', 'Mark "' + task.text + '" as done');
    box.addEventListener('change', () => { task.done = box.checked; save(); render(); });

    const text = document.createElement('span');
    text.className = 'text';
    text.textContent = task.text;           // textContent keeps user input safe

    const tag = document.createElement('span');
    tag.className = 'tag ' + task.priority;
    tag.textContent = task.priority;

    const del = document.createElement('button');
    del.className = 'del';
    del.textContent = '\u00d7';
    del.setAttribute('aria-label', 'Delete "' + task.text + '"');
    del.addEventListener('click', () => {
      tasks = tasks.filter(t => t.id !== task.id);
      save(); render();
    });

    li.append(box, text, tag, del);
    list.appendChild(li);
  });

  empty.hidden = shown.length > 0;
  const left = tasks.filter(t => !t.done).length;
  summary.textContent = tasks.length === 0
    ? 'No tasks yet'
    : left + ' of ' + tasks.length + ' tasks left';
}

form.addEventListener('submit', e => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) return;
  tasks.unshift({ id: Date.now(), text, priority: priority.value, done: false });
  input.value = '';
  save(); render();
});

filterButtons.forEach(btn => btn.addEventListener('click', () => {
  filter = btn.dataset.filter;
  filterButtons.forEach(b => b.classList.toggle('active', b === btn));
  render();
}));

document.getElementById('clearDone').addEventListener('click', () => {
  tasks = tasks.filter(t => !t.done);
  save(); render();
});

render();
