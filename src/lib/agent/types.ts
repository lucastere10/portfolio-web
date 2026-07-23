export interface AgentProjectMatch {
  id: string;
  type: "project" | "lab" | "personal_project";
  title: string;
  score: number;
  slug: string;
}

export interface AgentChatResponse {
  message: string;
  selected_project: string | null;
  selected_type: "project" | "lab" | "personal_project" | null;
  matches: AgentProjectMatch[];
  session_id: string;
  tool_used: string;
}

export interface UIChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export type AgentHealthStatus =
  | "ok"
  | "starting"
  | "degraded"
  | "error"
  | "unreachable";

export interface AgentHealthResponse {
  status: AgentHealthStatus;
  llm_configured?: boolean;
  version?: string;
}
