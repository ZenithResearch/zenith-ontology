# Independent ontology updates

ZenithResearch/zenith-ontology owns the shared Zenith core. DevGraph owns its implementation extension and imports an exact Zenith release. The website distributes accepted snapshots; neither DevGraph nor the website generates other maintainers' definitions.

1. Edit the maintainer-owned source and choose a new version in its publication configuration. Never edit an issued release to change ownership, imports or definitions.
2. For a dependency update, resolve its source repository to an exact commit and copy its complete release closure. Record the manifest URL, SHA-256, byte length and version in `imports`. OWL import declarations and these exact pins must agree. Never substitute the dependency's latest branch during generation.
3. Run `npm run release:build` and `npm test`. The builder rejects an existing version with different bytes. Source-transfer checks preserve every v0.12 term and authored parent axiom; subsequent semantic evolution needs a new reviewed compatibility policy.
4. Commit and review the exact source release. Downstream intake records that source commit and its complete artifact/import pins. Website acceptance updates the selected core, dependent extension, Product record and library selection together, retaining every old URL.
5. Core changes do not force an extension release: an existing DevGraph version keeps its exact core import until DevGraph explicitly adopts a successor. Zendo and other consumers likewise retain their exact historical dependencies.

The shared-domain draft, Product, publication and library profiles remain separate versioned components with their original namespaces and maturity. Their source consolidation does not introduce subclass, equivalence or Product inheritance. The separate Rolodex source split is retained for a later explicit dependency migration; this release preserves the v0.12 directory vocabulary exactly.

## Compatibility and immutable writer

`ontology/discovery.json` retains the original camelCase composed-review contract.
Use `ontology/source-index.v1.json` for the scoped source index and
`ontology/core-discovery.v1.json` for core releases. A prepared source selection
does not establish public URL availability or runtime admission.

The builder preflights the complete release and rejects any changed, missing,
unlisted or symlinked file. Existing releases are never repaired. New releases
are staged beside their destination and installed atomically under a per-release
exclusive lock. All supported writers must honor that lock; stale locks and
interrupted staging require inspection, never automatic lock stealing.
The shared helper is dependency-free and vendored with identical conformance
tests in DevGraph. Update both copies and provenance together.

Publish and read back canonical immutable URLs before activating public source
discovery or website acceptance. Preserve older schemas, releases and exact
imports. Consumer adoption and runtime admission are separate decisions.
