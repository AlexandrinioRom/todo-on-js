// eslint-disable-next-line func-names
(function () {
  const createPanelInput = document.querySelector('.create-panel__input');
  // const filterPanelRado = document.querySelectorAll('.filter-panel__radio');
  const createButton = document.querySelector('.create-panel__btn');
  const taskList = document.querySelector('.task-list');

  const state = {
    tasks: [],
    filter: '',
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

  const putTasksOnTaskList = () => {
    taskList.innerHTML = '';
    state.tasks.map((e) => taskList.insertAdjacentHTML(
      'beforeend',
      `<div class="task flex ${e.completed ? 'complete' : ''}" id="${e.id}">
        <input class="task__checkbox" ${e.completed ? 'checked' : ''} type="checkbox">
        <span class="task__text">${e.value}</span>
        <button class="task__btn" type="button">x</button>
      </div>`,
    ));
  };

  const customMap = (id, newValueForEdit) => {
    state.tasks = [
      ...state.tasks.map((task) => {
        if (task.id !== id) return task;
        if (newValueForEdit) {
          return {
            ...task,
            value: newValueForEdit,
          };
        }
        return {
          ...task,
          completed: !task.completed,
        };
      }),
    ];
  };

  const createInput = (taskText) => {
    const input = document.createElement('input');
    input.className = 'task__edit-input';
    input.value = taskText;
    return input;
  };

  const editTask = (target) => {
    const input = createInput(target.innerHTML, target);
    const task = target.parentElement;
    task.replaceChild(input, target);
    input.focus();
    const onBlurTaskInput = () => {
      customMap(task.id, input.value);
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

  const completeTask = (id) => {
    customMap(id);
    putTasksOnTaskList();
  };

  const deleteTask = (id) => {
    state.tasks = [...state.tasks.filter((task) => task.id !== id)];
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
    const taskId = target.parentElement.id;
    if (target.classList.contains('task-list')) return;

    if (target.className === 'task__checkbox') {
      completeTask(taskId);
    }
    if (target.className === 'task__btn') {
      deleteTask(taskId);
    }

    if (target.className === 'task__text' && event.detail === 2) {
      editTask(target);
    }
  };

  createButton.addEventListener('click', onClickCreateButton);
  taskList.addEventListener('click', onClickTaskList);
}());
