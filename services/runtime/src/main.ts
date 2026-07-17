import { createRuntimeContainer } from "./bootstrap/runtime-container.js";
import { startApiServer } from "./api/server.js";

async function main() {
    console.log("=== Upview Dashboard Ignition Suite ===");
    
    // 1. Resolve configuration from environment
    const port = parseInt(process.env.PORT || "8080", 10);
    const host = process.env.HOST || "0.0.0.0";
    
    // Safe placeholder fallback if DATABASE_URL isn't injected locally yet
    const databaseUrl = process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/upview";
    
    console.log(`[BOOTSTRAP] Initializing DI Container network connection...`);
    
    // 2. Build dependency container
    const container = createRuntimeContainer({
        databaseUrl,
        maxConnections: 5
    });

    console.log(`[BOOTSTRAP] Starting Fastify API Server boundary...`);

    // 3. Launch server instance bound to the environment
    const server = await startApiServer(container, {
        port,
        host
    });

    console.log(`🚀 Server listening on port ${port} (Host: ${host})`);

    // 4. Graceful termination handler
    const shutdownHandler = async (signal: string) => {
        console.log(`\n[SHUTDOWN] Received ${signal}. Closing server resources gracefully...`);
        try {
            await server.close();
            await container.shutdown();
            console.log("[SHUTDOWN] Runtime context severed safely. Exiting code 0.");
            process.exit(0);
        } catch (err) {
            console.error("[SHUTDOWN_ERROR] Failure during resource teardown:", err);
            process.exit(1);
        }
    };

    process.on("SIGINT", () => shutdownHandler("SIGINT"));
    process.on("SIGTERM", () => shutdownHandler("SIGTERM"));
}

main().catch((err) => {
    console.error("❌ CRITICAL BOOTSTRAP FAILURE:", err);
    process.exit(1);
});
