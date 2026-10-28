import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const raw=n=>fs.readFile(path.join(root,n));
const json=async n=>JSON.parse(await raw(n));
const sha=b=>createHash('sha256').update(b).digest('hex');
const safe=n=>{assert(!path.isAbsolute(n)&&!n.split('/').includes('..'));return n;};
async function verifyManifest(name){
 const manifest=await json(name);assert.equal(manifest.pathBase,'repository-root');
 assert.equal(new Set(manifest.files.map(f=>f.path)).size,manifest.files.length);
 for(const f of manifest.files){const bytes=await raw(safe(f.path));assert.equal(bytes.length,f.bytes,f.path);assert.equal(sha(bytes),f.sha256,f.path);}
 const lines=manifest.files.toSorted((a,b)=>a.path<b.path?-1:1).map(f=>`${f.sha256}  ${f.path}\n`).join('');assert.equal(sha(lines),manifest.bundleDigest);
 return manifest.files.length;
}
const discovery=await json('ontology/discovery.json');assert.equal(discovery.status,'review');assert.equal(discovery.runtimeAdmission,false);assert.equal(discovery.authorityTransfer,false);
assert.equal(discovery.schemaVersion,'zenith.ontology-source-discovery.v1');
let result;
 const model=await json(discovery.model),composed=await json(discovery.sourcePath),review=await json('ontology/composition-review.json');
 assert.equal(model.completeReplacement,false);assert.equal(model.canonicalNamespaceAllocated,false);assert.equal(model.knowledgeAndResources,'separate-sibling-domains');assert.equal(review.publicWebsiteSelectionChanged,false);
 let definitions=0;
 for(const component of model.components){const bytes=await raw(safe(component.path)),source=JSON.parse(bytes),named=composed['@graph'].find(n=>n['@id']===component.namedGraph);assert.equal(sha(bytes),component.sha256);assert.deepEqual(named['@context'],source['@context']);assert.deepEqual(named['@graph'],source['@graph']);definitions+=source['@graph'].length;}
 const imported=composed['@graph'][0]['owl:imports'].map(n=>n['@id']);assert.deepEqual(imported,model.components.flatMap(c=>c.importTargets));
 const registry=await json('modules/base/v0.1.0-review/module-registry.json');assert.equal(registry.proposed_shared_modules.length,10);
 const byId=new Map(registry.proposed_shared_modules.map(m=>[m.id,m]));const done=new Set(),active=new Set();
 function visit(id){assert(!active.has(id),'Cyclic module imports');if(done.has(id))return;active.add(id);for(const dependency of byId.get(id).imports){assert(byId.has(dependency));visit(dependency);}active.delete(id);done.add(id);}
 for(const id of byId.keys())visit(id);
 const schemas=new Map();for(const m of byId.values()){const schema=await json('modules/base/v0.1.0-review/'+m.schema);schemas.set(schema.$id,schema);}
 function walk(value,base){if(!value||typeof value!=='object')return;for(const [key,v]of Object.entries(value)){if(key==='$ref'){const [id,fragment]=v.split('#');let target=schemas.get(id||base);assert(target,'Missing exact local schema '+v);if(fragment)for(const part of fragment.slice(1).split('/')){target=target?.[part.replace(/~1/g,'/').replace(/~0/g,'~')];assert(target!==undefined,'Missing schema pointer '+v);}}else walk(v,base);}}
 for(const [id,schema]of schemas)walk(schema,id);
 const prior=await json('provenance/original-base-manifest.json');
 for(const [name,hash]of Object.entries(prior.files)){let bytes;try{bytes=await raw('modules/base/v0.1.0-review/'+name);}catch(e){if(e.code==='ENOENT')continue;throw e;}assert.equal(sha(bytes),hash,'Original base bytes changed: '+name);}
 const recordTypes=registry.proposed_shared_modules.flatMap(m=>m.record_types),values=registry.proposed_shared_modules.flatMap(m=>m.value_types);assert.equal(recordTypes.length,76);assert.equal(values.length,17);
 const excluded=['Person','Agent','Organization','ProcessRun','Attempt','RuntimeEffect','Case'];for(const name of recordTypes)assert(!excluded.includes(name.split('.').at(-1)),'Provider aggregate duplicated');
 const baseline=await json('imports/devgraph/v0.8.0/manifest.json');for(const f of baseline.files){const bytes=await raw('imports/devgraph/v0.8.0/'+safe(f.path));assert.equal(sha(bytes),f.sha256);assert.equal(bytes.length,f.bytes);}
 const directory=model.imports.find(i=>i.owner==='Rolodex');assert.match(directory.commit,/^[a-f0-9]{40}$/);assert.equal(sha(await raw(directory.path)),directory.sha256);
 const files=await verifyManifest(discovery.sourceManifest);
 result={components:model.components.length,sourceGraphRecords:definitions,sharedModules:done.size,recordProfiles:recordTypes.length,valueTypes:values.length,verifiedSourceFiles:files,completeReplacement:false,sourceContextsPreserved:true};
console.log(JSON.stringify(result));
