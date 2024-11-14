import { relations } from "drizzle-orm";
import { createTable } from "../helper";
import { index, pgEnum, varchar } from "drizzle-orm/pg-core";
import { organizationUsers, connectionEntries } from "~/server/db/schema";

export const tierEnum = pgEnum("tier", ["bronze", "silver", "gold"]);

export const organizations = createTable(
  "organizations",
  {
    id: varchar("id", { length: 255 })
      .notNull()
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    tier: tierEnum("tier").default("bronze").notNull(),
    organizationName: varchar("organization_name").notNull(),
    domain: varchar("domain").notNull(),
    apiKey: varchar("apiKey")
      .notNull()
      .$defaultFn(() => crypto.randomUUID()),
  },
  (table) => ({
    idIndex: index().on(table.id),
    apiKeyIndex: index().on(table.apiKey),
    domainIndex: index().on(table.domain),
  }),
);

export const organizationRelations = relations(organizations, ({ many }) => ({
  users: many(organizationUsers),
  siteConnections: many(connectionEntries),
}));
