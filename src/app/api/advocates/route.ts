import db from "@/db";
import { InferSelectModel, sql } from "drizzle-orm";
import { Advocate, advocates } from "@/db/schema";
import { PaginationProps } from "@/app/components/Pagination";

export type GetAdvocatesResponse = {
    data: InferSelectModel<typeof advocates>[] | Advocate[];
    pagination: Pick<PaginationProps, 'page' | 'pageSize' | 'totalItems'>;
}

export async function GET(request: Request) {
    const url = new URL(request.url);
    const page = url.searchParams.get("page") ? parseInt(url.searchParams.get("page") as string) : 1;
    const totalResp = await db
        .select({ total: sql`count(*)`.as("total") })
        .from(advocates)
    const total = totalResp[0].total as number
    const pageSize = url.searchParams.get("pageSize") ?
        parseInt(url.searchParams.get("pageSize") as string) : total;

    let query = db.select().from(advocates)

    if (page && pageSize && pageSize <= total) {
        query = query.limit(pageSize);

        const offset = (page - 1) * pageSize;
        query = query.offset(offset);
    }

    const data: InferSelectModel<typeof advocates>[] = await query;

    const resp: GetAdvocatesResponse = {
        data,
        pagination: {
            page,
            pageSize,
            totalItems: total,
        },
    };

    if (page !== null && pageSize !== null) {
        resp.pagination.pageSize = pageSize;
    }

    return Response.json(resp);
}
