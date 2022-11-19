import fs from 'fs';
import path from 'path';
import { config } from "dotenv";
config();

const privateKEY = fs.readFileSync(path.resolve("./src/config/keys/jwtPrivate.key"));
const publicKEY = fs.readFileSync(path.resolve("./src/config/keys/jwtPublic.key"));

export default {
    algorithm: 'RS256',
    privateKEY,
    publicKEY,
    ttl: 3600
}