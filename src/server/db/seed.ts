import { db } from "./client";
import * as schema from "./schema";

const seed = async () => {

    await db.insert(schema.appointements).values([
        {
            "name": "John Doe",
            "date": "2024-09-24",
            "startTime": "09:00:00",
            "endTime": "10:00:00",
            "service": "Haircut"
        }

    ]);

    console.log(`Seeding complete.`);
}

seed()
