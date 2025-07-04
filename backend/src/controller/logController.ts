import { Request, Response } from "express";
import { JsonDB, Config } from "node-json-db";
import { GetLogsQuerySchema, LogEntry, LogEntrySchema } from "../zod/schema";
import { isAfter, isBefore } from "date-fns";

const db = new JsonDB(new Config("logsDB", true, false, "/"));

export const createLog = async (req: Request, res: Response) => {
  try {
    //prase incoming log data
    const parsedData = LogEntrySchema.safeParse(req.body);
    //if log data is not valid, return 400 error
    if (!parsedData.success) {
      const errorMessages = parsedData.error.issues.map(
        (obj) => `${obj.message}: ${obj.path[0]}`
      );
      res.status(400).send({ success: false, message: errorMessages });
      return;
    }
    //appends log to the end of logs array
    await db.push("/logs[]", parsedData.data);
    //return 201 created on successful append
    res.status(201).send({ success: true, message: "Log Created." });
  } catch (error) {
    console.log("🚀 ~ createLog ~ error:", error);
    res.status(500).send({
      message: "Internal Server Error",
      error,
    });
  }
};

export const getLogs = async (req: Request, res: Response) => {
  try {
    //prase incoming query params
    const parsedQueryParams = GetLogsQuerySchema.safeParse(req.query);

    //if query params are not valid, return error
    if (!parsedQueryParams.success) {
      const errorMessages = parsedQueryParams.error.issues.map(
        (obj) => `${obj.message}: ${obj.path[0]}`
      );
      res.status(400).send({ success: false, message: errorMessages });
      return;
    }
    //destructuring values from parsed query params
    const {
      level,
      message,
      resourceId,
      traceId,
      spanId,
      commit,
      timestamp_start,
      timestamp_end,
      page,
      limit,
    } = parsedQueryParams.data;

    //getting data from json db
    const data = (await db.getData("/logs")) as LogEntry[];

    const filteredData = data.filter((log) => {
      // If level is provided and doesn't match, exclude the log,otherwise continue
      if (level?.length && !level.includes(log.level)) return false;
      if (message && !log.message.toLowerCase().includes(message.toLowerCase()))
        return false;
      if (
        resourceId &&
        log.resourceId.toLowerCase() !== resourceId.toLowerCase()
      )
        return false;
      if (traceId && log.traceId !== traceId) return false;
      if (spanId && log.spanId !== spanId) return false;
      if (commit && log.commit !== commit) return false;

      if (
        timestamp_start &&
        isBefore(new Date(log.timestamp), new Date(timestamp_start))
      ) {
        return false;
      }

      if (
        timestamp_end &&
        isAfter(new Date(log.timestamp), new Date(timestamp_end))
      ) {
        return false;
      }

      return true;
    });
    //sort filter logs data
    const sortedData = filteredData.sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
    //start index & end index
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    //slice paginated data
    const paginatedData = sortedData.slice(startIndex, endIndex);

    res.status(200).send({
      success: true,
      data: paginatedData,
      pagination: {
        total: sortedData.length,
        page,
        limit,
        totalPages: Math.ceil(sortedData.length / limit),
      },
    });
  } catch (error) {
    console.log("🚀 ~ getLogs ~ error:", error);
    res.status(500).send({
      message: "Internal Server Error",
      error,
    });
  }
};
