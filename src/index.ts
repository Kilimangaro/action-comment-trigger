#!/usr/bin/env node

import { getInput, setFailed, setOutput } from "@actions/core";
import { context } from "@actions/github";

async function main() {
    const trigger = getInput("trigger");
    if (!trigger) {
        setFailed("No `trigger` given.");
        return;
    }

    console.log(context.payload);
    if (context.eventName === "issue_comment" && !context.payload.issue.pull_request) {
        setOutput("triggered", "false");
        return;
    }

    const body =
        context.eventName === "issue_comment" ? context.payload.comment.body : context.payload.pull_request.body;

    if (!body.includes(trigger)) {
        setOutput("triggered", "false");
        return;
    }

    setOutput("triggered", "true");
    return;
}

main().catch(err => {
    console.error(err);
    setFailed("Unexpected error");
});
