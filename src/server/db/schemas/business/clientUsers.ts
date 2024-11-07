import { relations } from "drizzle-orm";
import { createTable } from "../helper";
import { index, serial, varchar } from "drizzle-orm/pg-core";
import { users, clients } from "~/server/db/schema";

export const clientUsers = createTable(
  "client_users",
  {
    id: serial("id").primaryKey(),
    clientId: varchar("client_id").references(() => clients.id),
    userId: varchar("user_id").references(() => users.id),
  },
  (table) => ({
    clientIndex: index().on(table.clientId),
    userIndex: index().on(table.userId),
  }),
);

export const clientUserRelations = relations(clientUsers, ({ one }) => ({
  user: one(users, { fields: [clientUsers.userId], references: [users.id] }),
  client: one(clients, {
    fields: [clientUsers.clientId],
    references: [clients.id],
  }),
}));
