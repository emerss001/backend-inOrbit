import { gte, lte, and, sql, eq, desc } from "drizzle-orm";
import { db } from "../db";
import { goalCompletions, goals } from "../db/schema";
import dayjs from "dayjs";

export async function getWeekSummary() {
    const firstDayOfWeek = dayjs().startOf("week").toDate();
    const lastDayOfWeek = dayjs().endOf("week").toDate();

    // Buscar as metas criadas até essa semana
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

    // Contagem de metas concluidas nessa semana
    const goalsCompletedInWeek = db.$with("goals_completed_in_week").as(
        db
            .select({
                id: goals.id,
                title: goals.title,
                completedAt: goalCompletions.createdAt,
                completedAtDate: sql/*sql*/ `
                    DATE(${goalCompletions.createdAt})
                `.as("completedAtDate"),
            })
            .from(goalCompletions)
            .innerJoin(goals, eq(goals.id, goalCompletions.goalId))
            .where(and(gte(goalCompletions.createdAt, firstDayOfWeek), lte(goalCompletions.createdAt, lastDayOfWeek)))
            .orderBy(desc(goalCompletions.createdAt))
    );

    // Agrupar dados pela data
    const goalsCompletedByWeekDay = db.$with("goals_completed_by_week_day").as(
        db
            .select({
                completedAtDate: goalsCompletedInWeek.completedAtDate,
                completions: sql/*sql*/ `
                JSON_AGG(
                JSON_BUILD_OBJECT(
                    'id', ${goalsCompletedInWeek.id},
                    'title', ${goalsCompletedInWeek.title},
                    'completedAt', ${goalsCompletedInWeek.completedAt}
                )
            )`.as("completions"),
            })
            .from(goalsCompletedInWeek)
            .groupBy(goalsCompletedInWeek.completedAtDate)
            .orderBy(desc(goalsCompletedInWeek.completedAtDate))
    );

    type GoalsPerDay = Record<
        string,
        {
            id: string;
            title: string;
            completedAt: string;
        }[]
    >;

    const result = await db
        .with(goalsCreatedUpToWeek, goalsCompletedInWeek, goalsCompletedByWeekDay)
        .select({
            completed: sql/*sql*/ `(SELECT COUNT(*) FROM ${goalsCompletedInWeek})`.mapWith(Number),
            total: sql/*sql*/ `(SELECT SUM(${goalsCreatedUpToWeek.desiredWeeklyFrequency}) FROM ${goalsCreatedUpToWeek})`.mapWith(
                Number
            ),
            goalsPerDay: sql<GoalsPerDay>`
  COALESCE(
    JSON_OBJECT_AGG(
      ${goalsCompletedByWeekDay.completedAtDate},
      ${goalsCompletedByWeekDay.completions}
    ),
    '{}'::json
  )
`,
        })
        .from(goalsCompletedByWeekDay);
    return { sumary: result[0] };
}
