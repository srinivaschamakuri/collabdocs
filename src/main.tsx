import React from 'react';
import {createRoot} from 'react-dom/client';
import './style.css';

const rootElement=document.getElementById('root');
if(!rootElement)throw new Error('CollabDocs could not find its root element.');
const root=createRoot(rootElement);
const supabaseUrl=import.meta.env.VITE_SUPABASE_URL?.trim();
const supabaseKey=import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();
const hasPlaceholder=supabaseUrl?.includes('YOUR_PROJECT')||supabaseKey?.includes('YOUR_');

if(!supabaseUrl||!supabaseKey||hasPlaceholder){
 root.render(<main className="center"><section className="auth card"><h1>Finish local setup</h1><p>CollabDocs needs your Supabase project settings before it can load.</p><ol><li>Copy <code>.env.example</code> to <code>.env</code> in the project folder.</li><li>Replace the placeholder values with your Supabase project URL and publishable/anon key.</li><li>Stop and restart the local server with <code>npm run dev</code>.</li></ol><p>Use the publishable/anon key only; never put a service-role key in this app.</p></section></main>);
}else{
 void import('./pages/App').then(({default:App})=>{
  root.render(<React.StrictMode><App/></React.StrictMode>);
 }).catch(error=>{
  root.render(<main className="center"><section className="auth card"><h1>CollabDocs could not start</h1><p role="alert">{error instanceof Error?error.message:String(error)}</p><p>Check the terminal and browser console for details.</p></section></main>);
 });
}
