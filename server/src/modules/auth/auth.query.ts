export const CREATE_USER = `
    INSERT INTO users (name, email, password, role)
    VALUES($1, $2, $3, $4) RETURNING *;
`;

export const FIND_USER_BY_EMAIL = `
    SELECT * FROM users WHERE email=$1;
`;
