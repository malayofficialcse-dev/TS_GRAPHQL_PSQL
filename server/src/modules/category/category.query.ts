export const CREATE_CATEGORY = `
    INSERT INTO categories(name) VALUES ($1) RETURNING *;
`;

export const GET_CATEGORIES = `SELECT * FROM categories;`;