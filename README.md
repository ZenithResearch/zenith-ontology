# Zenith ontology

Proposed canonical authoring home for one composed Zenith model: shared base/domain definitions, Product vocabulary, publication/release/changelog vocabulary and versioned library profiles. The website remains the distribution/acceptance surface and consumes reviewed exact source pins.

**The Zenith base draft is not a complete replacement ontology.** It contains ten proposed shared modules, 76 record profiles and 17 value types. It imports existing directory/artifact definitions and preserves DevGraph Work, Runtime execution, Hub transport and receiver/secS authority boundaries. Source ownership proposals, namespace allocation, runtime contracts and migrations remain explicit review decisions. Knowledge and Resources stay separate sibling domains.

Start at [discovery](ontology/discovery.json), [composed model](ontology/ontology.jsonld), [component registry](ontology/model.json) and [overlap/migration review](ontology/composition-review.json). The composed JSON-LD preserves each component in a named graph with its original context; the exact source documents and schemas remain available separately. It adds no inferred equivalence or inheritance. This is one model family with independently versioned modules/profiles, rather than a universal record schema.

| Component | Source | Current maturity |
| --- | --- | --- |
| Shared base and domains | `modules/base/v0.1.0-review/` | Review draft; ten proposed modules |
| Product | `modules/product/v0.1.0/` | Existing Zenith vocabulary and record schema, preserved |
| Publication/release/changelog | `modules/publication/v0.1.0/` | Existing review profile, preserved |
| Library metadata v1 | `modules/library/v1/` | Retained published profile |
| Library metadata v2 | `modules/library/v2-candidate/` | Local review candidate; not a public Zenith release |

The old shared-draft module registry is retained byte for byte, including its then-unresolved authoring-repository fields. The new top-level discovery proposes this common source home. A source repository does not retroactively promote those old governance declarations or allocate the draft URN namespace. `provenance/original-base-manifest.json` is the original full research-folder manifest; only the explicitly selected shared-source subset is included here, not the original film application, film-specific schema or runtime code. The new source manifest enumerates this package.

## Keep meanings and providers distinct

ArtifactRef is a value referring to retained bytes; an Artifact is the described artifact; ReleaseArtifact is a file's membership in a release. SourceRevision and SourceCommit carry different revision/provenance commitments. Product, Application, Repository, Ontology and Release are distinct associated concepts. Consolidating their source home does not turn them into aliases.

Pinned DevGraph v0.8 imports are retained under `imports/` for the unchanged base draft. A local Rolodex split snapshot is provided for review, without changing any existing import or claiming a complete provider migration. Directory participation/profile extensions remain stewardship-review candidates. The combined model does not copy Work, execution or authority aggregates into new Zenith runtime kinds.

## Validation and adoption

`npm test` verifies source and composed-model integrity, exact source contexts, schema-reference closure, preserved component definitions and provider boundaries. `python3 scripts/verify-schemas.py` additionally validates all 76 shared synthetic examples with jsonschema/referencing, checks negative examples and validates the Product/publication/library schemas. These Python dependencies are validation tools; they are not runtime services.

Review the source packages and canonical repository decisions, then make explicit new source releases and producer/consumer import updates. Move authoring/generation out of the website through a coordinated change; these snapshots alone do not rewire its current generators. Preserve existing IDs, URLs, accepted bytes, exact imports, maturity and historical records. Public website admission, protected-preview qualification, retained-URL rollback and exact release approval still apply. No website state is changed by preparing or pushing this source repository.
