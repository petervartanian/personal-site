'use strict';
(() => {
  const root=document.querySelector('.ab-app');if(!root)return;
  const $=selector=>root.querySelector(selector);
  const normalize=value=>String(value).normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
  const matches=(value,query)=>normalize(query).trim().split(/\s+/).every(term=>normalize(value).includes(term));
  const valid=(select,value)=>[...select.options].some(option=>option.value===value)?value:select.options[0].value;
  const updateURL=(values,hash)=>{if(root.dataset.preview)return;const url=new URL(location.href);for(const[key,value]of Object.entries(values))value?url.searchParams.set(key,value):url.searchParams.delete(key);if(hash!==undefined)url.hash=hash;history.replaceState(null,'',url);};
  root.dataset.enhanced='true';
  if(root.dataset.page==='records'){
    const data=JSON.parse($('#records-data').textContent);
    const records=data.records.map(record=>({record,row:root.querySelector('[id="'+record.id+'"]'),detail:root.querySelector('[id="detail-'+record.id+'"]'),search:JSON.stringify(record)}));
    const search=$('#search'),stakeholder=$('#stakeholder'),benefit=$('#benefit'),sort=$('#sort');
    let visible=records,selected=records[0]?.record.id;
    const views=[...root.querySelectorAll('.ab-view')];
    let currentView='benefits';
    function showView(id,writeURL=true){
      if(!views.some(view=>view.id===id))return;
      currentView=id;
      views.forEach(view=>view.hidden=view.id!==id);
      root.querySelectorAll('[data-nav]').forEach(link=>{
        if(link.dataset.nav===id)link.setAttribute('aria-current','page');
        else link.removeAttribute('aria-current');
      });
      if(writeURL&&!root.dataset.preview){const url=new URL(location.href);url.hash=id;if(url.href!==location.href)history.pushState(null,'',url);}
      root.dispatchEvent(new CustomEvent('ab:state'));
    }
    function select(id,writeURL=true,scroll=false){
      selected=id;
      records.forEach(entry=>{const active=entry.record.id===id;entry.row.dataset.selected=String(active);entry.row.querySelector('button').setAttribute('aria-pressed',String(active));entry.detail.hidden=!active;entry.detail.open=active;});
      $('#evidence-panel').hidden=!id;
      if(writeURL)updateURL({},id||'');
      root.dispatchEvent(new CustomEvent('ab:state'));
      if(scroll&&window.innerWidth<=800&&!root.dataset.preview)$('#evidence-panel').scrollIntoView({block:'start',behavior:'instant'});
    }
    function apply(writeURL=true){
      const ordered=[...records].sort((a,b)=>sort.value==='record'?a.record.record_number.localeCompare(b.record.record_number):(sort.value==='newest'?-1:1)*a.record.publication_date.localeCompare(b.record.publication_date));
      visible=ordered.filter(e=>matches(e.search,search.value)&&(!stakeholder.value||e.record.stakeholder_class===stakeholder.value)&&(!benefit.value||e.record.benefit_type.id===benefit.value));
      const ids=new Set(visible.map(e=>e.record.id));ordered.forEach(e=>{e.row.hidden=!ids.has(e.record.id);$('#records').append(e.row);});
      if(!ids.has(selected))selected=visible[0]?.record.id;
      select(selected,false);$('#result-count').textContent=`${visible.length} of ${records.length} cases`;
      $('#empty-state').hidden=visible.length>0;$('#export-view').disabled=!visible.length;
      if(writeURL)updateURL({q:search.value.trim(),beneficiary:stakeholder.value,benefit:benefit.value,order:sort.value==='record'?'':sort.value},currentView);
    }
    function reset(){search.value='';stakeholder.value='';benefit.value='';sort.value='record';apply();}
    function restore(){const params=new URLSearchParams(location.search);search.value=params.get('q')||'';stakeholder.value=valid(stakeholder,params.get('beneficiary')||'');benefit.value=valid(benefit,params.get('benefit')||'');sort.value=valid(sort,params.get('order')||'record');apply(false);}
    function openHash(){let id;try{id=decodeURIComponent(location.hash.slice(1));}catch{return;}if(views.some(view=>view.id===id)){showView(id,false);return;}if(!records.some(e=>e.record.id===id))return;if(!visible.some(e=>e.record.id===id)){search.value='';stakeholder.value='';benefit.value='';apply(false);updateURL({q:'',beneficiary:'',benefit:''},id);}showView('collection',false);select(id,false);}
    $('#filters').hidden=false;$('#filter-actions').hidden=false;$('#filters').addEventListener('submit',e=>e.preventDefault());
    search.addEventListener('input',()=>apply());[stakeholder,benefit,sort].forEach(control=>control.addEventListener('change',()=>apply()));
    $('#reset').addEventListener('click',reset);$('#empty-reset').addEventListener('click',()=>{reset();search.focus();});
    root.querySelectorAll('[data-record]').forEach(button=>button.addEventListener('click',()=>select(button.dataset.record,true,true)));
    root.querySelectorAll('[data-stakeholder]').forEach(button=>button.addEventListener('click',()=>{stakeholder.value=button.dataset.stakeholder;search.value='';benefit.value='';apply();showView('collection');}));
    root.querySelectorAll('[data-nav]').forEach(link=>link.addEventListener('click',event=>{event.preventDefault();showView(link.dataset.nav);}));
    $('.ab-skip').addEventListener('click',event=>{event.preventDefault();showView('collection');search.focus();});
    root.querySelectorAll('[data-benefit-link]').forEach(link=>link.addEventListener('click',event=>{event.preventDefault();benefit.value=link.dataset.benefitLink;search.value='';stakeholder.value='';apply();showView('collection');}));
    const taxonomySearch=$('#taxonomy-search'),taxonomyStakeholder=$('#taxonomy-stakeholder');
    function filterTaxonomy(){
      const cards=[...root.querySelectorAll('[data-benefit-card]')];
      cards.forEach(card=>card.hidden=!matches(card.textContent,taxonomySearch.value)||Boolean(taxonomyStakeholder.value&&!card.dataset.stakeholders.split(', ').includes(taxonomyStakeholder.value)));
      $('#taxonomy-empty').hidden=cards.some(card=>!card.hidden);
    }
    $('#taxonomy-filters').hidden=false;
    $('#taxonomy-filters').addEventListener('submit',event=>event.preventDefault());
    taxonomySearch.addEventListener('input',filterTaxonomy);taxonomyStakeholder.addEventListener('change',filterTaxonomy);
    $('#export-view').addEventListener('click',()=>{const keys=[...new Set(data.records.flatMap(Object.keys))];const cell=value=>'"'+String(value==null?'':typeof value==='object'?JSON.stringify(value):value).replaceAll('"','""')+'"';const csv=[keys.map(cell).join(','),...visible.map(({record})=>keys.map(key=>cell(record[key])).join(','))].join('\r\n');const url=URL.createObjectURL(new Blob(['\ufeff'+csv],{type:'text/csv;charset=utf-8'}));const link=document.createElement('a');link.href=url;link.download='ai-benefits-selected.csv';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);});
    if(!root.dataset.preview){window.addEventListener('popstate',()=>{restore();showView(location.search?'collection':'benefits',false);openHash();});window.addEventListener('hashchange',openHash);restore();showView(location.search?'collection':'benefits',false);openHash();}else{apply(false);showView('benefits',false);}
    const scale=JSON.parse($('#scale-data').textContent),buttons=[...root.querySelectorAll('.ab-grade')];
    buttons.forEach(button=>button.addEventListener('click',()=>{const grade=scale.grades.find(g=>g[0]===Number(button.dataset.grade));buttons.forEach(other=>other.setAttribute('aria-pressed',String(other===button)));$('#grade-title').textContent=`${grade[0]===0?'0':'−'+Math.abs(grade[0])} · ${grade[1]}`;$('#grade-description').textContent=grade[2];}));
    $('#color-view').addEventListener('change',event=>{const mode=event.target.value;buttons.forEach((button,i)=>button.querySelector('.ab-swatch').style.background=scale.palette.colors[mode][i]);$('#simulation-note').hidden=mode==='normal';});
    root.database={showView,scale,getState:()=>({view:currentView,caseId:selected,query:search.value,beneficiary:stakeholder.value,benefit:benefit.value,order:sort.value,colorView:$('#color-view').value}),restoreState:state=>{search.value=state.query||'';stakeholder.value=valid(stakeholder,state.beneficiary||'');benefit.value=valid(benefit,state.benefit||'');sort.value=valid(sort,state.order||'record');apply(false);if(visible.some(e=>e.record.id===state.caseId))select(state.caseId,false);showView(state.view||'benefits',false);$('#color-view').value=valid($('#color-view'),state.colorView||'normal');$('#color-view').dispatchEvent(new Event('change'));}};
  }
  if(root.dataset.page==='sources'){
    const labels={tierA:'Episode lead',clinical:'Clinical literature',feeder:'Source collection',aim:'OECD monitor lead'};
    const search=$('#search'),group=$('#lead-group');let records=[],page=1;const pageSize=25;
    const node=(tag,text,className)=>{const n=document.createElement(tag);n.textContent=text;if(className)n.className=className;return n;};
    function render(writeURL=true){
      const filtered=records.filter(r=>(!group.value||r.source_group===group.value)&&matches(JSON.stringify(r),search.value));const pages=Math.max(1,Math.ceil(filtered.length/pageSize));page=Math.max(1,Math.min(page,pages));
      $('#lead-count').textContent=`${filtered.length} of ${records.length} leads · verification pending`;
      const fragment=document.createDocumentFragment();
      filtered.slice((page-1)*pageSize,page*pageSize).forEach(r=>{
        const article=node('article','','ab-lead');article.id=r.id;
        const ref=node('div',r.id,'ab-ref');ref.append(node('span',labels[r.source_group]||r.source_group,'ab-secondary'));
        const body=node('div','');body.append(node('h2',r.title));
        if(r.outcome)body.append(node('p',r.outcome));
        if(r.system&&r.system!=='—')body.append(node('p',r.system));
        const review=node('dl','','ab-lead-review');
        if(r.ai_attribution_status){
          review.append(node('dt','AI attribution'),node('dd',r.ai_attribution_status==='pending'?'Not yet established; confirm that the reported intervention involved AI.':r.ai_attribution_status));
        }
        if(r.verification_task)review.append(node('dt','To verify'),node('dd',r.verification_task));
        if(review.childElementCount)body.append(review);
        if(r.screening_rationale){
          const notes=node('details','','ab-lead-screening');
          notes.append(node('summary','Screening rationale'),node('p',r.screening_rationale));body.append(notes);
        }
        const links=node('div','','ab-lead-links');
        r.source_urls.forEach(href=>{try{
          const url=new URL(href);if(!['https:','http:'].includes(url.protocol))return;
          const label=url.hostname.replace(/^www\./,'')==='oecd.ai'?'OECD monitor entry':url.hostname.replace(/^www\./,'');
          const a=node('a',label+' ↗');a.href=url.href;links.append(a);
        }catch{}});
        article.append(ref,body,links);fragment.append(article);
      });
      if(!filtered.length){const empty=node('div','','ab-empty');empty.append(node('h2','No matching leads'),node('p','Try another term or source group.'));fragment.append(empty);}$('#lead-list').replaceChildren(fragment);$('#page-status').textContent=`${page} / ${pages}`;$('#previous').disabled=page===1;$('#next').disabled=page>=pages;$('#pagination').hidden=!filtered.length;if(writeURL)updateURL({q:search.value.trim(),group:group.value,page:page===1?'':String(page)});
    }
    function restore(){const p=new URLSearchParams(location.search);search.value=p.get('q')||'';group.value=valid(group,p.get('group')||'');page=Math.max(1,parseInt(p.get('page')||'1',10)||1);render(false);}
    async function load(){try{const response=await fetch('../leads.json');if(!response.ok)throw new Error('Directory unavailable');records=(await response.json()).records;$('#lead-filters').hidden=false;$('#lead-reset').hidden=false;restore();}catch{$('#lead-count').textContent='The research queue could not load. The download remains available.';const retry=node('button','Try again');retry.type='button';retry.addEventListener('click',()=>{retry.remove();load();});$('#lead-list').replaceChildren(retry);}}
    $('#lead-filters').addEventListener('submit',e=>e.preventDefault());search.addEventListener('input',()=>{page=1;render();});group.addEventListener('change',()=>{page=1;render();});$('#lead-reset').addEventListener('click',()=>{search.value='';group.value='';page=1;render();});$('#previous').addEventListener('click',()=>{page--;render();$('#collection').scrollIntoView({behavior:'instant'});});$('#next').addEventListener('click',()=>{page++;render();$('#collection').scrollIntoView({behavior:'instant'});});window.addEventListener('popstate',restore);load();
  }
})();
