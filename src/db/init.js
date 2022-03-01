const database = require('./config')

const initDb = {
    async init(){
        
    const db = await database()

    await db.exec(`CREATE TABLE profile (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        avatar TEXT,
        monthly_budget INT,
        days_per_week INT,
        hours_per_day INT,
        vacation_per_year INT,
        hour_value INT
    )`);

    await db.exec(`CREATE TABLE jobs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        daily_hours INT,
        total_hours INT,
        created_at DATETIME
    )`);

    await db.run(`INSERT INTO profile (
        name,
        avatar,
        monthly_budget,
        days_per_week,
        hours_per_day,
        vacation_per_year,
        hour_value
    ) VALUES (
        "Nycolas",
        "https://github.com/nycodev.png",
        2500,
        5,
        6,
        5,
        75
    );`)

    await db.run(`INSERT INTO jobs (
        name,
        daily_hours,
        total_hours,
        created_at
    ) VALUES (
        "Pizzaria Guloso",
        2,
        1,
        1637266890525    
    );`)


    await db.run(`INSERT INTO jobs (
        name,
        daily_hours,
        total_hours,
        created_at
    ) VALUES (
        "OneTwo project",
        3,
        47,
        1637266890525    
    );`)

    
    await db.close()
    }
}

initDb.init()