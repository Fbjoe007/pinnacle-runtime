# Migration Authority Record

## Status

**Authority Baseline Established**

Date: 2026-07-17

Repository:

`/home/remoteuser/Pinnacle`

---

# Purpose

This document establishes the ownership boundary for database migration artifacts within the Pinnacle Runtime / Validator repository.

The purpose is to prevent ambiguity regarding schema ownership, migration responsibility, and deployment authority.

---

# Migration Authority Model

## 1. Supabase Migration Authority

Location:

```
supabase/migrations/
```

Authority:

**Primary database schema authority**

Responsibilities:

* Production database schema initialization
* Core application tables
* Tenant isolation structures
* Row Level Security policies
* Storage policies
* Database-level constraints and indexes

Current migration baseline:

```
20260710000000_initial_production_schema.sql
20260710000001_row_level_security_policies.sql
```

---

# 2. Runtime Migration Authority

Location:

```
services/runtime/migrations/
```

Authority:

**Runtime subsystem migration authority**

Responsibilities:

* Runtime-specific persistence structures
* Execution ledger structures
* Runtime invariants
* Runtime data integrity enforcement

Current migration baseline:

```
001_create_ledger_events.sql
```

---

# Ownership Boundary

The repository recognizes two migration domains:

```
Database Schema
        |
        v
supabase/migrations/

        +

Runtime Subsystem State
        |
        v
services/runtime/migrations/
```

Runtime migrations do not replace Supabase migrations.

Supabase migrations do not define Runtime internal subsystem behavior.

---

# Version Control Requirement

All migration artifacts must be tracked in Git.

Migration files are considered authoritative only when:

1. Stored in their approved migration directory.
2. Reviewed through normal repository workflow.
3. Committed into repository history.

Untracked migration files are considered provisional artifacts.

---

# Governance Decision

The repository migration authority is:

* Supabase → application database schema
* Runtime migrations → Runtime-owned persistence boundaries

This establishes migration ownership and prevents future ambiguity.
