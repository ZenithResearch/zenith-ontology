"""Offline shape checks for preserved shared examples, not runtime qualification."""
import copy,json
from pathlib import Path
from jsonschema import Draft202012Validator,FormatChecker,ValidationError,validators
from referencing import Registry,Resource
root=Path(__file__).resolve().parents[1];base=root/'modules/base/v0.1.0-review'
schemas={p.stem.removesuffix('.schema'):json.loads(p.read_text())for p in base.glob('*.schema.json')}
registry=Registry().with_resources((d['$id'],Resource.from_contents(d))for d in schemas.values())
for schema in schemas.values():Draft202012Validator.check_schema(schema)
examples=json.loads((base/'examples.json').read_text())
assert examples['status']=='synthetic_shape_examples_not_live_instances'
def validate(record):
 module,name=record['type'].split('.',1)
 schema={'$schema':'https://json-schema.org/draft/2020-12/schema','$ref':schemas[module]['$id']+'#/$defs/'+name}
 Draft202012Validator(schema,registry=registry,format_checker=FormatChecker()).validate(record)
for record in examples['records']:validate(record)
assert len(examples['records'])==76
bytype={r['type']:r for r in examples['records']}
negative=copy.deepcopy(bytype['execution.ToolRelease']);negative['unrecognized_secret']='rejected'
try:validate(negative)
except ValidationError:pass
else:raise AssertionError('Closed record accepted an unrecognized field')
negative=copy.deepcopy(bytype['evidence.RevisionApproval']);negative['target_refs'][0].pop('revision')
try:validate(negative)
except ValidationError:pass
else:raise AssertionError('Revision-qualified approval accepted an unversioned target')
extra=[]
for relative in ['modules/product/v0.1.0/product.schema.json','modules/publication/v0.1.0/schema.json','modules/library/v1/graph.schema.json','modules/library/v1/index.schema.json','modules/library/v2-candidate/graph.schema.json']:
 schema=json.loads((root/relative).read_text());validators.validator_for(schema).check_schema(schema);extra.append(relative)
print(json.dumps({'sharedSchemas':len(schemas),'syntheticExamples':76,'negativeExamplesRejected':2,'additionalSchemasChecked':len(extra),'scope':'offline shape validation; no runtime or semantic acceptance'}))
