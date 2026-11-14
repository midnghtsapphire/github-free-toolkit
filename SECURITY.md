# Security

## Reporting a vulnerability

Please **do not open a public issue** for a security problem. Use GitHub's private reporting instead: open the **Security** tab of this repository and choose **Report a vulnerability**. Include the tool name, what you saw, and steps to reproduce.

You can expect an acknowledgement, and a fix or a clear explanation when the report has been looked at. This is a small volunteer project, so there is no guaranteed response time.

## What these tools do and do not do

- They make **read-only** requests to GitHub by default, using your own `gh` login or a token you set in an environment variable.
- They send **nothing** anywhere except to GitHub. There is no telemetry, analytics or tracking.
- Tokens are read from the environment and are never written to disk, logged or included in tool output.

## For users

- Give any token the smallest scope that works. Read-only tools need read access only.
- Pin the GitHub Action to a full commit SHA in your own workflows, as GitHub recommends.
- Review the source before you run a tool. Each one is deliberately small enough to read in a few minutes.

## Supported versions

Only the latest commit on `main` is supported.
