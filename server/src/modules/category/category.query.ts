export const CREATE_CATEGORY_TABLE = `
    CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name TEXT UNIQUE NOT NULL
    );
`;

export const CREATE_CATEGORY = `
    INSERT INTO categories(name) VALUES ($1) RETURNING *;
`;

export const GET_CATEGORIES = `
    SELECT * FROM categories ORDER BY id ASC;
`;

export const GET_CATEGORY_BY_ID = `
    SELECT * FROM categories WHERE id = $1;
`;

export const DELETE_CATEGORY = `
    DELETE FROM categories WHERE id = $1 RETURNING *;
`;

export const UPDATE_CATEGORY = `
    UPDATE categories SET name = $1 WHERE id = $2  RETURNING *;
`;
