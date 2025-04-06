import { and, eq } from "drizzle-orm";
import { db } from "../db";
import { goalCompletions } from "../db/schema";
import dayjs from "dayjs";

interface undoCompletionGoalRequest {
    goalId: string;
    completedAt: string;
}

export async function undoCompletionGoal({ goalId, completedAt }: undoCompletionGoalRequest) {
    console.log(completedAt);
    console.log(dayjs(completedAt).toISOString());
    await db
        .delete(goalCompletions)
        .where(and(eq(goalCompletions.goalId, goalId), eq(goalCompletions.createdAt, dayjs(completedAt).toDate())));
    return { message: "Meta desfeita com sucesso!" };
}
