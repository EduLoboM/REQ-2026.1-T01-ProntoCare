const fs = require('fs');
const path = require('path');
const pool = require('./src/db/index');

async function runMigrations() {
  try {
    console.log('Lendo migrations.sql...');
    const sqlPath = path.join(__dirname, 'src', 'db', 'migrations.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    console.log('Executando migrações no banco de dados...');
    await pool.query(sql);

    console.log('✅ Migrações aplicadas com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao aplicar migrações:', error);
  } finally {
    await pool.end();
  }
}

runMigrations();
