import { z } from "zod";

// Define LogLevel enum
export const LogLevelEnum = z.enum(["error", "warn", "info"]);

// Define LogEntry schema
export const LogEntrySchema = z.object({
  traceId: z
    .string()
    .min(1, "traceId must be at least 1 characters")
    .max(50, "traceId must be less than 50 characters"),
  spanId: z
    .string()
    .min(1, "spanId must be at least 1 characters")
    .max(50, "spanId must be less than 50 characters"),
  commit: z
    .string()
    .min(1, "commit hash must be at least 1 characters")
    .max(50, "commit hash must be less than 50 characters"),
  resourceId: z
    .string()
    .min(1, "resourceId  must be at least 1 characters")
    .max(50, "resourceId  must be less than 50 characters"),
  timestamp: z.string().datetime(),
  level: LogLevelEnum,
  message: z
    .string()
    .min(1, "message  must be at least 1 characters")
    .max(300, "message  must be less than 300 characters"),
  metadata: z.record(z.any()),
});

export const GetLogsQuerySchema = z.object({
  level: z
    .string()
    .transform((val) =>
      val
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean)
    )
    .refine(
      (arr) =>
        Array.isArray(arr) &&
        arr.every((val) => LogLevelEnum.options.includes(val as any)),
      {
        message: "Each level must be one of 'error', 'warn', 'info'",
      }
    )
    .optional(),
  message: z.string().optional(),
  resourceId: z.string().optional(),
  traceId: z.string().optional(),
  spanId: z.string().optional(),
  commit: z.string().optional(),
  timestamp_start: z.string().datetime().optional(),
  timestamp_end: z.string().datetime().optional(),
  page: z
    .string()
    .transform((val) => parseInt(val))
    .refine((val) => !isNaN(val) && val >= 1, {
      message: "Page must be a positive number",
    })
    .optional()
    .default("1"),
  limit: z
    .string()
    .transform((val) => parseInt(val))
    .refine((val) => !isNaN(val) && val >= 1 && val <= 100, {
      message: "Limit must be a number between 1 and 100",
    })
    .optional()
    .default("10"),
});

// Infer TypeScript type from Zod (optional)
export type LogEntry = z.infer<typeof LogEntrySchema>;
