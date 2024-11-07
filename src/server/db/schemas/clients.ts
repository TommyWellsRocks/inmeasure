import { relations } from "drizzle-orm";
import { createTable } from "./helper";
import { index, pgEnum, varchar } from "drizzle-orm/pg-core";
import { users, browserEntries } from "~/server/db/schema";

export const tierEnum = pgEnum("tier", ["bronze", "silver", "gold"]);

export const clients = createTable(
  "clients",
  {
    id: varchar("id", { length: 255 })
      .notNull()
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: varchar("user_id").references(() => users.id, {
      onDelete: "cascade",
    }),
    tier: tierEnum("tier").default("bronze").notNull(),
    companyName: varchar("company_name").notNull(),
    apiKey: varchar("apiKey").notNull(),
    domain: varchar("domain").notNull(),
  },
  (table) => ({
    idIndex: index().on(table.id),
    apiKeyIndex: index().on(table.apiKey),
    domainIndex: index().on(table.domain),
  }),
);

export const clientRelations = relations(clients, ({ many }) => ({
  users: many(users),
  siteConnections: many(browserEntries),
}));
