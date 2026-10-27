import { useEditor,EditorContent } from '@tiptap/react';
import type { JSONContent } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import { useEffect } from 'react';

function isJsonContent(value:unknown):value is JSONContent{
 return typeof value==='object'&&value!==null&&!Array.isArray(value)&&'type' in value&&typeof value.type==='string';
}
function plainText(node:JSONContent):string{
 if(node.type==='text')return node.text??'';
 if(node.type==='hardBreak')return '\n';
 return (node.content??[]).map(plainText).join('');
}
function normalizeNode(node:JSONContent):JSONContent[]{
 if(node.type==='codeBlock'){
  return plainText(node).split('\n').map(line=>({type:'paragraph',content:line?[{type:'text',text:line}]:[]}));
 }
 return [{...node,...(node.content?{content:node.content.flatMap(normalizeNode)}:{})}];
}
function normalizeContent(content:unknown):JSONContent{
 if(!isJsonContent(content)||content.type!=='doc')return {type:'doc',content:[{type:'paragraph'}]};
 return normalizeNode(content)[0]??{type:'doc',content:[{type:'paragraph'}]};
}

export default function Editor({content,editable,onChange}:{content:unknown;editable:boolean;onChange:(value:unknown)=>void}){
 const editor=useEditor({extensions:[StarterKit.configure({codeBlock:false}),Underline],content:normalizeContent(content),editable,onUpdate:({editor})=>onChange(editor.getJSON())});
 useEffect(()=>{editor?.setEditable(editable)},[editor,editable]);
 if(!editor)return <p>Loading editor…</p>;
 const actions=[['Bold',()=>editor.chain().focus().toggleBold().run(),editor.isActive('bold')],['Italic',()=>editor.chain().focus().toggleItalic().run(),editor.isActive('italic')],['Underline',()=>editor.chain().focus().toggleUnderline().run(),editor.isActive('underline')],['H1',()=>editor.chain().focus().toggleHeading({level:1}).run(),editor.isActive('heading',{level:1})],['H2',()=>editor.chain().focus().toggleHeading({level:2}).run(),editor.isActive('heading',{level:2})],['Bullets',()=>editor.chain().focus().toggleBulletList().run(),editor.isActive('bulletList')],['Numbers',()=>editor.chain().focus().toggleOrderedList().run(),editor.isActive('orderedList')]] as const;
 return <div className="editor-shell"><div className="toolbar" role="toolbar" aria-label="Text formatting">{actions.map(([label,fn,active])=><button type="button" key={label} disabled={!editable} aria-label={label} aria-pressed={active} onMouseDown={event=>event.preventDefault()} onClick={fn} className={active?'active':''}>{label}</button>)}</div><EditorContent editor={editor} className="editor-content"/></div>;
}
