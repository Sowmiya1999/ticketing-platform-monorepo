import * as dotenv from 'dotenv';
import * as schema from './schema';
import postgres from "postgres";
import {drizzle} from "drizzle-orm/postgres-js";
dotenv.config();


const client = postgres(process.env.DATABASE_URL!, { max: 1 });

console.log("Database connected successfully");

export const db = drizzle(client, {schema});