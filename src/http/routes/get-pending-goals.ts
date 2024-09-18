import z from "zod";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { getWeekPedingsGoals } from "../../features/get-week-pedings-goals";

export const getPendingGoals: FastifyPluginAsyncZod = async (app) => {
    app.get("/pending-goals", async () => {
        const { pendingGoals } = await getWeekPedingsGoals();

        return { pendingGoals };
    });
};
