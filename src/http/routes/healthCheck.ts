import { timestamp } from "drizzle-orm/mysql-core";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";

export const healthheck: FastifyPluginAsyncZod = async (app) => {
    app.get("/health", async () => {
        return { status: "ok", timestamp: new Date() };
    });
};
