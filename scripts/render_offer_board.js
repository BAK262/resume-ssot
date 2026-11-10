#!/usr/bin/env node
'use strict';
const fs=require('node:fs'), path=require('node:path');
const root=path.resolve(__dirname,'..'), C=require('../templates/offer-board/core.js');
function read(file){const text=fs.readFileSync(file,'utf8');const match=text.match(/<script id="offer-data" type="application\/json">([\s\S]*?)<\/script>/);return C.validate(JSON.parse(match?match[1]:text));}
function render(data){
  C.validate(data);
  if(data.conflicts?.length)throw Error('Resolve exported conflicts before writing the board.');
  const dir=path.join(root,'templates/offer-board');
  let html=fs.readFileSync(path.join(dir,'board.html'),'utf8');
  for(const [marker,file] of [['STYLE','board.css'],['CORE','core.js'],['APP','app.js']])html=html.replace('/*'+marker+'*/',()=>fs.readFileSync(path.join(dir,file),'utf8'));
  const payload=JSON.stringify({schema:1,boardId:data.boardId,records:data.records}).replace(/</g,'\\u003c').replace(/\u2028/g,'\\u2028').replace(/\u2029/g,'\\u2029');
  return html.replace(/(<script id="offer-data" type="application\/json">)[\s\S]*?(<\/script>)/,()=>'<script id="offer-data" type="application/json">'+payload+'</script>');
}
if(require.main===module){
  try{
    const args=process.argv.slice(2), option=k=>args[args.indexOf(k)+1];
    if(!args.includes('--input')||!args.includes('--out'))throw Error('Usage: node render_offer_board.js --input data.json|board.html --out board.html [--merge export.json]');
    let data=read(option('--input'));
    if(args.includes('--merge')){const incoming=read(option('--merge'));if(incoming.boardId!==data.boardId)throw Error('Different board IDs');if(incoming.conflicts?.length)throw Error('Export has unresolved conflicts');if(!incoming.base)throw Error('Export needs its baseline for safe merging');const result=C.merge(C.validate(incoming.base),incoming,data);if(result.conflicts.length)throw Error('Conflicting fields: '+result.conflicts.map(x=>x.id+'/'+x.key).join(', '));data=result.data;}
    const out=path.resolve(option('--out')), html=render(data);fs.mkdirSync(path.dirname(out),{recursive:true});fs.writeFileSync(out,html,'utf8');
    const guide=path.join(path.dirname(out),'offer-research.html');fs.copyFileSync(path.join(root,'templates/offer-board/research.html'),guide);
    console.log(JSON.stringify({output:out,records:data.records.length,guide}));
  }catch(e){console.error(e.message);process.exitCode=1;}
}
module.exports={read,render};
