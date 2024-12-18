export enum OpenAIModel {
  DAVINCI_TURBO = "gpt-3.5-turbo"
}

export interface Message {
  sender: Role;
  text: string;
}

export type Role = "assistant" | "user";
