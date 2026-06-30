const sqlite3 = require('./node_modules/sqlite3');
const bcrypt = require('./node_modules/bcrypt');

const DB = './tp_final';
const ADMIN = { email: 'admin@test.com', password: 'Admin1234!', role: 'admin' };
const USER  = { email: 'user@test.com',  password: 'User1234!',  role: 'user'  };

async function run() {
  const db = new sqlite3.Database(DB);
  const query = (sql, params = []) => new Promise((res, rej) =>
    db.run(sql, params, function(err) { err ? rej(err) : res(this); })
  );
  const get = (sql, params = []) => new Promise((res, rej) =>
    db.get(sql, params, (err, row) => { err ? rej(err) : res(row); })
  );

  for (const u of [ADMIN, USER]) {
    const hash = await bcrypt.hash(u.password, 12);
    const existing = await get('SELECT id FROM users WHERE email = ?', [u.email]);
    if (existing) {
      await query(
        "UPDATE users SET passwordHash=?, role=?, isVerified=1, verificationToken=NULL WHERE email=?",
        [hash, u.role, u.email]
      );
      console.log(`✓ Actualizado: ${u.email} (${u.role})`);
    } else {
      const { randomUUID } = require('crypto');
      await query(
        "INSERT INTO users (id, email, passwordHash, role, isVerified, verificationToken, createdAt) VALUES (?,?,?,?,1,NULL,datetime('now'))",
        [randomUUID(), u.email, hash, u.role]
      );
      console.log(`✓ Creado: ${u.email} (${u.role})`);
    }
  }

  db.close();
  console.log('\nListo. Usuarios configurados:');
  console.log('  admin@test.com  /  Admin1234!  (admin, verificado)');
  console.log('  user@test.com   /  User1234!   (user,  verificado)');
}

run().catch(err => { console.error('Error:', err.message); process.exit(1); });
