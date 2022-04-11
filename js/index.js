const createPanelInput = document.querySelector(".create-panel__input")
const filterPanelRado = document.querySelectorAll(".filter-panel__radio")
const createButton = document.querySelector(".create-panel__btn")
const taskList = document.querySelector(".task-list")

const state = {
  tasks: [],
  filter: ''
}

createButton.addEventListener('click', onClickCreateButton)
taskList.addEventListener('click', onClickTaskList)



function onClickCreateButton(event) {
  event.preventDefault()

  // вот тут вставь проверку инпута чтобы говнозадачи не добовлялись
  const taskText = getValueAndClearInput(createPanelInput)

  createTaskArray(taskText)
  inputTasksOnTaskList()
  createPanelInput.focus()
}
const getTodoId = () => String(new Date().getTime())



function onClickTaskList(event) {
  const target = event.target
  if (target.classList.contains('task-list')) return

  if (target.className === 'task__checkbox') {
    completeTask(target.parentElement.id);
  }
  if (target.className === 'task__btn') {
    deleteTask(target.parentElement.id)
  }

  if (target.className === 'task__text') {
    target.addEventListener('dblclick', dblClickTaskText)
  }
}

function dblClickTaskText(event) {
  const target = event.target
  editTask(target.parentElement)

}
const deleteTask = (id) => {
  state.tasks = [...state.tasks.filter(task => task.id !== id)]
  inputTasksOnTaskList()
}

const getValueAndClearInput = (inputField) => {
  const value = inputField.value
  inputField.value = null
  return value
}
const createTaskArray = (text) =>
  state.tasks.push({ id: getTodoId(), completed: false, value: text })

const editTask = (target) => {
  castomMap(target.id, true)
  inputTasksOnTaskList()
}

const completeTask = (id) => {
  castomMap(id)
  inputTasksOnTaskList()
}


const inputTasksOnTaskList = () => {
  taskList.innerHTML = ''
  state.tasks.map(e => taskList.insertAdjacentHTML('beforeend',
    `<div class="task flex ${e.completed ? 'complete' : null}" completed="${e.completed}" id="${e.id}">
      <input class="task__checkbox" ${e.completed ? 'checked' : null} type="checkbox">
      <span class="task__text">${e.value}</span>
      <button class="task__btn" type="button">x</button>
    </div>`
  ))
}

const castomMap = (id, forEdit, newValue) => {

  state.tasks = [
    ...state.tasks.map(task => {

      if (task.id !== id) return task
      if (forEdit) return {
        ...task,
        value: "2"
      }
      return {
        ...task,
        completed: !task.completed
      }
    })
  ]
}

// поправь синтаксис едиттаска и дблклика