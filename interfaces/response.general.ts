import { expediente } from "@/types/general";

export interface responseExpediente {
  message?: string,
  data?: expediente[],
}