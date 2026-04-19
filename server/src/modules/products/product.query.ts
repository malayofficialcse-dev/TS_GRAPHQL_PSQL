export const CREATE_PRODUCT_TABLE = `
    CREATE TABLE IF NOT EXISTS products(
        id SERIAL PRIMAY KEY 
        name TEXT NOT NULL,
        price FLOAT NOT NULL,
        category_id INT REFERENCES categories(id)
);`;

export const CREATE_PRODUCT = `
    INSERT INTO products(name, price, category_id)
    VALUES($1, $2, $3)
    RETURNING *;
`;