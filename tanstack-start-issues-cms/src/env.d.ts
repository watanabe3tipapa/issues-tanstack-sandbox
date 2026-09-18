declare namespace NodeJS {
  interface ProcessEnv {
    /** GitHub のオーナー名（ユーザー名または組織名） */
    GITHUB_OWNER?: string
    /** リポジトリ名 */
    GITHUB_REPO?: string
    /** GitHub Personal Access Token（任意。レート制限が 60→5000 req/hr に緩和） */
    GITHUB_TOKEN?: string
    /** 静的ビルド時の参照先ベースパス（例: /issues-tanstack-sandbox） */
    BASE_PATH?: string
    /** "true" にすると GitHub Pages 向けの静的プリレンダリングでビルドする */
    STATIC_EXPORT?: string
  }
}