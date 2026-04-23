export const CREATE_ORDER_TABLE = `
    CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        product_id INT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
        quantity INT NOT NULL,
        total_price DECIMAL(10,2) NOT NULL,
        order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        status VARCHAR(50) NOT NULL
    );
`;

export const CREATE_ORDER = `
    INSERT INTO orders(user_id,product_id,quantity,total_price,status)
    VALUES ($1,$2,$3,$4,$5) RETURNING *;
`;

export const GET_ORDERS = `
    SELECT * FROM orders ORDER BY id ASC;
`;

export const GET_ORDER_BY_ID = `
    SELECT * FROM orders WHERE id = $1;
`;

export const GET_ORDERS_BY_USER_ID = `
    SELECT * FROM orders WHERE user_id = $1 ORDER BY id ASC;
`;

export const GET_ORDERS_BY_PRODUCT_ID = `
    SELECT * FROM orders WHERE product_id = $1 ORDER BY id ASC;
`;

export const UPDATE_ORDER = `
    UPDATE orders
    SET user_id = $1, product_id = $2, quantity = $3, total_price = $4, status = $5
    WHERE id = $6
    RETURNING *;
`;

export const DELETE_ORDER = `
    DELETE FROM orders WHERE id = $1 RETURNING *;
`;
