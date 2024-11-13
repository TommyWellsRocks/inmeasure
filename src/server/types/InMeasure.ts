import { getUserCompanies } from "../db/queries/layout";

export type Companies = Awaited<ReturnType<typeof getUserCompanies>>
export type Company = Companies[0];