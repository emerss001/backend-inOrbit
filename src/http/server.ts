import fastify from "fastify";
import { serializerCompiler, validatorCompiler, ZodTypeProvider } from "fastify-type-provider-zod";
import { createGoalRoute } from "./routes/create-goal";
import { createCompletionRoute } from "./routes/create-completion";
import { getPendingGoals } from "./routes/get-pending-goals";
import { getWeekSummaryRoute } from "./routes/get-week-summary";
import fastifyCors from "@fastify/cors";
import { healthheck } from "./routes/healthCheck";
import { undoCompletionGoalRoute } from "./routes/undo-completion-goal";

const app = fastify().withTypeProvider<ZodTypeProvider>();

app.register(fastifyCors, {
    origin: "*",
});

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

// Rotas da apliação
app.register(createGoalRoute);
app.register(createCompletionRoute);
app.register(getPendingGoals);
app.register(getWeekSummaryRoute);
app.register(undoCompletionGoalRoute);

// Rota de healthcheck
app.register(healthheck);

app.listen({
    port: Number(process.env.PORT) || 4545,
    host: "0.0.0.0",
})
    .then(() => {
        console.log("HTTP Server Running", process.env.PORT);
    })
    .catch((err) => {
        console.error(err);
    });
