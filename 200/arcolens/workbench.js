'use strict';
(() => {
  const data=window.ARCOLENS_WORKBENCH, core=window.ARCOLENS_ANALYSIS, main=document.querySelector('main');
  if(!data||!main)return;
  const address=new URL(location.href), page=address.pathname.split('/').pop()||'OPEN_REVIEW.html';
  const item=data.items.find(entry=>entry.page===page), extras=[], charts=[];
  let mode=address.searchParams.get('mode');
  try{mode ||= localStorage.getItem('arcolens.mode');}catch(_){/* URL fallback. */}
  if(mode==='monitor')mode='workbench';
  function el(tag,text,attributes={}){const node=document.createElement(tag);if(text!==undefined)node.textContent=text;Object.entries(attributes).forEach(([key,value])=>node.setAttribute(key,value));return node;}
  function extra(node){node.classList.add('workbench-only');node.hidden=mode!=='workbench';extras.push(node);return node;}
  function label(text,control){const node=el('label',text);node.append(control);return node;}
  function select(name,options,value){const node=el('select',undefined,{'aria-label':name});options.forEach(([key,text])=>node.append(el('option',text,{value:key})));node.value=value;return node;}
  function feedback(text){const node=document.querySelector('#copy-feedback');if(node){node.textContent=text;node.setAttribute('role','status');}}
  async function copy(text){try{await navigator.clipboard.writeText(text);feedback('Copied.');}catch(_){feedback('Copy is unavailable here. Export evidence to save the same information.');}}
  function download(name,content,type){const url=URL.createObjectURL(new Blob([content],{type})),link=el('a',undefined,{href:url,download:name});document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);feedback('Export created.');}
  function button(text,action){const node=el('button',text,{type:'button'});node.addEventListener('click',action);return node;}
  function copyButton(action){const node=button('',action);node.className='chart-copy';node.setAttribute('aria-label','Copy chart settings');node.title='Copy chart settings';node.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="8" y="8" width="12" height="13" rx="2"/><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h3"/></svg>';return node;}
  function modeURL(href){const url=new URL(href,location.href);url.searchParams.set('mode',mode==='workbench'?'monitor':'review');return url.href;}
  function applyMode(value){
    mode=value==='workbench'||value==='monitor'?'workbench':'review';document.body.dataset.analysisMode=mode;
    document.querySelectorAll('button[data-analysis-mode]').forEach(node=>node.setAttribute('aria-pressed',String(node.dataset.analysisMode===mode)));
    extras.forEach(node=>node.hidden=mode!=='workbench');charts.forEach(chart=>chart.apply(mode));
    document.querySelectorAll('[data-monitor-addition]').forEach(node=>{node.hidden=mode!=='workbench';node.inert=mode!=='workbench';});
    main.querySelectorAll('[data-intro-mode]').forEach(node=>{node.hidden=node.dataset.introMode!==mode;});
    if(main.querySelector('.dashboard-priorities')){const heading=main.querySelector('.dashboard-head h1');if(heading){heading.textContent=mode==='workbench'?'What needs attention this month?':'What does the data show?';document.title=heading.textContent+' | Arcolens';}}
    const url=new URL(location.href);url.searchParams.set('mode',mode==='workbench'?'monitor':'review');
    try{history.replaceState(null,'',url);localStorage.setItem('arcolens.mode',mode);}catch(_){/* Controls work without storage. */}
    document.querySelectorAll('a[href]').forEach(link=>{if(link.hasAttribute('data-preserve-mode'))return;const target=new URL(link.href,location.href);if(target.origin===location.origin&&target.pathname.startsWith(new URL('.',location.href).pathname)&&target.pathname.endsWith('.html')&&!target.pathname.includes('/history/')&&!target.pathname.includes('/downloads/'))link.href=modeURL(link.href);});
  }
  document.querySelectorAll('button[data-analysis-mode]').forEach(node=>node.addEventListener('click',()=>{
    const next=node.dataset.analysisMode;
    if(next===mode)return;
    applyMode(next);
  }));

  if(!main.querySelector('.dashboard-priorities')){
    const state=data.monitoring,context=extra(el('aside',undefined,{class:'monitor-context','aria-label':'Monthly monitoring'}));
    context.append(el('strong','Monthly monitoring'));
    if(state?.configured)context.append(el('span','Next check: '+state.next_label));
    else context.append(el('span','Schedule not configured'));
    context.append(el('a','Check history',{href:'monthly.html'}));
    const heading=main.querySelector('.page-head,header');if(heading)heading.after(context);else main.prepend(context);
  }

  // Add search to the existing page, without replacing any dashboard or article.
  if(!item){
    const tools=el('div',undefined,{class:'analysis-tools analysis-global-tools'}),query=el('input',undefined,{type:'search',placeholder:'Search insights','aria-label':'Search insights'});
    const searchLabel=label('Search insights',query);searchLabel.className='analysis-search';tools.append(searchLabel);
    const type=select('Show results',[['all','All results'],['candidate','Findings'],['claim','Published statements']],'all');tools.append(label('Show',type));
    const status=select('Assessment',[['all','All assessments'],...Array.from(new Set(data.items.filter(x=>x.kind==='claim').map(x=>x.status))).sort((a,b)=>['Supported','Unresolved','Update needed','Unsupported'].indexOf(a)-['Supported','Unresolved','Update needed','Unsupported'].indexOf(b)).map(x=>[x,x])],'all');tools.append(label('Assessment',status));
    const host=main.querySelector('article')||main,heading=host.querySelector('.page-intro')||host.querySelector('header,.page-head');if(heading)heading.after(tools);else host.prepend(tools);
    const results=el('ul',undefined,{class:'analysis-results','aria-live':'polite'});tools.after(results);
    const rows=[...main.querySelectorAll('tr')].map(row=>({row,entry:data.items.find(entry=>row.querySelector('a[href*="'+entry.page+'"]'))})).filter(x=>x.entry);
    function search(){
      const phrase=query.value.trim().toLowerCase();
      const pageIDs=rows.length?new Set(rows.map(x=>x.entry.id)):null;
      const matches=data.items.filter(entry=>(!pageIDs||pageIDs.has(entry.id))&&(type.value==='all'||entry.kind===type.value)&&(status.value==='all'||entry.status===status.value)&&(entry.title+' '+entry.id+' '+entry.wording).toLowerCase().includes(phrase));
      const ids=new Set(matches.map(x=>x.id));rows.forEach(({row,entry})=>row.classList.toggle('wb-filtered',!ids.has(entry.id)));results.replaceChildren();
      if(phrase||type.value!=='all'||status.value!=='all'){
        if(!matches.length)results.append(el('li','No matching findings or statements.'));
        if(!rows.length)matches.forEach(entry=>{const li=el('li');li.append(el('a',entry.title,{href:modeURL(entry.page)}),el('small',entry.id+' — '+entry.status));results.append(li);});
      }
    }
    query.addEventListener('input',search);type.addEventListener('change',search);status.addEventListener('change',search);
  }

  function installChart(host,entry){
    const series=data.annual[entry.id], figures=[...host.querySelectorAll('figure.finding-chart')];if(!series||!figures.length)return;
    const tools=el('div',undefined,{class:'analysis-tools analysis-chart-tools'});
    const fields=el('div',undefined,{class:'chart-fields'}),actions=el('div',undefined,{class:'chart-actions'});tools.append(fields,actions);
    const years=series.points.map(point=>point.year),currentYear=Number(data.analysis_date.slice(0,4));if(series.partial)years.push(currentYear);
    const choices=years.map(year=>[String(year),String(year)]);
    const view=select('Chart values',[['counts','Record counts'],['share','Share of records']],series.default_view),start=select('Start year',choices,String(years[0])),end=select('End year',choices,String(years.at(-1)));
    fields.append(label('View',view),extra(label('From',start)),extra(label('Through',end)));figures.at(-1).after(tools);
    const readout=el('p',undefined,{class:'analysis-readout','aria-live':'polite'});tools.after(readout);
    const ledger=el('div',undefined,{class:'analysis-ledger','aria-label':'Calendar-year figures'});readout.after(ledger);
    function updateLedger(){
      const partial=true;
      ledger.replaceChildren();
      displayed(partial).forEach(point=>{
        const cell=el('div',undefined,{class:'analysis-year'+(point.incomplete?' is-partial':'')});
        cell.append(el('span',String(point.year)+(point.incomplete?' so far':'')),el('strong',(point.value===null?'—':view.value==='share'?point.value.toFixed(1)+'%':Math.round(point.value).toLocaleString())),el('small',view.value==='share'?point.numerator.toLocaleString()+' / '+point.denominator.toLocaleString()+' records':point.incomplete?point.numerator.toLocaleString()+' observed':'records'));
        ledger.append(cell);
      });
    }
    function activeWindow(){return mode==='workbench'?[Number(start.value),Number(end.value)]:[years[0],years.at(-1)];}
    function displayed(includePartial){const [from,through]=activeWindow();return core.points(series,data.analysis_date,view.value,from,through,includePartial);}
    function bind(figure){
      const [from,through]=activeWindow();core.bindFigure(figure,series,view.value,from,through,true,mode==='workbench');
    }
    function renderFigure(figure,includePartial){
      const [from,through]=activeWindow();figure.innerHTML=core.svg(series,view.value,from,through,includePartial,mode==='workbench');
      bind(figure);
    }
    function refresh(){
      if(Number(start.value)>Number(end.value))end.value=start.value;
      updateLedger();
      figures.forEach(figure=>renderFigure(figure,true));
      const reading=host.querySelector('.trend-reading'),[from,through]=activeWindow(),headline=core.headline(series,view.value,from,through);
      const trendButton=document.querySelector('[data-trend="'+entry.id+'"]');
      if(trendButton)trendButton.dataset.trendDirection=entry.id==='IT-C001'?'neutral':headline?.direction||'flat';
      if(reading&&headline){
        const {first,last,direction}=headline,values=reading.querySelector('.trend-values'),measure=reading.querySelector('.measure-label'),period=reading.querySelector('.period-label');
        if(values){
          values.replaceChildren();values.removeAttribute('aria-label');
          if(first===last)values.append(el('strong',core.format(last,view.value)));
          else {
            values.append(el('span',core.format(first,view.value)),el('span',direction==='increase'?'↗':direction==='decrease'?'↘':'→',{class:'value-arrow '+direction,'aria-hidden':'true'}),el('strong',core.format(last,view.value)));
            values.setAttribute('aria-label',core.format(first,view.value)+' '+(direction==='increase'?'increased to':direction==='decrease'?'decreased to':'to')+' '+core.format(last,view.value));
          }
        }
        if(measure)measure.textContent=headline.measure;
        if(period)period.textContent=headline.period;
      }
      readout.textContent='';
    }
    [view,start,end].forEach(control=>control.addEventListener('change',()=>{host.classList.add('analysis-custom-chart');refresh();}));
    actions.append(button('Export annual data',()=>{const partial=true,points=displayed(partial);download(entry.id+'-chart.csv',core.csv([['Year','Status','View','Calendar-year value','Observed numerator','Observed denominator'],...points.map(p=>[p.year,p.status,view.value,p.value,p.numerator,p.denominator])]),'text/csv');}));
    actions.append(extra(button('Export daily data',()=>{
      const include=true;
      const m=core.layout(series,view.value,Number(start.value),Number(end.value),include);
      const rows=[...m.observed,...m.current,...(m.projection?[{...m.projection,window:m.projection.status}]:[])];
      download(entry.id+'-daily.csv',core.csv([['Date','Window','Window start','Chart value','View','Numerator','Denominator','Records dated this day','All records dated this day','Year-end lower bound','Year-end upper bound','Range method','Nominal model coverage','Wider lower bound','Wider upper bound','Wider nominal model coverage'],...rows.map(r=>[r.date,r.window,r.window_start,core.value(r,view.value),view.value,r.numerator,r.denominator,r.daily_numerator,r.daily_denominator,r.range?.bounds?.[view.value]?.[0],r.range?.bounds?.[view.value]?.[1],r.range?.method,r.range?.coverage_probability,r.range?.wider_interval?.bounds?.[view.value]?.[0],r.range?.wider_interval?.bounds?.[view.value]?.[1],r.range?.wider_interval?.coverage_probability])]),'text/csv');
    })));
    actions.append(copyButton(()=>{const [from,through]=activeWindow();copy(JSON.stringify({chart:entry.chart,exploratory_view:view.value,curve_window:'preceding_12_calendar_months',annual_table_window:'calendar_year; current year through export date',forecast:mode==='workbench',from,through},null,2));}));
    charts.push({apply(){refresh();}});
  }
  document.querySelectorAll('[data-trend-pane]').forEach(host=>{const entry=data.items.find(x=>x.id===host.dataset.trendPane);if(entry)installChart(host,entry);});
  if(item)installChart(main,item);

  if(item){
    const section=extra(el('section',undefined,{class:'content-section analysis-evidence'}));section.append(el('h2','Calculation evidence'));
    const tools=el('div',undefined,{class:'analysis-tools'}),query=el('input',undefined,{type:'search',placeholder:'Year or calculation','aria-label':'Search calculation evidence'});
    const payload=()=>({run_id:data.run_id,input_sha256:data.input_sha256,item,calculations:Object.fromEntries(item.evidence.map(id=>[id,data.measures[id]]))});
    tools.append(label('Find a calculation',query),button('Export evidence',()=>download(item.id+'-evidence.json',JSON.stringify(payload(),null,2),'application/json')),copyButton(()=>copy(JSON.stringify(item.chart,null,2))));section.append(tools);
    const scroll=el('div',undefined,{class:'table-scroll',tabindex:'0'}),table=el('table'),head=el('thead'),header=el('tr');['Calculation','Numerator','Denominator','Share','Unit','Incident IDs'].forEach(text=>header.append(el('th',text,{scope:'col'})));head.append(header);table.append(head);
    const body=el('tbody');table.append(body);scroll.append(table);section.append(scroll);const count=el('p',undefined,{class:'analysis-readout','aria-live':'polite'});section.append(count);
    function filter(){const matches=item.evidence.filter(id=>id.toLowerCase().includes(query.value.toLowerCase()));body.replaceChildren();matches.forEach(id=>{const m=data.measures[id],row=el('tr');[id,m.numerator,m.denominator,m.percent===null?'—':m.percent.toFixed(2)+'%',m.definition.denominator].forEach(value=>row.append(el('td',String(value))));const cell=el('td');cell.append(el('a','Open IDs',{href:'downloads/run/'+m.numerator_ids_ref}));row.append(cell);body.append(row);});count.textContent=matches.length+' of '+item.evidence.length+' calculations';}
    query.addEventListener('input',filter);filter();(main.querySelector('article')||main).append(section);
  }
  applyMode(mode);
})();
