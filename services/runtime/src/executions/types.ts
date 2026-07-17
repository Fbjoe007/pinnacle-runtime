import type {
  Execution
} from "@pinnacle/runtime-sdk";

export interface RuntimeExecution
  extends Execution {

  capability: string;

}
