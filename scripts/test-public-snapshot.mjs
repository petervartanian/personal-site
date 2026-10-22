/** Reject unexpected source files before this clean repository can deploy. */
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,lstatSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const approved=new Set(JSON.parse(readFileSync(path.join(root,'content/public-files.json'),'utf8')));
const blocked=new Set(['arcolens','agency-costs','backdrive','correlator','haruspex','monitor']);
test('public deployment contains only explicitly approved files',()=>{
  // Includes staged/tracked files even if ignored, plus new unignored files.
  const files=new Set(execFileSync('git',['ls-files','--cached','--others','--exclude-standard','-z'],{cwd:root,encoding:'utf8'}).split('\0').filter(Boolean));
  assert(files.size>20,'The public snapshot must not be empty');
  for(const name of files){
    // The six reviewed builds are authorized only beneath /200/. Source checkouts
    // and alternate root copies must still stay outside this deployment.
    if(name.split('/').some(part=>blocked.has(part))){
      assert(name.startsWith('200/') && blocked.has(name.split('/')[1]) && approved.has(name),`Unapproved tool path: ${name}`);
    }
    const filename=path.join(root,name);
    assert(!lstatSync(filename).isSymbolicLink(),`Symlink is not allowed: ${name}`);
    if(/^200\/vault\/[a-f0-9]{64}\.bin$/.test(name)){
      const payload=readFileSync(filename);
      assert(payload.length>=29,'Encrypted objects must include IV and authentication tag');
      assert.equal(createHash('sha256').update(payload).digest('hex')+'.bin',path.basename(name),'Encrypted object checksum mismatch');
    }else assert(approved.has(name),`Unexpected public file: ${name}`);
  }
});
