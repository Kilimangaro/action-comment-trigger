# Github Action Comment Trigger

Evaluate pull request messages to match a given "trigger" keyword (ie.: "@buildmobile") to enable conditional workflow

## Usage

Workflow in a workflow:

```yaml
# Events are mandatory
on:
  pull_request:
    types: [opened]
  issue_comment:
    types: [created]

jobs:
  buildmobile:
    runs-on: ubuntu-latest
    steps:
      # Need to be the first step
      - uses: kilimangaro/action-comment-trigger@v1
        # id is needed to check outputs (see following steps)
        id: check-comment
        with:
          trigger: "@buildmobile"

      # We can now check for condition
      - uses: actions/checkout@v1
        if: steps.check-comment.outputs.triggered == 'true'
      - uses: actions/setup-node@v1
        with:
          node-version: 10.15.0
        if: steps.check-comment.outputs.triggered == 'true'
      - name: build
        run: |
          npm ci
          npm test
          npm run build-mobile
        if: steps.check-comment.outputs.triggered == 'true'
```
