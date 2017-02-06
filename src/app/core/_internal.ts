export type Entity = { [key: string]: any } & {
  $exists(): boolean;
  $key: string;
}
