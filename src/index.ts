import { v4 as uuidV4 } from 'uuid';

type Task = {
  id: string;
  title: string;
  createdAt: Date;
  completed: boolean;
};

const list = document.querySelector<HTMLUListElement>('#list');
const form = document.getElementById('new-task-form') as HTMLFormElement | null;
const input = document.querySelector<HTMLInputElement>('#new-task-title');

const tasks: Task[] = loadTasks();
tasks.forEach(addListItem);

form?.addEventListener('submit', (e: SubmitEvent) => {
  e.preventDefault();

  if (input!.value === '' || input!.value === null) return;

  const newTask: Task = {
    id: uuidV4(),
    title: input!.value,
    createdAt: new Date(),
    completed: false,
  };

  tasks.push(newTask);
  saveTasks();

  addListItem(newTask);
  input!.value = '';
});

function addListItem(task: Task) {
  const item = document.createElement('li');
  const deleteBtn = document.createElement('button');
  const label = document.createElement('label');
  const checkbox = document.createElement('input');
  const text = document.createElement('span');

  checkbox.type = 'checkbox';
  checkbox.checked = task.completed;
  checkbox.addEventListener('change', () => {
    task.completed = checkbox.checked;
    saveTasks();
  });

  deleteBtn.classList.add('delete-btn');
  deleteBtn.textContent = '✗';

  deleteBtn.addEventListener('click', (e: MouseEvent) => {
    const target = e.target as Element;
    const parent = target.closest('li');
    const { id } = task;
    parent!.remove();

    const toDeleteIndex = tasks.findIndex((item) => item.id === id);

    if (toDeleteIndex !== -1) {
      tasks.splice(toDeleteIndex, 1);
      saveTasks();
    }
  });

  text.append(task.title);
  label.append(checkbox, text);
  item.append(label, deleteBtn);
  list?.append(item);
}

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks(): Task[] {
  const res = localStorage.getItem('tasks');
  if (res === null) return [];
  return JSON.parse(res);
}
