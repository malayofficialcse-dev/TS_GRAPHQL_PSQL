export const CREATE_PRODUCT_TABLE = `
    CREATE TABLE IF NOT EXISTS products(
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        price FLOAT NOT NULL,
        category_id INT REFERENCES categories(id)
);`;

export const CREATE_PRODUCT = `
    INSERT INTO products(name, price, category_id)
    VALUES($1, $2, $3)
    RETURNING *;
`;

export const GET_PRODUCTS = `
    SELECT * FROM products ORDER BY id ASC`;

export const GET_PRODUCT_BY_ID = `
    SELECT * FROM products WHERE id = $1;
`;

export const UPDATE_PRODUCT = `
    UPDATE products
    SET name = $1, price = $2, category_id = $3
    WHERE id = $4
    RETURNING *;
`;

export const DELETE_PRODUCT = `
    DELETE FROM products WHERE id = $1 RETURNING *;
`;
