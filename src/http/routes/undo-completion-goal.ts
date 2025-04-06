import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import z from "zod";
import { undoCompletionGoal } from "../../features/undo-completion-goal";

export const undoCompletionGoalRoute: FastifyPluginAsyncZod = async (app) => {
    app.delete(
        "/undo-goals-completions",
        {
            schema: {
                body: z.object({
                    goalId: z.string(),
                    completedAt: z.string(),
                }),
            },
        },
        async (request) => {
            const { goalId, completedAt } = request.body as { goalId: string; completedAt: string };
            await undoCompletionGoal({ goalId, completedAt });

            return { message: "Meta desfeita com sucesso!" };
        }
    );
};
