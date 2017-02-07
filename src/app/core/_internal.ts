export type Entity = { [key: string]: any } & {
  $exists(): boolean;
  $key: string;
}

export type OpResult = {
  success: true;
  error?: {
    code: string;
    message: string;
  }
}

export type PushResult = {
  key: string;
}
