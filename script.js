// Cada tarea será:
// { text: string, completed: boolean }
const STORAGE_KEY = 'todo-v1'

const addTaskBtn = document.getElementById('add-task-btn')
const addTaskInput = document.getElementById('todo-input')
const todoList = document.querySelector('.ctn-list ul')

function saveTasks() {
    const tasks = []
    document.querySelectorAll('.ctn-list ul li').forEach( li => {
        const text = li.querySelector('.task-text')?.textContent ?? ''
        const completed = li.classList.contains('completed')
        tasks.push({ text, completed })
    })
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
    } catch (error) {
        console.log('Not possible to save in lcalStorage: ', error)
    }
}

function buildTaskItem(text, completed = false) {
  const li = document.createElement('li')

  const span = document.createElement('span')
  span.textContent = text
  span.classList.add('task-text')

  const actions = document.createElement('div')
  actions.classList.add('actions')

  const completeBtn = createCompleteBtn(li)
  const deleteBtn = createDeleteBtn(li)

  actions.append(completeBtn, deleteBtn)
  li.append(span, actions)

  if (completed) {
    li.classList.add('completed')
    completeBtn.textContent = 'Undo'
  }

  return li
}

function loadTasks() {
    let tasks = []

    try {
        tasks = JSON.parse(localStorage.getItem(STORAGE_KEY)) || []
    } catch (error) {
        tasks = []
    }

    tasks.forEach(t => {
        const li = buildTaskItem(t.text, t.completed)
        todoList.appendChild(li)
    })
}

function createCompleteBtn(li) {
    const completeBtn = document.createElement('button') // create button
    completeBtn.textContent = 'Done' // naming button
    completeBtn.classList.add('complete-btn') // giving class name to button

    completeBtn.addEventListener('click', () => { // when clicking button
        li.classList.toggle('completed')
        completeBtn.textContent = li.classList.contains('completed') ? 'Undo' : 'Done'

        const ul = li.parentElement

        if (li.classList.contains('completed')) {
            // si está completada, mover al final
            ul.appendChild(li)
        } else {
            // si no está completada, insertamos antes de la primera completada
            const firstCompleted = ul.querySelector('li.completed')
            if (firstCompleted) {
                ul.insertBefore(li, firstCompleted)
            } else {
                // no hay completadas, lo dejamos al final (última posición)
                ul.appendChild(li)
            }
        }

        saveTasks()
    })

    return completeBtn
}

function createDeleteBtn(li) {
    const deleteBtn = document.createElement('button')
    deleteBtn.textContent = 'Delete'
    deleteBtn.classList.add('delete-btn')

    deleteBtn.addEventListener('click', () => {
        li.remove()
        saveTasks()
    })

    return deleteBtn
}

addTaskBtn.addEventListener('click', () => { // Cick button Add Task
    const taskText = addTaskInput.value.trim()

    if (taskText !== '') {
        const li = buildTaskItem(taskText, false)
        todoList.appendChild(li)
        saveTasks()
        addTaskInput.value = ''
        addTaskInput.focus() // We give the focus to the task input
    }else{
        console.log('No task added')
    }
})

addTaskInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') addTaskBtn.click()
})

loadTasks()