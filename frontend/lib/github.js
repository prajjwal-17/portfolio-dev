import profile from "@/data/profile";

const USER = profile.github.split("/").pop();

// Public GitHub stats, cached for an hour. Returns null if GitHub is unreachable.
export async function getGithubStats() {
  try {
    const opts = {
      headers: { Accept: "application/vnd.github+json" },
      next: { revalidate: 3600 },
    };
    const [userRes, reposRes] = await Promise.all([
      fetch(`https://api.github.com/users/${USER}`, opts),
      fetch(`https://api.github.com/users/${USER}/repos?per_page=100&sort=pushed`, opts),
    ]);
    if (!userRes.ok || !reposRes.ok) return null;
    const user = await userRes.json();
    const repos = (await reposRes.json()).filter((r) => !r.fork);

    const languages = {};
    for (const r of repos) {
      if (r.language) languages[r.language] = (languages[r.language] || 0) + 1;
    }

    return {
      username: USER,
      url: profile.github,
      publicRepos: user.public_repos,
      followers: user.followers,
      stars: repos.reduce((n, r) => n + r.stargazers_count, 0),
      languages: Object.entries(languages)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([name, count]) => ({ name, count })),
      recent: repos.slice(0, 5).map((r) => ({
        name: r.name,
        url: r.html_url,
        description: r.description || "",
        language: r.language || "",
        stars: r.stargazers_count,
        pushedAt: r.pushed_at,
      })),
    };
  } catch {
    return null;
  }
}
