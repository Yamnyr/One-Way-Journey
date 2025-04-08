const db = require('./db');

const createTables = `
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  email VARCHAR(100),
  role ENUM('player', 'admin') DEFAULT 'player',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS scenarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(100),
  description TEXT,
  type ENUM('choice', 'destiny') NOT NULL,
  is_final BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS characters (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  name VARCHAR(50),
  species VARCHAR(50),
  life INT DEFAULT 100,
  charisma INT,
  dexterity INT,
  intelligence INT,
  luck INT,
  current_scenario_id INT,
  is_alive BOOLEAN DEFAULT TRUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (current_scenario_id) REFERENCES scenarios(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS choices (
  id INT AUTO_INCREMENT PRIMARY KEY,
  scenario_id INT,
  description TEXT,
  required_stat VARCHAR(50),
  required_value INT,
  result TEXT,
  next_scenario_id INT,
  effect_life INT DEFAULT 0,
  effect_charisma INT DEFAULT 0,
  effect_dexterity INT DEFAULT 0,
  effect_luck INT DEFAULT 0,
  is_game_over BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (scenario_id) REFERENCES scenarios(id) ON DELETE CASCADE,
  FOREIGN KEY (next_scenario_id) REFERENCES scenarios(id) ON DELETE SET NULL
);
`;

db.query(createTables, (err, result) => {
    if (err) {
        console.error('❌ Erreur lors de la création des tables :', err);
    } else {
        console.log('✅ Tables créées avec succès !');
    }
    db.end();
});
