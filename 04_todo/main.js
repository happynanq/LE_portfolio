// ===== МОДЕЛЬ ДАННЫХ И ИХ СОХРАНЕНИЕ =====

// Ключ для хранения данных в localStorage (можно менять версию при изменении структуры данных)
const STORAGE_KEY = "todo_app_tasks_v1";

// Загружаем задачи из localStorage или создаем пустой массив, если ничего нет
// JSON.parse - преобразует строку из localStorage обратно в массив объектов
// || "[]" - если в localStorage ничего нет, используем пустой массив в формате JSON
let tasks = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");

// Текущий фильтр для отображения задач: "all", "active", "completed"
let filter = "all";

// ===== ПОЛУЧАЕМ ЭЛЕМЕНТЫ ИЗ HTML =====

// Поле ввода для новой задачи
const newTaskInput = document.getElementById("newTask");
// Кнопка добавления задачи
const addBtn = document.getElementById("addBtn");
// Список, куда будут добавляться задачи
const listEl = document.getElementById("list");
// Элемент для отображения количества оставшихся задач
const countEl = document.getElementById("count");
// Все кнопки фильтров (Все/Активные/Выполненные)
const filterBtns = document.querySelectorAll(".filter-btn[data-filter]");
// Кнопка очистки выполненных задач
const clearCompletedBtn = document.getElementById("clearCompleted");

// ===== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ =====

