import { Hono } from "hono";

const statusRouter = new Hono();

statusRouter.get("/", async (c) => {
    return c.json({ status: "ok" }, 200);
});

statusRouter.post("/", async (c) => {
    return c.json({ status: "ok" }, 200);
});

statusRouter.put("/", async (c) => {
    return c.json({ status: "ok" }, 200);
});

statusRouter.delete("/", async (c) => {
    return c.json({ status: "ok" }, 200);
});

statusRouter.patch("/", async (c) => {
    return c.json({ status: "ok" }, 200);
});

export default statusRouter