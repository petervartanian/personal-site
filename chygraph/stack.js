const $ = selector => document.querySelector(selector);
const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const defaults = {'model':'GPAI model','model-documentation':'Documentation','downstream-provider':'Integrator','ai-office':'AI Office','crawler':'Crawler','rights-reservation':'robots.txt','complaints-mechanism':'Complaint channel','safety-framework':'Framework'};
const edgeNames = {'r-adherence':'Signed commitments','r-documentation-downstream':'Share','r-documentation-office':'Disclose on request','r-rights-reservations':'Respect','r-copyright-complaints':'Handle','r-framework-notification':'Notify','r-model-report':'Submit'};
let data, objects, complexes, relations, sources, colors, shownWidth=0, pinned=null, focused=null;

function wrap(value, max=16) {
  const lines=[]; let line='';
  for(const word of String(value).split(/\s+/)) {
    if(line && `${line} ${word}`.length>max) { lines.push(line); line=word; }
    else line=line?`${line} ${word}`:word;
  }
  if(line) lines.push(line);
  return lines;
}
function text(lines,x,y,anchor='start',cls='') {
  return `<text class="${cls}" x="${x}" y="${y}" text-anchor="${anchor}">${lines.map((line,i)=>`<tspan x="${x}" dy="${i?15:-(lines.length-1)*7.5}">${escape(line)}</tspan>`).join('')}</text>`;
}
function incidence(edge,member,path) {
  return `<path class="incidence-line" data-line-edge="${escape(edge)}" data-line-object="${escape(member)}" d="${path}"/>`;
}
function object(id,x,y,available,root=false) {
  const item=objects.get(id), fill=colors.get(item.layer)||'#242323';
  const lines=wrap(item.short_label||defaults[id]||item.label,Math.max(12,Math.floor(available/6.1)));
  const h=Math.max(38,lines.length*15+12),left=root?x-12:x-available-14;
  const marker=complexes.has(id)?`<rect class="object-marker" x="${x-5}" y="${y-5}" width="10" height="10" fill="#fff" stroke="#000"/>`:`<circle class="object-marker" cx="${x}" cy="${y}" r="5" fill="${fill}" stroke="#000" stroke-width="${fill==='#FFFFFF'?1:.3}"/>`;
  return `<g class="graph-control" role="button" tabindex="0" data-object="${escape(id)}" aria-label="Highlight ${escape(item.label)} across the stack" aria-pressed="false"><rect class="hit-area" x="${left}" y="${y-h/2}" width="${available+26}" height="${h}"/>${text(lines,root?x+14:x-13,y+4,root?'start':'end',root?'root-label':'object-label')}${marker}</g>`;
}
function relation(id,x,y,root=false) {
  const edge=relations.get(id), lines=wrap(edge.short_label||edgeNames[id]||edge.label,root?24:12);
  return `<g class="graph-control" role="button" tabindex="0" data-edge="${escape(id)}" aria-label="${escape(edge.label)} - ${escape(edge.status)} - select source" aria-pressed="false"><rect class="hit-area" x="${x-34}" y="${y-15}" width="${root?180:70}" height="${33+15*lines.length}"/><path class="edge-marker" d="M${x} ${y-6}l6 6-6 6-6-6Z" fill="#fff" stroke="#000"/>${text(lines,root?x+16:x,root?y+4:y+23,root?'start':'middle','relation-label')}</g>`;
}

