import {describe,it,expect} from 'vitest';
import {validateImport,textToDoc} from '../services/import';
import {validateTitle} from '../services/documents';
describe('file import and validation',()=>{
 it('rejects unsupported files',()=>expect(()=>validateImport({name:'unsafe.exe',size:2})).toThrow('Only .txt and .md'));
 it('rejects oversized files',()=>expect(()=>validateImport({name:'notes.md',size:1024*1024+1})).toThrow('Maximum'));
 it('converts lines into editor JSON',()=>expect(textToDoc('Hello\nWorld').content).toHaveLength(2));
 it('rejects empty document names',()=>expect(()=>validateTitle('   ')).toThrow());
});
