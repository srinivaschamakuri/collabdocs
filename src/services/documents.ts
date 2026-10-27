import { supabase } from '../lib/supabase';
export type Doc = {id:string;title:string;content:unknown;owner_id:string;updated_at:string};
export type Share = {document_id:string;user_id:string;permission:'viewer'};
export function validateTitle(value:string){const title=value.trim();if(!title || title.length>120)throw new Error('Title must be 1–120 characters');return title;}
export async function listDocs(userId:string){
 const [owned,shared] = await Promise.all([
  supabase.from('documents').select('*').eq('owner_id',userId).order('updated_at',{ascending:false}),
  supabase.from('document_shares').select('document_id,documents(*)').eq('user_id',userId)
 ]);
 if(owned.error)throw owned.error;if(shared.error)throw shared.error;
 const sharedDocs = (shared.data||[]).flatMap((row:any)=>row.documents?[row.documents as Doc]:[]);
 return {owned:(owned.data||[]) as Doc[],shared:sharedDocs};
}
export async function getDoc(id:string){const {data,error}=await supabase.from('documents').select('*').eq('id',id).single();if(error)throw error;return data as Doc;}
export async function createDoc(owner_id:string,title='Untitled document',content:unknown={type:'doc',content:[{type:'paragraph'}]}){
 const {data,error}=await supabase.from('documents').insert({owner_id,title:validateTitle(title),content}).select().single();if(error)throw error;return data as Doc;
}
export async function updateDoc(id:string,patch:Partial<Pick<Doc,'title'|'content'>>){
 if(patch.title!==undefined)patch.title=validateTitle(patch.title);
 const {error}=await supabase.from('documents').update(patch).eq('id',id);if(error)throw error;
}
export async function shareDoc(documentId:string,email:string){
 const {error}=await supabase.rpc('share_document_by_email',{p_document_id:documentId,p_email:email.trim().toLowerCase()});if(error)throw error;
}
