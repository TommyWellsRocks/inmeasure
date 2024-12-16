import { z } from "zod";

export const SeatOption = z.enum(["1", "5", "10", "Unlimited"]);
