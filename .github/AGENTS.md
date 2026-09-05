# Contribution and automation rules

Read the root `AGENTS.md` first. Keep automation small enough to audit.

- Use least privilege. Quality jobs get `contents: read`; only the Pages
  deployment job gets `pages: write` and `id-token: write`, and only the release
  publication job gets `contents: write`.
- Run reproducible installs with Node.js 24 and `npm ci` against the committed
  lockfile. Do not update dependencies, auto-commit bundles, or reset the worktree
  from CI.
- Keep pull requests fork-safe: use `pull_request`, read-only permissions,
  `persist-credentials: false`, and no repository secrets. Never check out or
  execute untrusted code under `pull_request_target` or privileged `workflow_run`.
  Do not add self-hosted runners for untrusted pull requests.
- Do not print tokens, environment dumps, private data, or credentials to logs.
  Scope `GH_TOKEN` to the release publication step rather than build/install
  commands. Never add an npm token or an unreviewed registry publishing job.
- Use official, maintained GitHub actions pinned to reviewed commit SHAs with
  version comments. Verify release tags and inputs in the action's authoritative
  repository when updating; do not guess major versions.
- Deploy Pages only from this repository's trusted `main` push or manual `main`
  dispatch after quality checks. Keep Pages configuration out of untrusted jobs;
  repository enablement and environment protection are maintainer setup tasks.
- Release only matching package-version tags from reviewed commits. Transfer the
  verified tarball between read-only build and privileged publication jobs; do
  not rebuild or execute package code in the publication job. Never overwrite
  released assets or move version tags.
- Keep forms practical: request minimal reproductions, environment details, and
  visual/keyboard evidence without asking contributors to disclose private data.
  Checklists should state evidence, not imply blanket accessibility conformance.
