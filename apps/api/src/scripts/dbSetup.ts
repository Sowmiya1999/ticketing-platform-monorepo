import { Client } from "pg";
import { execSync } from "child_process";
import * as dotenv from "dotenv";

dotenv.config();

const main = async () => {
  const dbUrl = process.env.DATABASE_URL || "";
  const match = dbUrl.match(/postgresql:\/\/(.*?):(.*?)@(.*?):(\d+)\/(.*)/);

  if (!match) {
    throw new Error(" Invalid DATABASE_URL format.");
  }

  const [, user, password, host, port, database] = match;


  const client = new Client({
    user,
    password,
    host,
    port: Number(port),
    database: "postgres",
  });

  await client.connect();

  const result = await client.query(
    `SELECT 1 FROM pg_database WHERE datname='${database}'`
  );

  if (result.rowCount === 0) {
    await client.query(`CREATE DATABASE ${database}`);
    console.log(`Database "${database}" created.`);
  } else {
    console.log(`Database "${database}" already exists.`);
  }

  await client.end();


  console.log(" Generating and pushing schema...");
  execSync("npm run generate && npm run push", { stdio: "inherit" });
  console.log("All tables are up to date with schema!");
};

main().catch((err) => {
  console.error(" Error during setup:", err);
  process.exit(1);
});
