const assert = require('node:assert/strict');
const handler = require('../api/article-comments');
const { randomUUID } = require('node:crypto');
const slug = 'resumen-y-opinion';
let saved = [], sha = 'old', puts = 0, conflict = false, broken = false;
global.fetch = async (url, options) => {
 if (broken) return { ok:false,status:401 };
 if (options.method === 'PUT') {
  puts++;
  if (conflict) { conflict=false; saved.push({id:'other',submissionId:randomUUID(),createdAt:'2020-01-01T00:00:00Z'});sha='changed';return {ok:false,status:409}; }
  const data=JSON.parse(options.body);assert.equal(data.sha,sha);
  saved=JSON.parse(Buffer.from(data.content,'base64'));sha='next';return {ok:true,status:200};
 }
 return {ok:true,status:200,json:async()=>({sha,content:Buffer.from(JSON.stringify(saved)).toString('base64')})};
};
async function call(method='GET', body, extra={}) {
 let result;
 const res={setHeader(){},status(status){this.code=status;return this},json(data){result={status:this.code,data};return result}};
 await handler({method,query:{article:slug},headers:{origin:'https://erc-betapreview.vercel.app','content-type':'application/json'},body,...extra},res);return result;
}
(async()=>{
 delete process.env.ERC_COMMENTS_GITHUB_TOKEN;
 assert.equal((await call()).data.enabled,false);assert.equal((await call('POST',{})).status,503);
 process.env.ERC_COMMENTS_GITHUB_TOKEN='test-only';
 assert.equal((await call('GET',null,{query:{article:'../../secret'}})).status,404);
 assert.equal((await call('POST',{}, {headers:{origin:'https://evil.example'}})).status,403);
 const body={name:'Ana',country:'NI',text:'Mi opinión sobre el artículo.',submissionId:randomUUID()};
 assert.equal((await call('POST',{...body,website:'spam'})).status,400);
 assert.equal((await call('POST',{...body,country:'<script>'})).status,400);
 assert.equal((await call('POST',{...body,text:'x'.repeat(2001)})).status,400);
 assert.equal((await call('POST',body)).status,201);assert.equal(saved.length,1);
 assert.equal((await call('POST',body)).status,200);assert.equal(saved.length,1);
 assert.equal((await call('POST',{...body,submissionId:randomUUID()})).status,429);
 assert.equal((await call()).data.comments[0].name,'Ana');
 saved[0].createdAt='2020-01-01T00:00:00Z';conflict=true;
 assert.equal((await call('POST',{...body,submissionId:randomUUID()})).status,201);assert.equal(saved.length,3);
 broken=true;assert.equal((await call()).status,503);
 console.log('PASS: configuration, input/origin validation, persistence, duplicate retry, cooldown, concurrent write retry, upstream errors.');
})().catch(e=>{console.error(e);process.exitCode=1});
