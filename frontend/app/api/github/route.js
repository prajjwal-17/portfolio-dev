import { getGithubStats } from "@/lib/github";

export const revalidate = 3600;

export async function GET() {
  const stats = await getGithubStats();
  if (!stats) {
    return Response.json({ error: "GitHub is unreachable right now" }, { status: 502 });
  }
  return Response.json(stats);
}
