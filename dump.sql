CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    hash_password VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_banned BOOLEAN DEFAULT FALSE,
    banned_until TIMESTAMP NULL
);

CREATE TABLE players (
    player_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    hp INT NOT NULL DEFAULT 100,
    mp INT NOT NULL DEFAULT 100,
    atk INT NOT NULL DEFAULT 10,
    def INT NOT NULL DEFAULT 10,
    crit_chance FLOAT NOT NULL DEFAULT 0.05,
    move_speed FLOAT NOT NULL DEFAULT 1.0,
    atk_speed FLOAT NOT NULL DEFAULT 1.0,
    level INT NOT NULL DEFAULT 1,
    total_exp INT NOT NULL DEFAULT 0,
    main_weapon_id INT REFERENCES weapons(weapon_id),
    second_weapon_id INT REFERENCES weapons(weapon_id),
    armor_id INT REFERENCES armors(armor_id)
);

CREATE TABLE weapons (
    weapon_id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    type VARCHAR(20) CHECK (type IN ('Sword', 'Axe', 'Dagger', 'Shield', 'Spear', 'Club', 'Hammer')),
    damage INT NOT NULL
);

CREATE TABLE armors (
    armor_id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    type VARCHAR(20) CHECK (type IN ('Light Armor', 'Medium Armor', 'Heavy Armor')),
    defense INT NOT NULL
);

CREATE TABLE player_skills (
    player_id INT REFERENCES players(player_id) ON DELETE CASCADE,
    chop_lv INT NOT NULL DEFAULT 1,
    chop_exp INT NOT NULL DEFAULT 0,
    mining_lv INT NOT NULL DEFAULT 1,
    mining_exp INT NOT NULL DEFAULT 0,
    gathering_lv INT NOT NULL DEFAULT 1,
    gathering_exp INT NOT NULL DEFAULT 0,
    sword_lv INT NOT NULL DEFAULT 1,
    sword_exp INT NOT NULL DEFAULT 0,
    dagger_lv INT NOT NULL DEFAULT 1,
    dagger_exp INT NOT NULL DEFAULT 0,
    axe_lv INT NOT NULL DEFAULT 1,
    axe_exp INT NOT NULL DEFAULT 0,
    hammer_lv INT NOT NULL DEFAULT 1,
    hammer_exp INT NOT NULL DEFAULT 0,
    club_lv INT NOT NULL DEFAULT 1,
    club_exp INT NOT NULL DEFAULT 0,
    heavy_armor_lv INT NOT NULL DEFAULT 1,
    heavy_armor_exp INT NOT NULL DEFAULT 0,
    medium_armor_lv INT NOT NULL DEFAULT 1,
    medium_armor_exp INT NOT NULL DEFAULT 0,
    light_armor_lv INT NOT NULL DEFAULT 1,
    light_armor_exp INT NOT NULL DEFAULT 0,
    repairing_lv INT NOT NULL DEFAULT 1,
    repairing_exp INT NOT NULL DEFAULT 0,
    healing_lv INT NOT NULL DEFAULT 1,
    healing_exp INT NOT NULL DEFAULT 0,
    assassin_lv INT NOT NULL DEFAULT 1,
    assassin_exp INT NOT NULL DEFAULT 0,
    PRIMARY KEY (player_id)
);