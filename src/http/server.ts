import fastify from "fastify";
import z from "zod";
import { createGoal } from "../features/create-goals";
import { serializerCompiler, validatorCompiler, ZodTypeProvider } from "fastify-type-provider-zod";
import { getWeekPedingsGoals } from "../features/get-week-pedings-goals";
import { createGoalCompletion } from "../features/create-goal-completion";
import { createGoalRoute } from "./routes/create-goal";

const app = fastify().withTypeProvider<ZodTypeProvider>();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(createGoalRoute);

app.get("/pending-goals", async () => {
    const { pendingGoals } = await getWeekPedingsGoals();

    return { pendingGoals };
});

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
        const { goalId } = request.body;

        await createGoalCompletion({
            goalId,
        });
    }
);

app.listen({
    port: 4545,
}).then(() => {
    console.log("HTTP Server Running");
});
