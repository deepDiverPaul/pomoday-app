export enum TaskStatus {
  NONE,
  DONE,
  WIP,
  WAIT,
  FLAG,
}

export type Worklog = {
  start: number;
  end: number;
};

export type Task = {
  "uuid": string,
  "archived": boolean,
  "tag": string,
  "title": string,
  "status": TaskStatus,
  "lastaction": number,
  "logs": Worklog[],
  "dueDate": number,
  "id_": number,
  "id": number
}
