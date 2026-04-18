export const CREATE_ORDER = `
    INSERT INTO orders(user_id,product_id)
    VALUES ($1,$2) RETURNING *;
`;