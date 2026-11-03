import { readFile } from "node:fs/promises";
import net from "node:net";
import path from "node:path";
import { fileURLToPath } from "node:url";
import concurrently from "concurrently";

const rootDirectory = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const readConfiguredPort = async () => {
  if (process.env.PORT) return Number(process.env.PORT);

  try {
    const serverEnv = await readFile(path.join(rootDirectory, "server", ".env"), "utf8");
    const portEntry = serverEnv.match(/^\s*PORT\s*=\s*(\d+)/m);
    return portEntry ? Number(portEntry[1]) : 5000;
  } catch (error) {
    if (error.code === "ENOENT") return 5000;
    throw error;
  }
};

const isPortAvailable = (port) =>
  new Promise((resolve, reject) => {
    const probe = net.createServer();
    probe.once("error", (error) => {
      if (error.code === "EADDRINUSE" || error.code === "EACCES") {
        resolve(false);
      } else {
        reject(error);
      }
    });
    probe.listen(port, () => {
      probe.close((error) => (error ? reject(error) : resolve(true)));
    });
  });

const findAvailablePort = async (preferredPort) => {
  const firstPort =
    Number.isInteger(preferredPort) && preferredPort >= 1024 && preferredPort <= 65535
      ? preferredPort
      : 5000;

  for (let offset = 0; offset < 1000; offset += 1) {
    const port = 1024 + ((firstPort - 1024 + offset) % (65535 - 1024 + 1));
    if (await isPortAvailable(port)) return port;
  }

  throw new Error("No available backend port was found.");
};

const start = async () => {
  const preferredPort = await readConfiguredPort();
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`Backend port ${preferredPort} is busy; using ${port} instead.`);
  }

  process.env.PORT = String(port);
  process.env.VITE_BACKEND_URL = `http://127.0.0.1:${port}`;

  const { result } = concurrently(
    [
      { command: "npm run dev --prefix server", name: "server", prefixColor: "blue" },
      {
        command: "npm run dev --prefix client -- --host 127.0.0.1",
        name: "client",
        prefixColor: "magenta",
      },
    ],
    {
      cwd: rootDirectory,
      prefix: "name",
      killOthersOn: ["failure", "success"],
      handleInput: true,
      defaultInputTarget: "server",
    }
  );

  try {
    await result;
  } catch {
    process.exitCode = 1;
  }
};

start().catch((error) => {
  console.error(`Unable to start Quick Chat: ${error.message}`);
  process.exitCode = 1;
});
