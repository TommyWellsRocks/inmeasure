import { relations } from "drizzle-orm";
import { createTable } from "../helper";
import { index, varchar, serial, numeric, integer } from "drizzle-orm/pg-core";
import { clients, connectionEntries } from "~/server/db/schema";

export const resourceEntries = createTable(
  "resource_entries",
  {
    id: serial("id").primaryKey(),
    connectionId: varchar("connection_id").references(
      () => connectionEntries.connectionId,
      {
        onDelete: "cascade",
      },
    ),
    clientId: varchar("client_id").references(() => clients.id, {
      onDelete: "cascade",
    }),
    name: varchar("name").notNull(),
    initiatorType: varchar("initiator_type").notNull(),
    deliveryType: varchar("delivery_type").notNull(),
    blockingStatus: varchar("blocking_status").notNull(),
    networkProtocol: varchar("network_protocol").notNull(),
    responseStatus: integer("response_status").notNull(),
    transferSize: integer("transfer_size").notNull(),
    encodedBodySize: integer("encoded_body_size").notNull(),
    decodedBodySize: integer("decoded_body_size").notNull(),
    duration: numeric("duration").notNull(),
    redirectStart: numeric("redirect_start").notNull(),
    redirectEnd: numeric("redirect_end").notNull(),
    workerStart: numeric("worker_start").notNull(),
    fetchStart: numeric("fetch_start").notNull(),
    domainLookupStart: numeric("domain_lookup_start").notNull(),
    domainLookupEnd: numeric("domain_lookup_end").notNull(),
    connectStart: numeric("connect_start").notNull(),
    secureConnectionStart: numeric("secure_connection_start").notNull(),
    connectEnd: numeric("connect_end").notNull(),
    requestStart: numeric("request_start").notNull(),
    firstInterimResponseStart: numeric(
      "first_interim_response_start",
    ).notNull(),
    responseStart: numeric("response_start").notNull(),
    responseEnd: numeric("response_end").notNull(),
  },
  (table) => ({
    clientIndex: index().on(table.clientId),
    connectionIndex: index().on(table.connectionId),
  }),
);

export const resourceRelations = relations(resourceEntries, ({ one }) => ({
  connection: one(connectionEntries, {
    fields: [resourceEntries.connectionId],
    references: [connectionEntries.connectionId],
  }),
}));