// Сохраняет задачи в localStorage
function save() {
  // JSON.stringify - преобразует массив tasks в строку для хранения
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

// Генерирует уникальный ID для каждой задачи
function uid() {
  // Используем текущее время и случайное число для создания уникального идентификатора
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

// ===== ОСНОВНЫЕ ДЕЙСТВИЯ С ЗАДАЧАМИ =====

// Добавляет новую задачу
function addTask(text) {
  // Создаем объект задачи с уникальным ID, текстом, статусом и временем создания
  const t = {
    id: uid(),
    text: text.trim(), // Убираем лишние пробелы
    done: false, // Изначально задача не выполнена
    created: Date.now(), // Время создания
  };

  // Если текст пустой после обрезки пробелов - не добавляем задачу
  if (!t.text) return;

  // Добавляем задачу в начало массива (unshift), чтобы новые задачи были сверху
  tasks.unshift(t);
  // Сохраняем в localStorage
  save();
  // Перерисовываем список
  render();
}

// Удаляет задачу по ID
function removeTask(id) {
  // filter создает новый массив без задачи с указанным ID
  tasks = tasks.filter((t) => t.id !== id);
  save();
  render();
}

// Переключает статус выполнения задачи
function toggleDone(id) {
  // map проходит по всем задачам и меняет только нужную
  tasks = tasks.map((t) =>
    // Если ID совпадает, создаем копию задачи с измененным статусом
    // { ...t, done: !t.done } - копируем все свойства и меняем done на противоположное
    t.id === id ? { ...t, done: !t.done } : t
  );
  save();
  render();
}

// Обновляет текст задачи
function updateText(id, newText) {
  tasks = tasks.map((t) => (t.id === id ? { ...t, text: newText } : t));
  save();
  render();
}

// Удаляет все выполненные задачи
function clearCompleted() {
  // Оставляем только те задачи, которые НЕ выполнены
  tasks = tasks.filter((t) => !t.done);
  save();
  render();
}

// ===== ОТОБРАЖЕНИЕ ИНТЕРФЕЙСА =====

function render() {
  // Фильтруем задачи в зависимости от выбранного фильтра
  const visible = tasks.filter((t) => {
    if (filter === "all") return true; // Показываем все
    if (filter === "active") return !t.done; // Только невыполненные
    if (filter === "completed") return t.done; // Только выполненные
  });

  // Очищаем список перед перерисовкой
  listEl.innerHTML = "";

  // Если задач нет - показываем сообщение
  if (visible.length === 0) {
    const p = document.createElement("div");
    p.style.padding = "18px";
    p.style.color = "var(--muted)";
    p.textContent = "Задач нет — добавь первую!";
    listEl.appendChild(p);
  } else {
    // Для каждой видимой задачи создаем элемент списка
    for (const t of visible) {
      const li = document.createElement("li");
      li.className = "task";

      // Создаем кнопку-чекбокс для отметки выполнения
      const cb = document.createElement("button");
      cb.className = "checkbox" + (t.done ? " checked" : "");
      cb.setAttribute("aria-pressed", String(t.done)); // Для доступности
      cb.title = t.done ? "Отметить как не выполнено" : "Отметить выполнено";
      cb.addEventListener("click", () => toggleDone(t.id));

      // Создаем поле с текстом задачи
      const span = document.createElement("div");
      span.className = "title" + (t.done ? " done" : "");
      span.tabIndex = 0; // Делаем элемент фокусируемым
      span.textContent = t.text;
      span.setAttribute("role", "textbox");

      // Редактирование по двойному клику или клавише Enter
      span.addEventListener("dblclick", () => startEdit(t.id, span));
      span.addEventListener("keydown", (e) => {
        if (e.key === "Enter") startEdit(t.id, span);
      });

      // Создаем контейнер для кнопок действий
      const actions = document.createElement("div");
      actions.className = "actions";

      // Кнопка редактирования
      const editBtn = document.createElement("button");
      editBtn.className = "icon-btn";
      editBtn.title = "Редактировать";
      editBtn.innerHTML = "✏️";
      editBtn.addEventListener("click", () => startEdit(t.id, span));

      // Кнопка удаления
      const delBtn = document.createElement("button");
      delBtn.className = "icon-btn";
      delBtn.title = "Удалить";
      delBtn.innerHTML = "🗑️";
      delBtn.addEventListener("click", () => removeTask(t.id));

      // Собираем все элементы вместе
      actions.appendChild(editBtn);
      actions.appendChild(delBtn);
      li.appendChild(cb);
      li.appendChild(span);
      li.appendChild(actions);
      listEl.appendChild(li);
    }
  }

  // Обновляем счетчик оставшихся задач
  const remaining = tasks.filter((t) => !t.done).length;
  // Правильно склоняем слово "задача"
  countEl.textContent = remaining + (remaining === 1 ? " задача" : " задач");

  // Обновляем стили кнопок фильтров (подсвечиваем активную)
  filterBtns.forEach((b) =>
    b.classList.toggle("active", b.dataset.filter === filter)
  );
}

// ===== РЕДАКТИРОВАНИЕ ЗАДАЧИ =====

function startEdit(id, titleEl) {
  // Сохраняем оригинальный текст на случай отмены
  const origText = titleEl.textContent;

  // Создаем поле ввода для редактирования
  const input = document.createElement("input");
  input.type = "text";
  input.value = origText;
  input.className = "";
  input.style.width = "100%";
  input.style.padding = "8px";
  input.style.borderRadius = "8px";

  // Заменяем текстовый элемент на поле ввода
  titleEl.replaceWith(input);
  input.focus();
  input.setSelectionRange(0, input.value.length); // Выделяем весь текст

  // Функция завершения редактирования
  function finish(saveChanges) {
    if (saveChanges) {
      // Сохраняем изменения или используем оригинальный текст, если новый пустой
      updateText(id, input.value.trim() || origText);
    }

    // Восстанавливаем текстовый элемент
    const span = document.createElement("div");
    span.className =
      "title" + (tasks.find((t) => t.id === id)?.done ? " done" : "");
    span.tabIndex = 0;
    // Используем актуальный текст задачи или оригинальный, если что-то пошло не так
    span.textContent = tasks.find((t) => t.id === id)?.text || origText;
    span.addEventListener("dblclick", () => startEdit(id, span));
    span.addEventListener("keydown", (e) => {
      if (e.key === "Enter") startEdit(id, span);
    });

    // Заменяем поле ввода обратно на текстовый элемент
    input.replaceWith(span);
  }

  // Обработчики событий для поля ввода
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") finish(true); // Enter - сохранить
    if (e.key === "Escape") finish(false); // Escape - отменить
  });
  input.addEventListener("blur", () => finish(true)); // При потере фокуса - сохранить
}

// ===== НАСТРОЙКА ОБРАБОТЧИКОВ СОБЫТИЙ =====

// Добавление задачи по клику на кнопку
addBtn.addEventListener("click", () => {
  addTask(newTaskInput.value);
  newTaskInput.value = ""; // Очищаем поле ввода
  newTaskInput.focus(); // Возвращаем фокус на поле ввода
});

// Добавление задачи по нажатию Enter
newTaskInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    addTask(newTaskInput.value);
    newTaskInput.value = "";
  }
});

// Обработчики для кнопок фильтров
filterBtns.forEach((b) =>
  b.addEventListener("click", () => {
    filter = b.dataset.filter; // Устанавливаем выбранный фильтр
    render(); // Перерисовываем список
  })
);

// Очистка выполненных задач
clearCompletedBtn.addEventListener("click", () => {
  clearCompleted();
});

// ===== ПЕРВОНАЧАЛЬНАЯ ЗАГРУЗКА =====
render(); // Отображаем задачи при загрузке страницы

// ===== ДЛЯ РАЗРАБОТКИ =====
// Делаем некоторые функции доступными в консоли браузера для отладки
window.__todo = {
  get tasks() {
    return tasks; // Позволяет посмотреть все задачи в консоли
  },
  render, // Позволяет принудительно перерисовать список
  save, // Позволяет принудительно сохранить
};
