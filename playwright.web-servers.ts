const backendPort = process.env.BACKEND_INTEGRATION_PORT ?? "18000";

export function createIntegrationWebServers(frontendPort: number) {
  return [
    {
      command: "bash scripts/run-backend-integration.sh",
      url: `http://127.0.0.1:${backendPort}/openapi.json`,
      reuseExistingServer: false,
      timeout: 180_000,
      gracefulShutdown: { signal: "SIGTERM" as const, timeout: 5_000 },
    },
    {
      command: `BACKEND_DEV_URL=http://127.0.0.1:${backendPort} npm run dev -- --host 127.0.0.1 --port ${frontendPort}`,
      url: `http://127.0.0.1:${frontendPort}`,
      reuseExistingServer: true,
    },
  ];
}
