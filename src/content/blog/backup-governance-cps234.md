---
title: "Backup Governance at Scale Enforcing APRA CPS 234 Across a Hybrid Cloud Estate"
description: "A ransomware actor's first move is destroying the backups before encrypting production. This case study documents the architecture I designed to make that structurally impossible - enforcing…"
pubDate: 2026-04-09
originalUrl: "https://rahulrahul.com.au/blogs/backup-governance-cps234"
tags: ["AWS Backup", "Azure Backup", "APRA CPS 234", "Commvault", "Vault Lock", "KMS", "MUA / Resource Guard", "Segregation of Duty", "Enterprise Architecture", "Cloud Security", "FinOps"]
---
| Industry | Cloud | Regulation | Role |
| --- | --- | --- | --- |
| Financial Services - Tier 1 Bank | AWS + Azure | APRA CPS 234 | Lead Cloud Architect |

A ransomware actor's first move is destroying the backups before encrypting production. This case study documents the architecture I designed to make that structurally impossible - enforcing segregation of duty across 350+ cloud accounts without disrupting a single application team's recovery workflow.

## One compromised account. Entire backup estate at risk.

Historically, each application team administered their own backups - managing vault policies, snapshot schedules, and recovery points from within their own account. There was no central enforcement, no auditability at scale, and no structural separation between the production workload and the backup control plane.

With standard landing zone RBAC in place, an account admin could change backup policies, delete vaults, and remove recovery points from the same identity used to operate production. **IAM tightening couldn't fix this. The control plane separation had to be structural.** APRA CPS 234 mandated that no single user could control both production data and backups. The status quo failed that requirement entirely.

The architecture mandate: enforce segregation of duty across the full cloud estate, at scale, without breaking existing recovery workflows for application teams and deliver within a CTO-level compliance deadline.

## Before and after - the structural change

The core shift was separating the backup control plane from the workload data plane, with the Central Backup and Recovery (CBT) team holding exclusive ownership of vault policies, encryption key governance, and onboarding lifecycle while application teams retained self-service restore access within their own accounts.

![Backup Governance at Scale Enforcing APRA CPS 234 Across a Hybrid Cloud Estate](/images/blog/backup-governance-cps234-1.webp)

## Five decisions. One coherent framework.

Before any backup decision, three principles were assessed: data persistence, archival status, and cost justification. Only datasources satisfying all three entered the routing framework below.

### 01 · Native backup with distributed vaults

Vault topology determines blast radius. Distributed vaults - one per account - contain compromise to a single account without centralising the failure point. The control plane remains exclusively with CBT; the data plane is distributed.

> **Golden Path - AWS + Azure**

### 02 · Distributed KMS keys with governed key policies

A centralised key compromised, tampered with, or deleted makes every backup unrecoverable. Per-account KMS keys with CBT-governed deletion and rotation policies contain the blast radius at the encryption layer.

> **Golden Path - AWS**

### 03 · S3 cost anomaly - tactical response

Mid-rollout, native backup of large S3 datasets generated millions of CloudTrail events, costing AUD 8–10K per month per account. A three-pronged response - CloudTrail filtering (pursued with AWS), continuous backup mode, and CBT-owned replication - resolved the anomaly without compromising SoD.

> **Exception Path - Large S3 Datasets**

### 04 · Commvault exception path - with infrastructure security fix

Azure native backup had critical service gaps at implementation time (Blob, PostgreSQL Flexi, SQL MI, ANF). Commvault was retained as a tactical exception - but its existing deployment shared a management group inheritance path with workload admins. A separate Management Group, mirroring the pattern already used for AD infrastructure, structurally isolated Commvault from production credentials.

> **Exception Path - Azure**

### 05 · Multi-User Authorisation (MUA) via Resource Guard

Management Group isolation reduced the attack surface but did not prevent a sufficiently privileged identity from performing destructive vault operations unilaterally. Resource Guard, under CBT exclusive ownership, wraps all destructive operations (delete vault, modify policy, disable soft delete) with a mandatory second approver. The AWS equivalent was Vault Lock in governance mode combined with SCP restrictions, implemented in Decision 1.

> **Final SoD Layer - Azure**

## CPS 234 compliance at scale. Ransomware vector structurally closed.

The platform brought 350+ accounts and subscriptions into CPS 234 compliance within the required timeline. More than five petabytes of regulated data were protected under centralised backup governance. The architecture structurally eliminated the primary ransomware attack vector - no single compromised identity can modify or delete recovery points without EBT dual approval. Application team self-service recovery workflows remained unchanged throughout.

The fragmented, workload-owned backup model was replaced with automated onboarding, offboarding, monitoring, and auditability at scale. The centralised vault - a 3-2-1 air-gapped bunker - remains the architectural target state for a subsequent programme phase.

[Download full case study](https://www.linkedin.com/in/iamrahulus/overlay/1775696049694/single-media-viewer?type=DOCUMENT&profileId=ACoAAAF8aV4Bvw6r2l4RbtjpdYXo8AtL7kQ67iE&lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_view_base%3B8V2Z6EfjS2%2Bgt9%2FR7Z7zWg%3D%3D)
