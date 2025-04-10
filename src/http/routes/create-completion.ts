import z from "zod";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { createGoalCompletion } from "../../features/create-goal-completion";

export const createCompletionRoute: FastifyPluginAsyncZod = async (app) => {
    app.post(
        "/goals-completions",
        {
            schema: {
                body: z.object({
                    goalId: z.string(),
                }),
            },
        },
        async (request) => {
            const { goalId } = request.body as { goalId: string };

            await createGoalCompletion({
                goalId,
            });
        }
    );
};
