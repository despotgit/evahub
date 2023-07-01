// DOCUMENTS

import { Check } from "src/app/models/Check";
import { Log } from "src/app/models/Log";
import { Report } from "src/app/models/Report";

export type UserLogsState = Array<Log>;
export type UserReportsState = Array<Report>;
export type UserChecksState = Array<Check>;
