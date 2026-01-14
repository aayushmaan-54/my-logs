import { GITHUB_WORKFLOW_TOKEN, GITHUB_WORKFLOW_REPO } from 'astro:env/server';

interface TriggerDeployWorkflowInput {
  eventType: string;
  payload?: Record<string, unknown>;
}

export async function triggerDeployWorkflow({
  eventType,
  payload = {},
}: TriggerDeployWorkflowInput): Promise<void> {
  const token = GITHUB_WORKFLOW_TOKEN;
  const repo = GITHUB_WORKFLOW_REPO;

  const res = await fetch(`https://api.github.com/repos/${repo}/dispatches`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      event_type: eventType,
      client_payload: payload,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GitHub dispatch failed: ${text}`);
  }
}
