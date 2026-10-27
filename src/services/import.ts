export const MAX_BYTES=1024*1024;
export function validateImport(file:Pick<File,'name'|'size'>){
 if(!/\.(txt|md)$/i.test(file.name))throw new Error('Only .txt and .md files are supported');
 if(file.size>MAX_BYTES)throw new Error('Maximum file size is 1 MB');
}
export function textToDoc(text:string){return {type:'doc',content:text.split(/\r?\n/).map(line=>({type:'paragraph',content:line?[{type:'text',text:line}]:[]}))};}
export async function importFile(file:File){validateImport(file);const text=await file.text();return {title:file.name.replace(/\.(txt|md)$/i,'').slice(0,120)||'Imported document',content:textToDoc(text)};}
