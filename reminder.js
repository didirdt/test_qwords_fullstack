#!/usr/bin/env node
import axios from 'axios';
import chalk from 'chalk';
import { DateTime } from 'luxon';

// ngecek token lebih dari 3 karakter
if (process.argv.length < 3) {
  console.error('Cara Penggunaan: node reminder.js <token>');
  process.exit(1);
}

const API_BASE_URL = 'http://localhost:8000/api'; 
const TOKEN = process.argv[2];
const TIMEZONE = 'Asia/Jakarta';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Authorization': `Bearer ${TOKEN}`,
    'Accept': 'application/json'
  }
});

async function fetchTasks() {
  try {
    const response = await api.get('/tasks/reminder');
    return response.data;
  } catch (error) {
    console.error(chalk.red('Gagal Diambil:'), error.message);
    if (error.response) {
      console.error('Response:', error.response.data);
    }
    process.exit(1);
  }
}

function displayReminders(tasks) {
  const tomorrow = DateTime.now().setZone(TIMEZONE).plus({ days: 1 }).toFormat('dd/MM/yyyy');
  
  console.log(chalk.bold(`\nTask Yang Harus Dilakukan Pada tanggal (${tomorrow}):`));
  
  if (tasks.length === 0) {
    console.log(chalk.grey('Tidak Ada Task.'));
    return;
  }

  tasks.forEach(task => {
    const deadline = DateTime.fromISO(task.tanggal_deadline)
      .setZone(TIMEZONE)
      .toFormat('dd/MM/yyyy HH:mm');
    
    if (task.butuh_perhatian) {
      console.log(
        chalk.bgRed.white.bold(' PERHATIAN ') + ' ' +
        chalk.red.bold(`${task.judul}`) +
        chalk.grey(` - Deadline: ${deadline}`)
      );
      console.log(chalk.grey(`Catatan: ${task.deskripsi}`));
    } else {
      console.log(
        chalk.bold(`${task.judul}`) +
        chalk.grey(` - Deadline: ${deadline}`)
      );
      console.log(chalk.grey(`Catatan: ${task.deskripsi}`));
    }
    console.log('');
  });
}

async function main() {
  try {
    const tasks = await fetchTasks();
    // console.log(tasks);

    displayReminders(tasks);
  } catch (error) {
    console.error(chalk.red('Error:'), error.message);
    process.exit(1);
  }
}

main();