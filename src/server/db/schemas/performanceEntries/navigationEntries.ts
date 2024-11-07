import { relations } from "drizzle-orm";
import { createTable } from "../helper";
import { index, varchar, serial, numeric, integer } from "drizzle-orm/pg-core";
import { clients, connectionEntries } from "~/server/db/schema";

export const navigationEntries = createTable(
  "navigation_entries",
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
    type: varchar("type").notNull(),
    deliveryType: varchar("delivery_type").notNull(),
    notRestoredReasons: varchar("not_restored_reasons"),
    networkProtocol: varchar("network_protocol").notNull(),
    redirectCount: integer("redirect_count").notNull(),
    responseStatus: integer("response_status").notNull(),
    transferSize: integer("transfer_size").notNull(),
    encodedBodySize: integer("encoded_body_size").notNull(),
    decodedBodySize: integer("decoded_body_size").notNull(),
    duration: numeric("duration").notNull(),
    redirectStart: numeric("redirect_start").notNull(),
    redirectEnd: numeric("redirect_end").notNull(),
    workerStart: numeric("worker_start").notNull(),
    activationStart: numeric("activation_start").notNull(),
    fetchStart: numeric("fetch_start").notNull(),
    domainLookupStart: numeric("domain_lookup_start").notNull(),
    domainLookupEnd: numeric("domain_lookup_end").notNull(),
    connectStart: numeric("connect_start").notNull(),
    secureConnectionStart: numeric("secure_connection_start").notNull(),
    connectEnd: numeric("connect_end").notNull(),
    requestStart: numeric("request_start").notNull(),
    criticalCHRestart: numeric("critical_ch_restart").notNull(),
    firstInterimResponseStart: numeric(
      "first_interim_response_start",
    ).notNull(),
    responseStart: numeric("response_start").notNull(),
    unloadStart: numeric("unload_start").notNull(),
    unloadEnd: numeric("unload_end").notNull(),
    responseEnd: numeric("response_end").notNull(),
    domInteractive: numeric("dom_interactive").notNull(),
    domComplete: numeric("dom_complete").notNull(),
    loadStart: numeric("load_start").notNull(),
    loadEnd: numeric("load_end").notNull(),
  },
  (table) => ({
    clientIndex: index().on(table.clientId),
    connectionIndex: index().on(table.connectionId),
  }),
);

export const navigationRelations = relations(navigationEntries, ({ one }) => ({
  connection: one(connectionEntries, {
    fields: [navigationEntries.connectionId],
    references: [connectionEntries.connectionId],
  }),
}));
