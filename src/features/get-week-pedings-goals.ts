import dayjs from "dayjs";
import WeekOfYear from "dayjs/plugin/weekOfYear";
import { db } from "../db";
import { goals } from "../db/schema";
import { title } from "process";
import { lte } from "drizzle-orm";

dayjs.extend(WeekOfYear);

export function getWeekPedingsGoals() {
    const lastDayOfWeek = dayjs().endOf("week").toDate();

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
}
