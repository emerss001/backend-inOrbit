import dayjs from "dayjs";
import WeekOfYear from "dayjs/plugin/weekOfYear";
import { db } from "../db";
import { goalCompletions, goals } from "../db/schema";
import { and, count, gte, lte } from "drizzle-orm";

dayjs.extend(WeekOfYear);

export function getWeekPedingsGoals() {
    const firstDayOfWeek = dayjs().startOf("week").toDate();
    const lastDayOfWeek = dayjs().endOf("week").toDate();

    // Todas as metas criadas até essa semana
    const goalsCreatedUpToWeek = db.$with("goals_created_up_to_week").as(
        db
            .select({
                id: goals.id,
                title: goals.title,
                desiredWeeklyFrequency: goals.desiredWeeklyFrequency,
                createdAt: goals.createdAt,
            })
            .from(goals)
            .where(lte(goals.createdAt, lastDayOfWeek))
    );

    // Constagem de metas concluidas nessa semana
    const goalsCompletionCounts = db.$with("goals_completion_counts").as(
        db
            .select({
                goalId: goalCompletions.goalId,
                completionCount: count(goalCompletions.id),
            })
            .from(goalCompletions)
            .where(and(gte(goals.createdAt, firstDayOfWeek), lte(goals.createdAt, lastDayOfWeek)))
            .groupBy(goalCompletions.goalId)
    );
}
