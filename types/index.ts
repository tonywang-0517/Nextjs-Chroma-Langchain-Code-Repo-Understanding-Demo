

export interface Message {
  sender: Role;
  text: string;
}

export type Role = "assistant" | "user";
