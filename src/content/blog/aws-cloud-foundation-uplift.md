---
title: "AWS Cloud Foundation Uplift (Transport Operator Melbourne)"
description: "A medium-scale uplift of an AWS-hosted digital apps ecosystem, prioritising security risk reduction, operational maturity and cost optimisation for a metropolitan transport operator."
pubDate: 2026-02-13
originalUrl: "https://rahulrahul.com.au/blogs/blog-article-74527"
tags: ["AWS", "Well-Architected", "Cloud Security", "Transport"]
---
**Role:** Principal Cloud Architect

**Focus:** AWS platform uplift (security, identity, network, DevOps/IaC, cost)

**Deliverables:** Target state + roadmap + governance decision pack

**Success metric:** Enterprise Risk Reduction, Operational maturity and Cost Optimisation

## Context

A major metropolitan transport operator was running several business-critical digital applications on AWS (e.g., operational scheduling, workforce and customer-facing systems). A third-party review identified material security and governance gaps, inconsistent operational practices, and limited repeatability across environments.

With constrained funding and high operational impact, the organisation needed a pragmatic uplift: reduce the highest risks quickly, establish clear platform standards, and create a realistic roadmap to improve AWS maturity over time.

## My role

As a Principal Cloud Architect, I was accountable for:

-   Assessing the current AWS footprint and risk posture
-   Defining a target-state cloud platform architecture (security, identity, network, observability, DevOps/IaC, cost)
-   Creating a phased uplift roadmap and aligning stakeholders through architecture governance

This case study focuses on the AWS cloud platform uplift component.

## Approach and delivery

### 1) Rapid current-state assessment (Weeks 1–4)

-   Ran focused workshops with the external assessor, cloud vendor, DevOps, security, and network teams
-   Mapped findings to the existing platform and application landscape, separating urgent remediation from strategic uplift
-   Produced a prioritised backlog (severity tiers) covering security exposures, operational fragility, and delivery gaps

### 2) Target-state architecture (security + delivery + cost lenses)

Anchored to AWS Well-Architected principles, I defined a target state that balanced ambition with operational reality, covering:

-   **Security & governance:** centralised audit logging and posture visibility; hardened access paths; encryption baselines and secrets handling
-   **Identity & access:** role-based access, least privilege, clearer joiner/mover/leaver controls and controlled elevation
-   **Network segmentation:** environment separation and tighter traffic boundaries to reduce blast radius
-   **Observability:** standardised telemetry and alerting foundations to support faster incident triage
-   **DevOps repeatability:** consistent build/deploy patterns to reduce drift and manual change risk
-   **Cost guardrails:** tagging, budget visibility, and operational levers for non-production environments

### 3) Phased roadmap + architecture approval

-   Produced 2–3 staged roadmap options, sequencing uplift by risk reduction value, delivery effort, and operational constraints
-   Built a decision pack articulating trade-offs, benefits, dependencies, and sequencing
-   Presented and iterated with senior stakeholders (technology and business leadership) and obtained architecture governance approval

## Outcomes

-   Established a clear, approved target state and a phased uplift roadmap aligned to risk priority and funding reality
-   Enabled immediate remediation of the highest exposures while setting the platform up for sustained maturity uplift
-   Improved stakeholder alignment by translating audit findings into a structured uplift program with clear governance

## Key learnings

1.  Start with a risk-to-control map, not a tool list
2.  Adoption beats perfection
3.  Governance must accelerate delivery, not block it
4.  Security posture is mostly identity + visibility
5.  Network segmentation is your blast-radius control
6.  Repeatability is a security control
7.  Observability is a platform feature
8.  Cost controls need to be designed-in
9.  Phased roadmaps outperform big-bang programs
10.  The hardest part is stakeholder alignment

## Final thought

Platform uplift succeeds when it’s engineered for adoption. By translating audit findings into a prioritised backlog, aligning stakeholders through decision packs, and rolling out repeatable patterns in phases, we reduced risk quickly while building momentum toward a sustainable target state. The highest-leverage changes came from identity, visibility, and standardised delivery—rather than adding more tools.

_Note: details have been generalised for confidentiality._
