const { MongoMemoryServer } = require("mongodb-memory-server");

async function main() {
  const mongo = await MongoMemoryServer.create({
    binary: {
      arch: "x64",
      version: "7.0.14",
    },
    instance: {
      dbName: "guru",
    },
  });

  process.env.MONGO_URI = mongo.getUri();

  console.log(`Memory MongoDB running at ${process.env.MONGO_URI}`);

  require("./index");

  async function shutdown() {
    await mongo.stop();
    process.exit(0);
  }

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
