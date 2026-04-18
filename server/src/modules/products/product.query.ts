export const CREATE_PRODUCT=`
    INSERT INTO products(name,price,category_id)
    VALUES($1,$2,$3) RETURNING *;
`;

export const GET_PRODUCTS=`SELECT * FROM products`;