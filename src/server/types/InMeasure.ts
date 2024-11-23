import { getTheDashboardData } from "../db/queries/dashboard";
import { getUserOrganizations } from "../db/queries/layout";

export type Organizations = Awaited<ReturnType<typeof getUserOrganizations>>;
export type Organization = Organizations[0];

export type DashboardConnections = Awaited<ReturnType<typeof getTheDashboardData>>