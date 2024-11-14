import { relations } from "drizzle-orm";
import { createTable } from "../helper";
import { index, primaryKey, varchar } from "drizzle-orm/pg-core";
import { users, organizations } from "~/server/db/schema";

export const organizationUsers = createTable(
  "organization_users",
  {
    organizationId: varchar("organization_id").references(
      () => organizations.id,
    ),
    userId: varchar("user_id").references(() => users.id),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.organizationId, table.userId] }),
    organizationIndex: index().on(table.organizationId),
    userIndex: index().on(table.userId),
  }),
);

export const organizationUserRelations = relations(
  organizationUsers,
  ({ one }) => ({
    user: one(users, {
      fields: [organizationUsers.userId],
      references: [users.id],
    }),
    organization: one(organizations, {
      fields: [organizationUsers.organizationId],
      references: [organizations.id],
    }),
  }),
);
