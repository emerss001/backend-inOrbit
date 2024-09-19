import z from "zod";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { getWeekSummary } from "../../features/get-week-summary";

export const getWeekSummaryRoute: FastifyPluginAsyncZod = async (app) => {
    app.get("/sumary", async () => {
        const { sumary } = await getWeekSummary();

        return { sumary };
    });
};
