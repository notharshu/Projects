const taskList = document.querySelector('.task-list');
const todoForm = document.querySelector('.todo-form');

todoForm.addEventListener('submit', function(event) {
  event.preventDefault();

  const taskInput = document.querySelector('#taskInput');
  const taskText = taskInput.value.trim();

  if (taskText !== '') {
    const taskItem = document.createElement('li');
    taskItem.className = 'task-item';
    taskItem.innerHTML = `
      <input type="text" class="form-control" value="${taskText}" readonly>
      <span>
        <button class="btn btn-sm btn-info edit-btn">
          <i class="fas fa-pencil-alt"></i>
        </button>
        <button class="btn btn-sm btn-danger delete-btn">
          <i class="far fa-trash-alt"></i>
        </button>
      </span>
    `;

    taskList.appendChild(taskItem);
    taskInput.value = '';
  }
});

function saveTaskListToFile() {
  const taskItems = document.querySelectorAll('.task-item');
  let taskListText = '';

  taskItems.forEach((taskItem) => {
    const taskText = taskItem.querySelector('input').value;
    taskListText += taskText + '\n';
  });

  const blob = new Blob([taskListText], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);

  const downloadLink = document.createElement('a');
  downloadLink.href = url;
  downloadLink.download = 'task_list.txt';
  downloadLink.click();

  URL.revokeObjectURL(url);
}

const saveButton = document.getElementById('saveButton');
saveButton.addEventListener('click', saveTaskListToFile);

taskList.addEventListener('click', function(event) {
  if (event.target.classList.contains('edit-btn')) {
    const taskInput = event.target.parentNode.parentNode.querySelector('input');
    const saveButton = document.createElement('button');
    saveButton.classList.add('btn', 'btn-sm', 'btn-success', 'save-btn');
    saveButton.innerHTML = '<i class="fas fa-save"></i>';

    taskInput.removeAttribute('readonly');
    taskInput.focus();

    event.target.parentNode.appendChild(saveButton);
    event.target.style.display = 'none';

    saveButton.addEventListener('click', function() {
      taskInput.setAttribute('readonly', 'readonly');
      event.target.parentNode.querySelector('.edit-btn').style.display = 'inline-block';
      saveButton.remove();
    });
  }

  if (event.target.classList.contains('delete-btn')) {
    const taskItem = event.target.parentNode.parentNode;
    taskItem.remove();
  }
});
