const { addTask, listTasks, completeTask, deleteTask } = require('./tasks');

const [nodePath, scriptPath, command, ...args] = process.argv;

(async () => {
  try {
    switch (command) {
      case 'add':
        const taskDescription = args.join(' ');
        if (!taskDescription) {
          console.error('Error: Deskripsi tugas tidak boleh kosong.');
          console.log('Contoh: node index.js add "Mengerjakan tugas web"');
        } else {
          await addTask(taskDescription);
        }
        break;

      case 'list':
        await listTasks();
        break;

      case 'complete':
        const idToComplete = args[0];
        if (!idToComplete) {
          console.error('Error: Anda harus menyertakan ID tugas.');
          console.log('Contoh: node index.js complete 1');
        } else {
          await completeTask(idToComplete);
        }
        break;

      case 'delete':
        const idToDelete = args[0];
        if (!idToDelete) {
          console.error('Error: Anda harus menyertakan ID tugas.');
          console.log('Contoh: node index.js delete 1');
        } else {
          await deleteTask(idToDelete);
        }
        break;

      default:
        console.log('Perintah tidak dikenali.');
        console.log('Gunakan salah satu perintah berikut:');
        console.log('  node index.js add "deskripsi tugas"  (untuk menambah tugas)');
        console.log('  node index.js list                   (untuk melihat semua tugas)');
        console.log('  node index.js complete <ID>          (untuk menandai tugas selesai)');
        console.log('  node index.js delete <ID>            (untuk menghapus tugas)');
        break;
    }
  } catch (error) {
    console.error('Terjadi error yang tidak terduga:', error);
  }
})();