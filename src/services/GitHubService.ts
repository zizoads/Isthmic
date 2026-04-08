/**
 * GitHubService: Sovereign Dispatch Protocol.
 * يسمح برفع ملفات محددة إلى المستودع باستخدام GitHub API.
 */
export class GitHubService {
  private static readonly REPO_OWNER = 'Azeddine-Beldjilali'; 
  private static readonly REPO_NAME = 'Isthmic_Pro'; 
  private static readonly BRANCH = 'main';

  static async pushFile(path: string, content: string, commitMessage: string, token: string) {
    try {
      const getFileRes = await fetch(
        `https://api.github.com/repos/${this.REPO_OWNER}/${this.REPO_NAME}/contents/${path}?ref=${this.BRANCH}`,
        { headers: { Authorization: `token ${token}` } }
      );
      
      let sha: string | undefined;
      if (getFileRes.ok) {
        const fileData = await getFileRes.json();
        sha = fileData.sha;
      }

      const pushRes = await fetch(
        `https://api.github.com/repos/${this.REPO_OWNER}/${this.REPO_NAME}/contents/${path}`,
        {
          method: 'PUT',
          headers: {
            Authorization: `token ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: commitMessage,
            content: btoa(unescape(encodeURIComponent(content))),
            sha: sha,
            branch: this.BRANCH
          })
        }
      );

      if (!pushRes.ok) {
        const err = await pushRes.json();
        throw new Error(err.message || 'Push failed');
      }

      return await pushRes.json();
    } catch (e: any) {
      console.error("GITHUB_PUSH_ERR:", e.message);
      throw e;
    }
  }
}