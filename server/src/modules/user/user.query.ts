export const CREATE_USER_TABLE=`
    CREATE TABLE IF NOT EXISTS users (
     id SERIAL PRIMARY KEY,
     name TEXT,
     email VARCHAR(20) UNIQUE NOT NULL,
     password TEXT NOT NULL 
);`;

export const INSERT_USER=`
    INSERT INTO users(name,email,password)
        VALUES ($1,$2,$3)
        RETURNING *;
`;

export const GET_USERS=`
    SELECT * FROM users;
`;

export const GET_USER_BY_ID=`
    SELECT * FROM users WHERE id = $1;
`;

export const DELETE_USER = `
    DELETE FROM users WHERE id = $1;
`;

export const UPDATE_USER = `
    UPDATE users SET name=$1 WHERE id=$2 RETURNING *;
`;