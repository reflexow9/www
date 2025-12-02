import jsonfile from "jsonfile";
import moment from "moment";
import simpleGit from "simple-git";

const path = "./data.json";
const git = simpleGit();

const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// 1. ГОЛОВНА ФУНКЦІЯ ДЛЯ ЗАПОВНЕННЯ МИНУЛОГО (від кінця 2025 до сьогодні)
const fillHistory = async () => {
  // Початок: 1 грудня 2025 року. Кінець: сьогоднішній день.
  let startDate = moment("2025-12-01");
  const endDate = moment(); 

  console.log("Починаємо заповнення історії комітів...");

  while (startDate.isBefore(endDate) || startDate.isSame(endDate, "day")) {
    // Генеруємо випадкову кількість комітів для ЦЬОГО дня (0 — пустий день, 5 — темно-зелений)
    const commitsCountForDay = getRandomInt(0, 5); 

    for (let i = 0; i < commitsCountForDay; i++) {
      // Додаємо випадкові години та хвилини, щоб коміти виглядали природно протягом дня
      const exactDate = startDate.clone()
        .hour(getRandomInt(9, 21))
        .minute(getRandomInt(0, 59))
        .format();

      const data = { date: exactDate };
      jsonfile.writeFileSync(path, data);

      await git.add([path]);
      await git.commit(`Code optimization: ${exactDate}`, { "--date": exactDate });
      console.log(`[ІСТОРІЯ] Створено коміт №${i + 1} за дату: ${exactDate}`);
    }

    startDate.add(1, "d"); // Переходимо до наступного дня
  }

  console.log("Історію створено локально! Відправляємо на GitHub...");
  await git.push();
  console.log("Усі коміти успішно завантажено!");
};

// 2. ФУНКЦІЯ ДЛЯ ЩОДЕННОГО ЗАПУСКУ (Робить випадкову кількість комітів ЗА СЬОГОДНІ)
const doDailyCommits = async () => {
  const commitsCount = getRandomInt(1, 4); // Щодня від 1 до 4 комітів
  const today = moment().format();

  console.log(`[ЩОДЕННИЙ ЗАПУСК] Починаємо створення ${commitsCount} комітів за сьогодні.`);

  for (let i = 0; i < commitsCount; i++) {
    const data = { date: today, updateId: getRandomInt(1000, 9999) };
    jsonfile.writeFileSync(path, data);

    await git.add([path]);
    await git.commit(`Daily routine update`, { "--date": today });
  }

  await git.push();
  console.log("[ЩОДЕННИЙ ЗАПУСК] Успішно запушено на GitHub!");
};

// --- УПРАВЛІННЯ ЗАПУСКОМ ---
// РЕЖИМ 1: Якщо вам треба ОДИН РАЗ заповнити історію з 2025 року, розкоментуйте рядок нижче:
await fillHistory();

// РЕЖИМ 2: Коли історія вже готова, закоментуйте рядок `await fillHistory()` 
// і розкоментуйте рядок нижче для щоденного використання:
// await doDailyCommits();
