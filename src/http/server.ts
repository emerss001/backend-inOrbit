import fastify from "fastify";
import { serializerCompiler, validatorCompiler, ZodTypeProvider } from "fastify-type-provider-zod";
import { createGoalRoute } from "./routes/create-goal";
import { createCompletionRoute } from "./routes/create-completion";
import { getPendingGoals } from "./routes/get-pending-goals";

const app = fastify().withTypeProvider<ZodTypeProvider>();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

// Rotas da apliação
app.register(createGoalRoute);
app.register(createCompletionRoute);
app.register(getPendingGoals);

app.listen({
    port: 4545,
}).then(() => {
    console.log("HTTP Server Running");
});
