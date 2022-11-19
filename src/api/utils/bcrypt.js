import bcrypt from 'bcrypt';

export default {
    hashPassword: (password) => bcrypt.hash(password, 10),
    comparePassword: (password, hashedPassword) => bcrypt.compare(password, hashedPassword)
};