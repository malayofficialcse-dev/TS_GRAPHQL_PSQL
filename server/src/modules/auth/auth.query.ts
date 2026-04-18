export const CREATE_USER= `
    INSERT INTO users (name,email,password)
    VALUES($1,$2,$3) RETURNING *;
`;

export const FIND_USER_BY_EMAIL = `
    SELECT * FROM users WHERE email=$1;
`;