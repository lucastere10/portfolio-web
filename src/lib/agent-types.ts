export interface AgentProjectMatch {
  id: string;
  type: "project" | "lab";
  title: string;
  score: number;
  slug: string;
}

export interface AgentChatResponse {
  message: string;
  selected_project: string | null;
  selected_type: "project" | "lab" | null;
  matches: AgentProjectMatch[];
  session_id: string;
  tool_used: string;
}

export interface UIChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}
