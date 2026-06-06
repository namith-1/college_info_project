import { z } from "zod";

export const collegeSearchSchema = z.object({
  q: z.string().trim().optional().default(""),
  city: z.string().trim().optional(),
  state: z.string().trim().optional(),
  course: z.string().trim().optional(),
  exam: z.string().trim().optional(),
  minFees: z.coerce.number().int().nonnegative().optional(),
  maxFees: z.coerce.number().int().positive().optional(),
  minRating: z.coerce.number().min(0).max(5).optional(),
  sort: z
    .enum(["relevance", "rating", "fees_asc", "fees_desc", "package"])
    .optional()
    .default("relevance"),
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().min(1).max(24).optional().default(8)
});

export const predictorSchema = z.object({
  exam: z.string().min(1, "Select an exam"),
  rank: z.coerce.number().int().positive("Rank must be positive"),
  course: z.string().trim().optional(),
  state: z.string().trim().optional()
});
