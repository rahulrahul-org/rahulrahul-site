---
title: "Orchestrator and Agentic loop from scratch"
description: "A gated, governed and audited orchestrator from scratch which can withstand production stress without losing its safety. This orchestrator is a guide to a resilient design for answering a specific…"
pubDate: 2026-10-12
originalUrl: "https://rahulrahul.com.au/blogs/blog-article-69419"
tags: ["Agentic AI", "Orchestration", "Resilience", "Audit"]
---
## Thesis / Intro

A gated, governed and audited orchestrator from scratch which can withstand production stress without losing its safety. This orchestrator is a guide to a resilient design for answering a specific user question, using a set of custom-defined tools.

## Built

**1\. Tool dependencies are gates and managed in-memory.** The tool dependencies are enforced via a json policy file with a defined schema / structure. This is loaded in memory and any tool calls are compared against and maintained in memory against a request. This in-memory gate eliminates dependencies with a persistent store.

**2\. Single event table design.** Every kind of event, including "user\_query", "error", "retry\_attempt", "policy\_rejection", "retry\_decision" and "final\_answer", goes in one table as opposed to multiple relational tables. This allowed for a simple audit query against a correlation ID, which is the main motivation for event audits anyway.

**3\. Error handling.** The tool boundary mapped relevant error codes with semantic categories, including "return\_to\_model", "orchestrator\_retry", etc., that were defined in a separate policy file. This also contained retry policies such as honoring "retryAfter" from the server, jitter, and backoff parameters. The policy allowed the orchestrator to (a) write the custom tool catching all kinds of exceptions and errors, and (b) write the appropriate handling of these errors within the orchestrator to audit and take actions like continuing with retry, going to next tool call, escalating to human or returning to model for next response. The policy maps category to handling. It was keyed on category.

**4\. Read and write tools were separated.** That clearly defined which tools should be degraded once the "retry budget" for the tool is exhausted vs the ones that should be escalated to human. The degrade tells the model to respond based on the available information and specifically asks the model not to call the tool again.

**5\. Retry budget.** It is managed in a separate class that is initialised per request from the error policy file and keeps track of consumption after every retry per request. There are 2 kinds of retry budget: one global (across one request: max\_total\_retries\_per\_correlation) and one for each error category (max\_retries). Once exhausted, a decision is taken based on point 4.

**6\. The final answer context.** Once the model sends out a "final answer", that means no more tool calls. The context is deliberately filled within the orchestrator, indicating whether it is a "degraded", "error" or "normal" response, to complete an audit timeline. These contexts do not indicate the model's own tagging; they are controlled within the orchestrator based on the upstream tool responses. Accordingly, the model is provided with the tool response with appropriate errors and/or context to respond with. The audit timeline for a particular request is obtained via a correlation ID based query. The precedence rule for a mixed outcome is escalated > degraded > error > normal, derived from the event rows for a correlation.

## Designed (not yet built)

-   **Idempotency keys for write tools** in case there is a memory crash. The key needs to be deterministic and persistent for a retry.
-   **"unknown\_outcome" category.** For write tools, there needs to be a separate logical block for unknown outcome, with its own policy entry and handling "reconcile\_then\_escalate". The right sequence is to query the state of the downstream system with the idempotency key before retrying the tool again. If it cannot be queried, the safe fallback is to escalate.
-   **Policy version on every event record.** It is important to persist the retry policy version (maintained in the error handling policy file) with each event record.
-   **WORM storage** for compliance reasons. The database remains an operational store, and records are copied regularly to an immutable store, like S3.
-   **Undeclared tools default to write** and are escalated, governed by a CI check that fails when a tool has no declaration. (Currently the default is read.)
-   **Cross-request circuit breaker** for managing concurrent load to the downstream tool calls. It manages tool-scoped states:
    -   **Open:** write escalates and read degrades immediately, with no attempt and no unit consumed.
    -   **Closed:** write is retried with idempotency checks, and both read and write use backoff as applied in policy.
    -   **Half-open:** a fixed number of probes, with well-defined success and failure threshold criteria configured per tool, decide whether the circuit transitions to open or closed for that tool.

## Learning and Outcome

**Learnings**

-   Audit records were missed while the tool policy was successfully assessing the tool calls. (Gate decisions must not depend on the persistent store.)
-   A retry row and a degrade row for the same retry attempt collided. (Row uniqueness moved to a composite unique key constraint, which needs to include every field that distinguishes legitimate events.)
-   I traded off multiple null values (depending on the kind of event). An alternative could have been a key value store with secondary indexes (for different event types) like DynamoDB, partitioned with event\_id with a GSI on correlation ID. The unique / consistency constraint is then a responsibility of compute and not the database.
-   Defaulting an undeclared tool to read was a trade-off. If a write tool is missing the declaration, it would not escalate but degrade.

**Outcome**

-   The audit timeline survives governance and compliance checks.
-   Final outcomes are controlled by the orchestrator and not by the model's own tagging.
-   The precedence rule gives a clear priority for incident resolution:
    -   **Error:** a non-retryable error was returned and the model answered without that tool.
    -   **Degraded:** the retry budget is exhausted, or the tool is not to be called anymore due to an open circuit, and the model responds with that context in place.
    -   **Escalated to human:** a fatal condition was encountered, such as a tool policy violation, a write retry exhausted, or an unreconcilable unknown outcome.

## What's Next

-   Idempotency keys for write tools (deterministic, persistent across retry).
-   The "unknown\_outcome" policy entry and "reconcile\_then\_escalate", with a harness scenario to test it.
-   Default undeclared tools to write, with a CI check for missing declarations.
-   A tool-scoped circuit breaker (closed, open, half-open).
-   Persist the retry policy version on every event record.
-   WORM storage: regular copy of event records to an immutable store like S3.
