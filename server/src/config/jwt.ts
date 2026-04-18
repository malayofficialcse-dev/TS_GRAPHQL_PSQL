import  jwt  from "jsonwebtoken";

const SECRET = "mo938uj03ejw38fceh8o94f!@#$%^&*()";

export const generateToken = (user:any) => {
    return jwt.sign({id:user.id,email:user.email}, SECRET,{
        expiresIn:"7d",
    });
};

export const verifyToken = (token:string) => {
    return jwt.verify(token,SECRET);
};