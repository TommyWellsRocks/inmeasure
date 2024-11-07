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

export {
  clients,
  clientRelations,
  tierEnum,
} from "~/server/db/schemas/clients";

// General Entries
export {
  browserEntries,
  browserEntryRelations,
} from "~/server/db/schemas/generalEntries/browserEntries";
export {
  heartbeatEntries,
  heartbeatRelations,
} from "~/server/db/schemas/generalEntries/heartbeatEntries";

// Engagement Entries
export {
  clickEventEntries,
  clickEventRelations,
} from "~/server/db/schemas/engagementEntries/clickEventEntries";
export {
  keyEventEntries,
  keyEventRelations,
} from "~/server/db/schemas/engagementEntries/keyEventEntries";
export {
  mouseMoveEntries,
  mouseMoveRelations,
} from "~/server/db/schemas/engagementEntries/mouseMoveEntries";
export {
  resizeEventEntries,
  resizeEventRelations,
} from "~/server/db/schemas/engagementEntries/resizeEventEntries";
export {
  scrollEventEntries,
  scrollEventRelations,
} from "~/server/db/schemas/engagementEntries/scrollEventEntries";
export {
  tabVisibilityEntries,
  tabVisibilityRelations,
} from "~/server/db/schemas/engagementEntries/tabVisibilityEntries";

// Performance Entries
export {
  largestContentfulPaintEntries,
  largestContentfulPaintRelations,
} from "~/server/db/schemas/performanceEntries/largestContentfulPaintEntries";
export {
  layoutShiftEntries,
  layoutShiftRelations,
} from "~/server/db/schemas/performanceEntries/layoutShiftEntries";
export {
  navigationEntries,
  navigationRelations,
} from "~/server/db/schemas/performanceEntries/navigationEntries";
export {
  paintEntries,
  paintRelations,
} from "~/server/db/schemas/performanceEntries/paintEntries";
export {
  resourceEntries,
  resourceRelations,
} from "~/server/db/schemas/performanceEntries/resourceEntries";
