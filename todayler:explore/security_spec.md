# Security Spec

## Data Invariants
1. An admin document can only be read/modified by existing admins or if it matches the bootstrap admin email.
2. Articles can only be created, updated, or deleted by admins.
3. Anyone can list published articles.
4. Only admins can list draft articles.

## Dirty Dozen Payloads
1. Create article as unauthenticated user -> FAIL
2. Create article as non-admin -> FAIL
3. Update article status to published as non-admin -> FAIL
4. Update article adding a shadow field -> FAIL
5. Update article with huge string in body -> FAIL (size limit)
...
