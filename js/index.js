(function app() {
  const createPanelInput = document.querySelector('.create-panel__input');
  const filterPanelRadio = document.querySelectorAll('.filter-panel__radio');
  const filterPanel = document.querySelector('.filter-panel');
  const controlPanel = document.querySelector('.control-panel');
  const createButton = document.querySelector('.create-panel__btn');
  const taskList = document.querySelector('.task-list');

  const getFilterStatus = () => Array.from(filterPanelRadio).find((e) => e.checked).id;

  const state = {
    tasks: [],
    filter: getFilterStatus(),
  };
  const getTodoId = () => String(new Date().getTime());

  const getValueAndClearInput = (inputField) => {
    const { value } = inputField;
    // eslint-disable-next-line no-param-reassign
    inputField.value = null;
    return value;
  };
  const createTaskArray = (text) => state.tasks.push({
    id: getTodoId(), completed: false, value: text,
  });

  const filterArr = (id) => {
    switch (id) {
      case 'completed':
        return state.tasks.filter((task) => task.completed);

      case 'active':
        return state.tasks.filter((task) => !task.completed);

      default:
        return state.tasks;
    }
  };

  const putTasksOnTaskList = () => {
    taskList.innerHTML = '';

    filterArr(state.filter).map((e) => taskList.insertAdjacentHTML(
      'beforeend',
      `<div class="task flex ${e.completed ? 'completed' : ''}" id="${e.id}">
        <input class="task__checkbox" ${e.completed ? 'checked' : ''} type="checkbox">
        <span class="task__text">${e.value}</span>
        <button class="task__btn" type="button">x</button>
      </div>`,
    ));
  };

  const modifyTask = (whatTodo, target, newValueForEdit) => {
    const { id } = target;

    state.tasks.forEach((item) => {
      const task = item;
      switch (whatTodo) {
        case 'editTask':
        case 'completedTask':
          if (task.id !== id) return task;
          if (newValueForEdit) {
            task.value = newValueForEdit;
            break;
          }
          task.completed = !task.completed;
          break;
        case 'completedAllTasks':
          task.completed = target.checked;
          break;
        default:
          break;
      }
      return null;
    });
  };

  const createInput = (taskText) => {
    const input = document.createElement('input');
    input.className = 'task__edit-input';
    input.value = taskText;
    return input;
  };

  const editTask = (target) => {
    const input = createInput(target.innerHTML);
    const task = target.parentElement;

    task.replaceChild(input, target);
    input.focus();

    const onBlurTaskInput = () => {
      modifyTask('editTask', task, input.value);
      putTasksOnTaskList();
    };

    const onKeyDownTaskInput = (event) => {
      if (event.keyCode === 13) {
        onBlurTaskInput();
      }
      if (event.keyCode === 27) {
        input.removeEventListener('blur', onBlurTaskInput);
        task.replaceChild(target, input);
      }
    };

    input.addEventListener('blur', onBlurTaskInput);
    input.addEventListener('keydown', onKeyDownTaskInput);
  };

  const completeTask = (target) => {
    modifyTask('completedTask', target);
    putTasksOnTaskList();
  };

  const deleteTask = (target) => {
    state.tasks = state.tasks.filter((task) => task.id !== target.id);
    putTasksOnTaskList();
  };

  const onClickCreateButton = (event) => {
    event.preventDefault();

    // вот тут вставь проверку инпута
    const taskText = getValueAndClearInput(createPanelInput);

    createTaskArray(taskText);
    putTasksOnTaskList();
    createPanelInput.focus();
  };

  const onClickTaskList = (event) => {
    const { target } = event;
    if (target.classList.contains('task-list')) return;

    if (target.className === 'task__checkbox') {
      completeTask(target.parentElement);
    }
    if (target.className === 'task__btn') {
      deleteTask(target.parentElement);
    }

    if (target.className === 'task__text' && event.detail === 2) {
      editTask(target);
    }
  };

  const onClickControlPanel = (event) => {
    const { target } = event;
    if (target.classList.contains('control-panel__checkbox')) {
      modifyTask('completedAllTasks', target);
      putTasksOnTaskList();
    }
    if (target.classList.contains('control-panel__delete-btn')) {
      state.tasks = filterArr('active');
      putTasksOnTaskList();
    }
  };

  const onClickFilterPanel = (event) => {
    state.filter = event.target.id;
    putTasksOnTaskList();
  };

  createButton.addEventListener('click', onClickCreateButton);
  taskList.addEventListener('click', onClickTaskList);
  controlPanel.addEventListener('click', onClickControlPanel);
  filterPanel.addEventListener('click', onClickFilterPanel);
}());
