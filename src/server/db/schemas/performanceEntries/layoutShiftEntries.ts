import { relations } from "drizzle-orm";
import { createTable } from "../helper";
import {
  index,
  serial,
  numeric,
  integer,
  boolean,
  varchar,
} from "drizzle-orm/pg-core";
import { clients, connectionEntries } from "~/server/db/schema";

export const layoutShiftEntries = createTable(
  "layout_shift_entries",
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
    startTime: numeric("start_time"),
    value: numeric("value"),
    duration: numeric("duration").notNull(),
    hadRecentInput: boolean("had_recent_input").notNull(),
    lastInputTime: numeric("last_input_time").notNull(),
    previousRectX: integer("previous_rect_x").notNull(),
    previousRectY: integer("previous_rect_y").notNull(),
    previousRectWidth: integer("previous_rect_width").notNull(),
    previousRectHeight: integer("previous_rect_height").notNull(),
    previousRectTop: integer("previous_rect_top").notNull(),
    previousRectRight: integer("previous_rect_right").notNull(),
    previousRectBottom: integer("previous_rect_bottom").notNull(),
    previousRectLeft: integer("previous_rect_left").notNull(),
    currentRectX: integer("current_rect_x").notNull(),
    currentRectY: integer("previous_rect_y").notNull(),
    currentRectWidth: integer("current_rect_width").notNull(),
    currentRectHeight: integer("current_rect_height").notNull(),
    currentRectTop: integer("current_rect_top").notNull(),
    currentRectRight: integer("current_rect_right").notNull(),
    currentRectBottom: integer("current_rect_bottom").notNull(),
    currentRectLeft: integer("current_rect_left").notNull(),
  },
  (table) => ({
    clientIndex: index().on(table.clientId),
    connectionIndex: index().on(table.connectionId),
  }),
);

export const layoutShiftRelations = relations(
  layoutShiftEntries,
  ({ one }) => ({
    connection: one(connectionEntries, {
      fields: [layoutShiftEntries.connectionId],
      references: [connectionEntries.connectionId],
    }),
  }),
);
