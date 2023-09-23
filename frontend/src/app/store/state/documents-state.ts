// DOCUMENTS

import { Project } from "src/app/models/Project";
import { Log } from "src/app/models/Log";
import { Report } from "src/app/models/Report";
import { Check } from "src/app/models/Check";

export type UserProjectsState = Array<Project>;
export type UserLogsState = Array<Log>;
export type UserReportsState = Array<Report>;
export type UserChecksState = Array<Check>;
