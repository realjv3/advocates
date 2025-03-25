import db from '@/db/index'
import {advocates} from "@/db/schema";
import {advocateData} from "@/db/seed/advocates";

(async function main() {
    try {
        await db.insert(advocates).values(advocateData)
        console.info('Seeding advocates ran successfully.')
    } catch (error) {
        console.error(error)
        process.exit(1)
    } finally {
        process.exit(0)
    }
})()