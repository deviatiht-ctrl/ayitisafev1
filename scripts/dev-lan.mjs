import { networkInterfaces } from "os";
import { createServer } from "net";
import { spawn, spawnSync } from "child_process";

const portFlag = process.argv.indexOf("--port");
const START_PORT = Number(portFlag !== -1 ? process.argv[portFlag + 1] : (process.env.PORT || 3000));

function findFreePort(port) {
  return new Promise((resolve) => {
    const srv = createServer();
    srv.listen(port, "0.0.0.0", () => { srv.close(() => resolve(port)); });
    srv.on("error", () => resolve(findFreePort(port + 1)));
  });
}

const PORT = await findFreePort(START_PORT);
if (PORT !== START_PORT) {
  console.log(`\x1b[33m  ⚠  Pò ${START_PORT} deja pran — ap itilize pò ${PORT}\x1b[0m`);
}

function getLocalIP() {
  const nets = networkInterfaces();
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      if (net.family === "IPv4" && !net.internal) {
        return net.address;
      }
    }
  }
  return "localhost";
}

const ip = getLocalIP();
const localUrl   = `http://localhost:${PORT}`;
const networkUrl = `http://${ip}:${PORT}`;

console.log("\n\x1b[36m╔══════════════════════════════════════╗\x1b[0m");
console.log("\x1b[36m║       Ayiti Safe — LAN Dev Server    ║\x1b[0m");
console.log("\x1b[36m╚══════════════════════════════════════╝\x1b[0m\n");
console.log(`\x1b[32m  ➜  Local:   \x1b[0m\x1b[4m${localUrl}\x1b[0m`);
console.log(`\x1b[32m  ➜  Network: \x1b[0m\x1b[4m${networkUrl}\x1b[0m\n`);
const qrImageUrl = `https://quickchart.io/qr?size=200&text=${encodeURIComponent(networkUrl)}`;
console.log("\x1b[33m  Scane QR code la ak telefòn ou — ouvri lyen sa nan navigatè:\x1b[0m");
console.log(`\x1b[36m\x1b[4m  ${qrImageUrl}\x1b[0m\n`);

console.log("\x1b[90m  Ap kòmanse next dev...\x1b[0m\n");

const next = spawn(
  "npx",
  ["next", "dev", "--hostname", "0.0.0.0", "--port", String(PORT)],
  {
    stdio: "inherit",
    shell: true,
    cwd: process.cwd(),
  }
);

next.on("close", (code) => {
  process.exit(code ?? 0);
});
