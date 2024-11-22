// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

// import { pgTableCreator } from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
// export const createTable = pgTableCreator((name) => `inmeasure_${name}`);

// * common
export { users, usersRelations } from "~/server/db/schemas/common/users";
export {
  accounts,
  accountsRelations,
} from "~/server/db/schemas/common/accounts";
export {
  sessions,
  sessionsRelations,
} from "~/server/db/schemas/common/sessions";
export { verificationTokens } from "~/server/db/schemas/common/verificationTokens";

// Business
export {
  organizations,
  organizationRelations,
} from "~/server/db/schemas/business/organizations";
export {
  organizationUsers,
  organizationUserRelations,
} from "~/server/db/schemas/business/organizationUsers";

// Totals (automatic. Don't write.)
export {
  totalsTable,
  totalsTableRelations,
} from "~/server/db/schemas/analyticsTables/totals";

// General Entries
export {
  connectionEntries,
  connectionRelations,
} from "~/server/db/schemas/analyticsTables/connectionEntries";
export {
  standardMessages,
  standardMessageRelations,
} from "~/server/db/schemas/analyticsTables/standardMessages";
export {
  durationMessages,
  durationMessageRelations,
} from "~/server/db/schemas/analyticsTables/durationMessages";
export {
  pageURLEntries,
  pageURLEventRelations,
} from "~/server/db/schemas/analyticsTables/pageURLEntries";

// Engagement Entries
export {
  clickEventEntries,
  clickEventRelations,
} from "~/server/db/schemas/analyticsTables/recordingTables/clickEventEntries";
export {
  keyEventEntries,
  keyEventRelations,
} from "~/server/db/schemas/analyticsTables/recordingTables/keyEventEntries";
export {
  mouseMoveEntries,
  mouseMoveRelations,
} from "~/server/db/schemas/analyticsTables/recordingTables/mouseMoveEntries";
export {
  resizeEventEntries,
  resizeEventRelations,
} from "~/server/db/schemas/analyticsTables/recordingTables/resizeEventEntries";
export {
  scrollEventEntries,
  scrollEventRelations,
} from "~/server/db/schemas/analyticsTables/recordingTables/scrollEventEntries";
export {
  tabVisibilityEntries,
  tabVisibilityRelations,
} from "~/server/db/schemas/analyticsTables/recordingTables/tabVisibilityEntries";
