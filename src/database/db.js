const Database = require('sqlite-async')

// Definição do banco de dados
function execute(db) {
  // criar as tabelas do banco de dados
  // criar relações entre as tabelas (com _id)
  return db.exec(`
    CREATE TABLE IF NOT EXISTS proffys (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        avatar TEXT,
        whatsapp TEXT,
        bio TEXT
    );
    CREATE TABLE IF NOT EXISTS classes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        subject INTEGER,
        cost TEXT,
        proffy_id INTEGER
    );
    CREATE TABLE IF NOT EXISTS class_schedule (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        class_id INTEGER,
        weekday INTEGER,
        time_from INTEGER,
        time_to INTEGER
    );
  `)
}

// Abrir a database e prepar para exportar
module.exports = Database.open(__dirname + '/database.sqlite').then(execute)