import fastify from "fastify";
import z from "zod";
import { createGoal } from "../features/create-goals";
import { serializerCompiler, validatorCompiler, ZodTypeProvider } from "fastify-type-provider-zod";
import { getWeekPedingsGoals } from "../features/get-week-pedings-goals";

const app = fastify().withTypeProvider<ZodTypeProvider>();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.get("/pending-goals", async () => {
    const { pendingGoals } = await getWeekPedingsGoals();

    return { pendingGoals };
});

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
        const { title, desiredWeeklyFrequency } = request.body;

        await createGoal({
            title,
            desiredWeeklyFrequency,
        });
    }
);

app.listen({
    port: 4545,
}).then(() => {
    console.log("HTTP Server Running");
});
