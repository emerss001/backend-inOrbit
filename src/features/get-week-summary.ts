import { lte } from "drizzle-orm";
import { db } from "../db";
import { goals } from "../db/schema";
import dayjs from "dayjs";

export async function getWeekSummary() {
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
    return { sumary: "teste" };
}
