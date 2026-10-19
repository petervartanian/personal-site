'use strict';
(() => {
  const $ = (selector) => document.querySelector(selector);
  const normalize = (value) => String(value).normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const termsMatch = (value, query) => normalize(query).trim().split(/\s+/).every(term => normalize(value).includes(term));
  const urlState = (values, clearHash = false) => {
    const url = new URL(location.href);
    for (const [key, value] of Object.entries(values)) value ? url.searchParams.set(key, value) : url.searchParams.delete(key);
    if (clearHash) url.hash = '';
    history.replaceState(null, '', url);
  };
  const validValue = (select, value) => [...select.options].some(option => option.value === value) ? value : select.options[0].value;
  if (document.body.dataset.page === 'records') {
    const data = JSON.parse($('#records-data').textContent);
    const entries = data.records.map(record => ({record, element: document.getElementById(record.id), search: JSON.stringify(record)}));
    const search = $('#search'), sector = $('#sector'), category = $('#category'), sort = $('#sort');
    let visible = entries;
    function apply(updateURL = true, preserveRecordHash = false) {
      visible = entries.filter(entry => termsMatch(entry.search, search.value) && (!sector.value || entry.record.sector === sector.value) && (!category.value || entry.record.category === category.value));
      const ordered = [...entries].sort((a,b) => sort.value === 'record' ? a.record.record_number.localeCompare(b.record.record_number) : (sort.value === 'newest' ? -1 : 1) * a.record.publication_date.localeCompare(b.record.publication_date));
      const visibleSet = new Set(visible);
      ordered.forEach(entry => { entry.element.hidden = !visibleSet.has(entry); $('#records').append(entry.element); });
      visible = ordered.filter(entry => visibleSet.has(entry));
      $('#result-count').textContent = `${visible.length} of ${entries.length} records · all grades unassessed`;
      $('#empty-state').hidden = visible.length !== 0;
      $('#export-view').disabled = visible.length === 0;
      if (updateURL) urlState({q:search.value.trim(), sector:sector.value, outcome:category.value, order:sort.value==='record'?'':sort.value}, !preserveRecordHash && entries.some(entry => '#'+entry.record.id === location.hash));
    }
    function restore() {
      const params = new URLSearchParams(location.search);
      search.value = params.get('q') || '';
      sector.value = validValue(sector, params.get('sector') || '');
      category.value = validValue(category, params.get('outcome') || '');
      sort.value = validValue(sort, params.get('order') || 'record');
      apply(false);
    }
    function reset() { search.value=''; sector.value=''; category.value=''; sort.value='record'; apply(); }
    $('#filters').hidden = false; $('#filter-actions').hidden = false;
    $('#filters').addEventListener('submit', event => event.preventDefault());
    search.addEventListener('input', () => apply());
    [sector, category, sort].forEach(control => control.addEventListener('change', () => apply()));
    $('#reset').addEventListener('click', reset); $('#empty-reset').addEventListener('click', () => {reset();search.focus();});
    $('#export-view').addEventListener('click', () => {
      const keys = Object.keys(data.records[0]);
      const cell = value => '"' + String(value == null ? '' : typeof value === 'object' ? JSON.stringify(value) : value).replaceAll('"','""') + '"';
      const csv = [keys.map(cell).join(','), ...visible.map(({record}) => keys.map(key=>cell(record[key])).join(','))].join('\r\n');
      const url = URL.createObjectURL(new Blob(['\ufeff' + csv], {type:'text/csv;charset=utf-8'}));
      const a = document.createElement('a'); a.href=url; a.download='ai-benefits-selected-records.csv'; a.click(); setTimeout(()=>URL.revokeObjectURL(url),1000);
    });
    function openHash() {
      let id; try { id=decodeURIComponent(location.hash.slice(1)); } catch { return; }
      const entry=entries.find(item=>item.record.id===id);
      if (!entry) return;
      if (entry.element.hidden) { search.value='';sector.value='';category.value='';sort.value='record';apply(true,true); }
      entry.element.open=true;
      requestAnimationFrame(()=>entry.element.scrollIntoView({block:'start',behavior:'instant'}));
    }
    window.addEventListener('hashchange',openHash);
    window.addEventListener('popstate',()=>{restore();openHash();});
    restore();openHash();
    const scale=JSON.parse($('#scale-data').textContent);
    const gradeButtons=[...document.querySelectorAll('.grade')];
    gradeButtons.forEach(button=>button.addEventListener('click',()=>{
      const grade=scale.grades.find(item=>item[0]===Number(button.dataset.grade));
      gradeButtons.forEach(other=>other.setAttribute('aria-pressed',String(other===button)));
      const signed=grade[0]<0?'−'+Math.abs(grade[0]):grade[0]>0?'+'+grade[0]:'0';
      $('#grade-title').textContent=`${signed} · ${grade[1]}`;
      $('#grade-description').textContent=grade[2];
    }));
    $('#color-view').addEventListener('change',event=>{
      const mode=event.target.value;
      gradeButtons.forEach((button,i)=>button.querySelector('.swatch').style.backgroundColor=scale.palette.colors[mode][i]);
      $('#simulation-note').hidden=mode==='normal';
    });
  }
  if (document.body.dataset.page === 'sources') {
    const labels={tierA:'Curated lead',clinical:'Clinical lead',feeder:'Source collection',exemplar:'Harm comparison',aim:'OECD monitor lead'};
    const search=$('#search'),group=$('#lead-group');
    let entries=[],page=1;
    const pageSize=25;
    const node=(tag,text,className)=>{const el=document.createElement(tag);el.textContent=text;if(className)el.className=className;return el;};
    function render(updateURL=true) {
      const filtered=entries.filter(r=>(!group.value||r.source_group===group.value)&&termsMatch(JSON.stringify(r),search.value));
      const pages=Math.max(1,Math.ceil(filtered.length/pageSize));page=Math.max(1,Math.min(page,pages));
      $('#lead-count').textContent=`${filtered.length.toLocaleString()} of ${entries.length.toLocaleString()} research leads · awaiting reassessment`;
      const fragment=document.createDocumentFragment();
      filtered.slice((page-1)*pageSize,page*pageSize).forEach(r=>{
        const article=node('article','','lead');article.id=r.id;
        const ref=node('div','');ref.append(node('span',r.id,'record-no'),node('small',labels[r.source_group]||r.source_group));
        const body=node('div','');body.append(node('h3',r.title));
        if(r.system)body.append(node('p',r.system));
        if(r.outcome)body.append(node('p',r.outcome));
        if(r.outcome_location)body.append(node('p',`Reported location: ${r.outcome_location}`));
        const links=node('div','','lead-links');
        r.source_urls.forEach((href,i)=>{try {const url=new URL(href);if(!['https:','http:'].includes(url.protocol))return;const a=node('a',`${url.hostname.replace(/^www\./,'')} ↗`);a.href=url.href;a.setAttribute('aria-label',`Source ${i+1} for ${r.id}: ${url.hostname}`);links.append(a);}catch{/* Invalid source URLs remain in the original export, never as executable links. */}});
        body.append(links);article.append(ref,body);fragment.append(article);
      });
      if(!filtered.length){const empty=node('div','','empty');empty.append(node('h3','No matching research leads'),node('p','Try a broader term or a different source group.'));fragment.append(empty);}
      $('#lead-list').replaceChildren(fragment);
      $('#page-status').textContent=`${page} / ${pages}`;$('#previous').disabled=page===1;$('#next').disabled=page>=pages;
      $('#pagination').hidden=filtered.length===0;
      if(updateURL)urlState({q:search.value.trim(),group:group.value,page:page===1?'':String(page)});
    }
    function restore(){const params=new URLSearchParams(location.search);search.value=params.get('q')||'';group.value=validValue(group,params.get('group')||'');page=Math.max(1,parseInt(params.get('page')||'1',10)||1);render(false);}
    async function load(){
      try{
        const response=await fetch('../leads.json');if(!response.ok)throw new Error('Request failed');
        const payload=await response.json();entries=payload.records;
        $('#lead-filters').hidden=false;$('#lead-reset').hidden=false;restore();
      }catch{
        $('#lead-count').textContent='The directory could not load. You can still download the data above.';
        const retry=node('button','Try again','text-button');retry.type='button';retry.addEventListener('click',()=>{retry.remove();load();});$('#lead-list').replaceChildren(retry);
      }
    }
    $('#lead-filters').addEventListener('submit',event=>event.preventDefault());
    search.addEventListener('input',()=>{page=1;render();});group.addEventListener('change',()=>{page=1;render();});
    $('#lead-reset').addEventListener('click',()=>{search.value='';group.value='';page=1;render();});
    $('#previous').addEventListener('click',()=>{page--;render();$('#collection').scrollIntoView({block:'start',behavior:'instant'});});
    $('#next').addEventListener('click',()=>{page++;render();$('#collection').scrollIntoView({block:'start',behavior:'instant'});});
    window.addEventListener('popstate',restore);load();
  }
})();
