// Cada tarea será:
// { text: string, completed: boolean }
const STORAGE_KEY = 'todo-v1'

const addTaskBtn = document.getElementById('add-task-btn')
const addTaskInput = document.getElementById('todo-input')
const todoList = document.querySelector('.ctn-list ul')
let dateSelected = null

// Calendar
function formatDate(date){
    if (!date) return null

    const [year, month, day] = date.split('-')
    return `${day}/${month}/${year}`    
}
const showCalendar = document.getElementById('show-calendar')
const today = new Date().toISOString().split("T")[0];
showCalendar.setAttribute("min", today)

showCalendar.addEventListener("change", () => {
    dateSelected = showCalendar.value
})

function saveTasks() {
    const tasks = []
    document.querySelectorAll('.ctn-list ul li').forEach( li => {
        const text = li.querySelector('.task-text')?.textContent ?? ''
        const date = li.getAttribute('data-date')
        const completed = li.classList.contains('completed')
        tasks.push({ text, date, completed })
    })
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
    } catch (error) {
        console.log('Not possible to save in localStorage: ', error)
    }
}

function buildTaskItem(text, date, completed = false) {
    const li = document.createElement('li')
    li.classList.add('task-enter')
    li.setAttribute('data-date', date || '')

    //showing TEXT of task
    const span = document.createElement('span')
    span.textContent = text
    span.classList.add('task-text')

    // Showing Date of task
    const spanDate = document.createElement('span')
    if (date) {
        spanDate.textContent = `Deadline: ${formatDate(date)}`
    }else{
        spanDate.textContent = "No deadline"
    }

    spanDate.classList.add('date-text')
    // Checking if task if late or not
    const todayDate = today

    if (date) {
        const diffDays = (new Date(date) - new Date(todayDate)) / (1000 * 60 * 60 * 24)

        if (todayDate > date || diffDays <= 3) { // If the day has passed the deadline
            spanDate.classList.add('late')
        }else if (todayDate < date && diffDays <= 7) {
            spanDate.classList.add('soon')
        }else{
            spanDate.classList.add('ontime')
        }
    }
    

    const actions = document.createElement('div')
    actions.classList.add('actions')

    const completeBtn = createCompleteBtn(li)
    const deleteBtn = createDeleteBtn(li)

    actions.append(spanDate, completeBtn, deleteBtn)
    li.append(span, actions)

    if (completed) {
    li.classList.add('completed')
    completeBtn.textContent = 'Undo'
    }

    // We execute the animation
    requestAnimationFrame(() => {
    li.classList.add('task-enter-active')
    li.classList.remove('task-enter')
    })

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
        const li = buildTaskItem(t.text, t.date, t.completed)
        todoList.appendChild(li)
    })
}

function createCompleteBtn(li) {
    const completeBtn = document.createElement('button') // create button
    completeBtn.setAttribute('aria-label', 'Mark task as completed')
    completeBtn.textContent = 'Done' // naming button
    completeBtn.classList.add('complete-btn') // giving class name to button

    completeBtn.addEventListener('click', () => { // when clicking button
        li.classList.toggle('completed')
        completeBtn.textContent = li.classList.contains('completed') ? 'Undo' : 'Done'
        completeBtn.setAttribute('aria-pressed', li.classList.contains('completed') ? 'true' : 'false')

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
    deleteBtn.setAttribute('aria-label', 'Delete task')
    deleteBtn.textContent = 'Delete'
    deleteBtn.classList.add('delete-btn')

    deleteBtn.addEventListener('click', () => {
        li.classList.add('task-exit')
        
        li.addEventListener('transitionend', () => {
            li.remove()
            saveTasks()
        }, {once: true})
    })

    return deleteBtn
}

addTaskInput.addEventListener('input', () => {
    addTaskBtn.disabled = addTaskInput.value.trim() === ''
})

addTaskBtn.addEventListener('click', () => { // Cick button Add Task
    const taskText = addTaskInput.value.trim()

    if (taskText !== '') {
        const li = buildTaskItem(taskText, dateSelected, false)
        todoList.appendChild(li)
        saveTasks()
        addTaskInput.value = ''
        addTaskInput.focus() // We give the focus to the task input
    }
})

addTaskInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') addTaskBtn.click()
})

loadTasks()