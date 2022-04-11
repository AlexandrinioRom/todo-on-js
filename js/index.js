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

  const inputTasksOnTaskList = () => {
    taskList.innerHTML = '';
    state.tasks.map((e) => taskList.insertAdjacentHTML(
      'beforeend',
      `<div class="task flex ${e.completed ? 'complete' : null}" completed="${e.completed}" id="${e.id}">
        <input class="task__checkbox" ${e.completed ? 'checked' : null} type="checkbox">
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

  const editTask = (id, newValue) => {
    customMap(id, newValue);
    inputTasksOnTaskList();
  };

  const completeTask = (id) => {
    customMap(id);
    inputTasksOnTaskList();
  };

  const deleteTask = (id) => {
    state.tasks = [...state.tasks.filter((task) => task.id !== id)];
    inputTasksOnTaskList();
  };

  const createInput = (taskValue, taskText) => {
    const input = document.createElement('input');
    input.className = 'task__edit-input';
    const onKeydown = (event) => {
      const { target } = event;
      if (event.keyCode === 13) {
        target.parentElement.replaceChild(taskText, input);
        input.blur();
      }
      if (event.keyCode === 27) {
        target.parentElement.replaceChild(taskText, input);
        input.blur();
      }
    };
    input.value = taskValue;
    input.addEventListener('keydown', onKeydown);
    return input;
  };

  const showInput = (target) => {
    const input = createInput(target.innerHTML, target);
    target.parentElement.replaceChild(input, target);
    input.focus();
  };

  const onClickCreateButton = (event) => {
    event.preventDefault();

    // вот тут вставь проверку инпута
    const taskText = getValueAndClearInput(createPanelInput);

    createTaskArray(taskText);
    inputTasksOnTaskList();
    createPanelInput.focus();
  };

  const onClickTaskList = (event) => {
    const { target } = event;
    if (target.classList.contains('task-list')) return;

    if (target.className === 'task__checkbox') {
      completeTask(target.parentElement.id);
    }
    if (target.className === 'task__btn') {
      deleteTask(target.parentElement.id);
    }

    if (target.className === 'task__text' && event.detail === 2) {
      showInput(target);
      // editTask(target.parentElement.id);
    }
  };

  createButton.addEventListener('click', onClickCreateButton);
  taskList.addEventListener('click', onClickTaskList);
}());
