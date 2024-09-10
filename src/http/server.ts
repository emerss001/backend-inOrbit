import fastify from "fastify";

const app = fastify();

app.listen({
    port: 4545,
}).then(() => {
    console.log("HTTP Server Running");
});
