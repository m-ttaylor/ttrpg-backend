
import mongoose from "mongoose";
import config from "config";

async function connect() {
  const dbUri = config.get<string>("dbUri");

  try {
    console.log(`attempting to connect to db at ${dbUri}...`);
    await mongoose.connect(dbUri);
    console.log("DB connected");
  } catch (error) {
    console.log("Could not connect to db", error.message);
    process.exit(1);
  }
}

export default connect;