// Open every compound. Domain layer tags never create topology.
function measure(id,width,ancestry=new Set()) {
  if(ancestry.has(id)) throw new Error(`Cyclic visual inclusion at ${id}`);
  const c=complexes.get(id), next=new Set([...ancestry,id]);
  const children=c.vertex_ids.filter(v=>complexes.has(v));
  const local=c.vertex_ids.filter(v=>!complexes.has(v));
  const header=74, networkHeight=Math.max(105,local.length*38,c.edge_ids.length*85);
  const columns=children.length>1 && width>=630?children.length:1;
  const gap=14,pad=12,childWidth=(width-2*pad-(columns-1)*gap)/columns;
  const layouts=children.map(v=>measure(v,childWidth,next));
  let childHeight=0;
  for(let i=0;i<layouts.length;i+=columns) childHeight+=Math.max(...layouts.slice(i,i+columns).map(l=>l.height))+(i?gap:0);
  return {id,width,height:header+networkHeight+(children.length?24+childHeight:10),header,networkHeight,children:layouts,local,columns,pad,gap};
}
function compound(layout,x,y,depth=0) {
  const c=complexes.get(layout.id), w=layout.width,h=layout.height;
  const nodeX=x+w*.47,edgeX=x+w*.82,start=y+layout.header;
  const positions=new Map(),targets=new Map();
  layout.local.forEach((id,i)=>positions.set(id,{x:nodeX,y:start+16+i*(layout.networkHeight-32)/Math.max(1,layout.local.length-1)}));
  let childY=y+layout.header+layout.networkHeight+12,childMarkup='';
  layout.children.forEach((child,i)=>{
    const column=i%layout.columns,childX=x+layout.pad+column*(child.width+layout.gap);
    targets.set(child.id,{x:childX+child.width/2,y:childY});
    childMarkup+=compound(child,childX,childY,depth+1);
    if(column===layout.columns-1||i===layout.children.length-1) childY+=Math.max(...layout.children.slice(i-column,i+1).map(a=>a.height))+layout.gap;
  });
  const isBranch=layout.local.length<=1 && layout.children.length>1;
  if(isBranch && layout.local.length) positions.set(layout.local[0],{x:x+w/2,y:start+4});
  let paths='',nodes='',edges='';
  c.edge_ids.forEach((id,i)=>{
    const edge=relations.get(id);
    const ep=isBranch?{x:x+w/2,y:start+61+i*54}:{x:edgeX,y:start+40+i*(layout.networkHeight-82)/Math.max(1,c.edge_ids.length-1)};
    for(const member of edge.member_ids) {
      const p=positions.get(member)||targets.get(member);
      if(!p) throw new Error(`Missing visible member ${member}`);
      paths+=incidence(id,member,targets.has(member)?`M${ep.x} ${ep.y+7}L${p.x} ${p.y}`:isBranch?`M${p.x} ${p.y+5}L${ep.x} ${ep.y-7}`:`M${p.x+5} ${p.y}C${p.x+22} ${p.y},${ep.x-22} ${ep.y},${ep.x-7} ${ep.y}`);
    }
    edges+=relation(id,ep.x,ep.y,isBranch);
  });
  for(const [id,p] of positions) nodes+=object(id,p.x,p.y,Math.max(70,w*.47-24),isBranch);
  const title=c.short_label||c.label;
  const scope=c.scope_label||(c.id==='cx-safety'?'Systemic-risk models':c.kind==='chapter'?'Selected commitments':'Selected Code commitments');
  return `<g class="compound${depth?' nested':''}" data-compound="${escape(c.id)}" role="group" aria-label="${escape(c.label)} compound, expanded"><rect class="compound-boundary" data-boundary="${escape(c.id)}" x="${x}" y="${y}" width="${w}" height="${h}"/><g class="graph-control" role="button" tabindex="0" data-object="${escape(c.id)}" aria-pressed="false" aria-label="Highlight ${escape(c.label)}"><rect class="hit-area" x="${x+4}" y="${y+4}" width="${w-8}" height="43"/>${text([title],x+13,y+29,'start','compound-title')}</g>${text([scope],x+13,y+49,'start','scope-label')}${paths}${childMarkup}${nodes}${edges}</g>`;
}
function render() {
  shownWidth=$('#diagram').clientWidth;
  const width=Math.max(270,Math.min(1200,shownWidth)),narrow=width<660,gap=18,rootIds=data.meta.root_ids;
  const overview=rootIds.filter(id=>id!=='cx-gpai-code'),columns=narrow?1:3,cardWidth=(width-gap*(columns-1))/columns;
  const layouts=overview.map(id=>measure(id,cardWidth));
  let y=0,markup='';
  layouts.forEach((layout,i)=>{
    const column=i%columns;markup+=compound(layout,column*(cardWidth+gap),y);
    if(column===columns-1||i===layouts.length-1)y+=Math.max(...layouts.slice(i-column,i+1).map(a=>a.height))+gap;
  });
  if(rootIds.includes('cx-gpai-code')) {const code=measure('cx-gpai-code',width);markup+=compound(code,0,y);y+=code.height;}
  $('#diagram').innerHTML=`<svg class="chygraph-canvas" viewBox="-1 -1 ${width+2} ${y+2}" role="group" aria-label="One AI-stack chygraph with shared objects across all expanded compounds">${markup}</svg>`;
  $('#diagram').setAttribute('aria-busy','false');highlight(pinned||focused);
}
function highlight(target) {
  const objectIds=new Set(),edgeIds=new Set(),compoundIds=new Set();
  if(target?.kind==='edge') {
    const e=relations.get(target.id);edgeIds.add(e.id);e.member_ids.forEach(id=>objectIds.add(id));compoundIds.add(e.complex_id);
  } else if(target) {
    objectIds.add(target.id);
    for(const e of relations.values())if(e.member_ids.includes(target.id)){edgeIds.add(e.id);compoundIds.add(e.complex_id);}
    if(complexes.has(target.id)) {
      const visited=new Set();
      const walk=id=>{if(visited.has(id))return;visited.add(id);compoundIds.add(id);const c=complexes.get(id);c.edge_ids.forEach(e=>edgeIds.add(e));c.vertex_ids.forEach(v=>{objectIds.add(v);if(complexes.has(v))walk(v);});};walk(target.id);
    }
  }
  const svg=$('.chygraph-canvas');if(!svg)return;svg.classList.toggle('has-focus',Boolean(target));
  svg.querySelectorAll('[data-object]').forEach(el=>{const on=objectIds.has(el.dataset.object);el.classList.toggle('is-active',on);el.setAttribute('aria-pressed',String(on));});
  svg.querySelectorAll('[data-edge]').forEach(el=>{const on=edgeIds.has(el.dataset.edge);el.classList.toggle('is-active',on);el.setAttribute('aria-pressed',String(on));});
  svg.querySelectorAll('[data-line-edge]').forEach(el=>el.classList.toggle('is-active',edgeIds.has(el.dataset.lineEdge)&&(target?.kind==='edge'||complexes.has(target?.id)||objectIds.has(el.dataset.lineObject))));
  svg.querySelectorAll('[data-boundary]').forEach(el=>el.classList.toggle('is-active',compoundIds.has(el.dataset.boundary)));
}
function targetOf(event) {const el=event.target.closest('[data-object],[data-edge]');return el?{kind:el.dataset.edge?'edge':'object',id:el.dataset.edge||el.dataset.object}:null;}
function evidence(target) {
  const box=$('#evidence');
  if(target?.kind!=='edge'){box.innerHTML='<span>Lines show participation. Select a relationship for its source.</span>';return;}
  const e=relations.get(target.id),refs=e.source_refs.map(ref=>sources.get(ref.source_id)).filter(Boolean);
  box.innerHTML=`<span class="claim">${escape(e.claim)}</span><span>${escape(e.status)}</span>${refs.map(s=>`<a class="source" href="${escape(s.url)}" target="_blank" rel="noopener noreferrer">${escape(new URL(s.url).hostname.replace(/^www\./,''))}${s.date?`, ${escape(s.date)}`:''} ↗</a>`).join('')}`;
}
function pin(event) {
  const target=targetOf(event);if(!target)return;pinned=pinned?.kind===target.kind&&pinned.id===target.id?null:target;
  highlight(pinned);evidence(pinned);$('#graph-announcement').textContent=pinned?`${(relations.get(target.id)||objects.get(target.id)).label} highlighted across the stack`:'Highlight cleared';
}
$('#diagram').addEventListener('pointerover',event=>{if(!pinned)highlight(targetOf(event)||focused);});
$('#diagram').addEventListener('pointerleave',()=>highlight(pinned||focused));
$('#diagram').addEventListener('focusin',event=>{focused=targetOf(event);highlight(pinned||focused);});
$('#diagram').addEventListener('focusout',event=>{const el=event.relatedTarget?.closest?.('[data-object],[data-edge]');focused=el?{kind:el.dataset.edge?'edge':'object',id:el.dataset.edge||el.dataset.object}:null;highlight(pinned||focused);});
$('#diagram').addEventListener('click',pin);
$('#diagram').addEventListener('keydown',event=>{
  if(event.key==='Escape'){pinned=null;focused=null;highlight(null);evidence(null);$('#graph-announcement').textContent='Highlight cleared';}
  else if(['Enter',' '].includes(event.key)&&targetOf(event)){event.preventDefault();pin(event);}
});
new ResizeObserver(()=>{if(data&&Math.abs($('#diagram').clientWidth-shownWidth)>1)render();}).observe($('#diagram'));
try {
  const response=await fetch('data/stack.json');if(!response.ok)throw new Error(`Cannot load stack ${response.status}`);data=await response.json();
  objects=new Map([...data.atoms,...data.complexes].map(a=>[a.id,a]));complexes=new Map(data.complexes.map(c=>[c.id,c]));relations=new Map(data.relations.map(e=>[e.id,e]));sources=new Map(data.sources.map(s=>[s.id,s]));colors=new Map(data.layers.map(l=>[l.id,l.color]));
  $('#layers').innerHTML=[...data.layers].reverse().map(l=>`<li class="${l.label.toLowerCase()}" title="${escape(l.summary)}"><span class="number" aria-hidden="true">${l.id}</span><span class="name">${escape(l.label)}</span></li>`).join('');
  $('#population').textContent=`${data.atoms.length} objects, ${data.complexes.length} compounds, ${data.relations.length} relationships`;render();
  if(location.search||location.hash)history.replaceState(null,'',location.pathname);
} catch(error){$('#load-error').hidden=false;$('#diagram').setAttribute('aria-busy','false');console.error(error);}
