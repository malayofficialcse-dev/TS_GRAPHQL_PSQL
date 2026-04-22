export const CREATE_ORDER_TABLE = `
    CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        product_id INT NOT NULL REFERENCES products(id) ON DELETE CASCADE
    );
`;

export const CREATE_ORDER = `
    INSERT INTO orders(user_id,product_id)
    VALUES ($1,$2) RETURNING *;
`;

export const GET_ORDERS = `
    SELECT * FROM orders ORDER BY id ASC;
`;

export const GET_ORDER_BY_ID = `
    SELECT * FROM orders WHERE id = $1;
`;

export const UPDATE_ORDER = `
    UPDATE orders
    SET user_id = $1, product_id = $2
    WHERE id = $3
    RETURNING *;
`;

export const DELETE_ORDER = `
    DELETE FROM orders WHERE id = $1 RETURNING *;
`;
