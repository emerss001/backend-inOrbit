import z from "zod";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { createGoal } from "../../features/create-goals";

export const createGoalRoute: FastifyPluginAsyncZod = async (app) => {
    app.post(
        "/goals",
        {
            schema: {
                body: z.object({
                    title: z.string(),
                    desiredWeeklyFrequency: z.number().min(1).max(7),
                }),
            },
        },
        async (request) => {
            const { title, desiredWeeklyFrequency } = request.body as { title: string; desiredWeeklyFrequency: number };

            const { goal } = await createGoal({
                title,
                desiredWeeklyFrequency,
            });

            return { goalId: goal.id };
        }
    );
};
