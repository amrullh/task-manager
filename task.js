const fs = require('fs/promises');
const path = require('path');

const tasksFilePath = path.join(__dirname, 'tasks.json');

async function readTasksFile() {
  try {
    const data = await fs.readFile(tasksFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      return [];
    }
    console.error('Error membaca file tasks:', error);
    throw error;
  }
}

async function writeTasksFile(tasks) {
  try {
    await fs.writeFile(tasksFilePath, JSON.stringify(tasks, null, 2), 'utf8');
  } catch (error) {
    console.error('Error menulis file tasks:', error);
    throw error;
  }
}

async function addTask(taskDescription) {
  const tasks = await readTasksFile();

  const newId = tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1;
  const newTask = {
    id: newId,
    description: taskDescription,
    completed: false
  };

  tasks.push(newTask);

  await writeTasksFile(tasks);

  console.log(`Tugas baru telah ditambahkan: "${taskDescription}" (ID: ${newId})`);
}

async function listTasks() {
  const tasks = await readTasksFile();

  if (tasks.length === 0) {
    console.log('Daftar tugas kosong.');
    return;
  }

  console.log('Daftar Tugas:');
  tasks.forEach(task => {
    const status = task.completed ? '[x]' : '[ ]';
    console.log(`${status} ${task.id}. ${task.description}`);
  });
}

async function completeTask(taskId) {
  const idToComplete = parseInt(taskId, 10);
  if (isNaN(idToComplete)) {
    console.error('Error: ID tugas harus berupa angka.');
    return;
  }

  const tasks = await readTasksFile();
  
  const taskIndex = tasks.findIndex(task => task.id === idToComplete);

  if (taskIndex === -1) {
    console.error(`Error: Tugas dengan ID ${idToComplete} tidak ditemukan.`);
    return;
  }

  tasks[taskIndex].completed = true;

  await writeTasksFile(tasks);

  console.log(`Tugas "${tasks[taskIndex].description}" (ID: ${idToComplete}) telah ditandai selesai.`);
}

async function deleteTask(taskId) {
  const idToDelete = parseInt(taskId, 10);
  if (isNaN(idToDelete)) {
    console.error('Error: ID tugas harus berupa angka.');
    return;
  }

  const tasks = await readTasksFile();

  const newTasks = tasks.filter(task => task.id !== idToDelete);

  if (tasks.length === newTasks.length) {
    console.error(`Error: Tugas dengan ID ${idToDelete} tidak ditemukan.`);
    return;
  }

  await writeTasksFile(newTasks);

  console.log(`Tugas dengan ID ${idToDelete} telah dihapus.`);
}

module.exports = {
  addTask,
  listTasks,
  completeTask,
  deleteTask
};