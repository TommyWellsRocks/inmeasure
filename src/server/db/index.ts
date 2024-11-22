import { drizzle } from "drizzle-orm/vercel-postgres";
import { sql } from "@vercel/postgres";

import * as schema from "./schema";

export const db = drizzle(sql, { schema, logger: true });

// Need to insert this trigger function for totals table
// * 1
// CREATE OR REPLACE FUNCTION update_total_connections()
// RETURNS TRIGGER AS $$
// BEGIN

// IF (TG_OP = 'INSERT') THEN
// INSERT INTO inmeasure_totals_table (organization_id, total_connections, month) VALUES (NEW.organization_id, 1, date_trunc('month', CURRENT_DATE))
// ON CONFLICT (organization_id, month) DO UPDATE SET total_connections = total_connections + 1;

// ELSIF (TG_OP = 'DELETE') THEN
// INSERT INTO inmeasure_totals_table (organization_id, total_connections, month) VALUES (NEW.organization_id, -1, date_trunc('month', CURRENT_DATE))
// ON CONFLICT (organization_id, month) DO UPDATE SET total_connections = total_connections + (-1);

// END IF;

// RETURN NEW;
// END;
// $$ LANGUAGE plpgsql;

// * 1.5
// CREATE TRIGGER update_total_connections_trigger AFTER INSERT OR DELETE ON inmeasure_totals_table FOR EACH ROW EXECUTE FUNCTION update_total_connections();


// * 2
// CREATE OR REPLACE FUNCTION update_total_standard_connection_scripts_sent()
// RETURNS TRIGGER AS $$
// BEGIN

// IF (TG_OP = 'INSERT') THEN
// INSERT INTO inmeasure_totals_table (organization_id, total_connection_scripts_sent, month) VALUES (NEW.organization_id, 1, date_trunc('month', CURRENT_DATE))
// ON CONFLICT (organization_id, month) DO UPDATE SET total_connection_scripts_sent = total_connection_scripts_sent + 1;

// ELSIF (TG_OP = 'DELETE') THEN
// INSERT INTO inmeasure_totals_table (organization_id, total_connection_scripts_sent, month) VALUES (NEW.organization_id, -1, date_trunc('month', CURRENT_DATE))
// ON CONFLICT (organization_id, month) DO UPDATE SET total_connection_scripts_sent = total_connection_scripts_sent + (-1);

// END IF;

// RETURN NEW;
// END;
// $$ LANGUAGE plpgsql;

// * 2.5
// CREATE TRIGGER update_total_standard_connection_scripts_sent_trigger AFTER INSERT OR DELETE ON inmeasure_totals_table FOR EACH ROW EXECUTE FUNCTION update_total_standard_connection_scripts_sent();

// * 3
// CREATE OR REPLACE FUNCTION update_total_session_recording_scripts_sent()
// RETURNS TRIGGER AS $$
// BEGIN

// IF (TG_OP = 'INSERT') THEN
// INSERT INTO inmeasure_totals_table (organization_id, total_session_recording_scripts_sent, month) VALUES (NEW.organization_id, 1, date_trunc('month', CURRENT_DATE))
// ON CONFLICT (organization_id, month) DO UPDATE SET total_session_recording_scripts_sent = total_session_recording_scripts_sent + 1;

// ELSIF (TG_OP = 'DELETE') THEN
// INSERT INTO inmeasure_totals_table (organization_id, total_session_recording_scripts_sent, month) VALUES (NEW.organization_id, -1, date_trunc('month', CURRENT_DATE))
// ON CONFLICT (organization_id, month) DO UPDATE SET total_session_recording_scripts_sent = total_session_recording_scripts_sent + (-1);

// END IF;

// RETURN NEW;
// END;
// $$ LANGUAGE plpgsql;

// * 3.5
// CREATE TRIGGER update_total_session_recording_scripts_sent_trigger AFTER INSERT OR DELETE ON inmeasure_totals_table FOR EACH ROW EXECUTE FUNCTION update_total_session_recording_scripts_sent();