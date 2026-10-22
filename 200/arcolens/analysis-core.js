'use strict';
((scope) => {
  const DAY=86400000, stamp=d=>Date.parse(d+'T00:00:00Z'), dateString=t=>new Date(t).toISOString().slice(0,10);
  function points(series,date,view,from,through,includePartial){
    const result=series.points.filter(p=>p.year>=from&&p.year<=through).map(p=>({...p,value:view==='counts'?p.numerator:p.percent,status:'Complete year'}));
    const year=Number(date.slice(0,4)),partial=series.partial;
    if(includePartial&&partial&&year>=from&&year<=through&&partial.window.requested_years?.[0]===year)result.push({...partial,year,value:view==='counts'?partial.numerator:partial.percent,status:'Partial year; reporting incomplete',incomplete:true});
    return result;
  }
  const value=(row,view)=>view==='counts'?row.numerator:row.percent;
  const bounds=(projection,view)=>projection?.range?.bounds?.[view]||null;
  const rangeText=(projection,view)=>{const b=bounds(projection,view),step=projection?.range?.display_step||1,nearest=projection?.range?.display_rounding==='nearest',lower=nearest?Math.round:Math.floor,upper=nearest?Math.round:Math.ceil;if(!b)return '—';const lo=view==='counts'?(lower(b[0]/step)*step).toLocaleString('en-US'):String(Number(b[0].toFixed(1))),hi=view==='counts'?(upper(b[1]/step)*step).toLocaleString('en-US'):String(Number(b[1].toFixed(1)));return lo+(lo===hi?'':'–'+hi)+(view==='share'?'%':'');};
  const format=(v,view)=>v===null?'—':view==='counts'?Math.round(v).toLocaleString('en-US'):Number(v.toFixed(2))+'%';
  function layout(series,view,from,through,includePartial,includeForecast=true){
    const historical=series.historical.filter(r=>r.date>=from+'-12-31'&&r.date<=through+'-12-31');
    const year=Number(series.cutoff.slice(0,4)),current=includePartial&&from<=year&&through>=year?series.current:[];
    const observedCurrent=current.length?series.observed_current:[];
    const observed=[...historical,...observedCurrent];
    const projection=current.length&&includeForecast?series.projection:null;
    const reference=projection?series.points.at(-1):null;
    const anchors=series.points.filter(p=>p.year>=from&&p.year<=through);

    const first=observed[0]?.date||null,last=current.length?year+'-12-31':historical.at(-1)?.date;
    const left=70,right=740,top=38,bottom=226;
    const scaleProjection=current.length?series.projection:null;
    const max=Math.max(1,bounds(scaleProjection,view)?.[1]||0,...[...observed,...(scaleProjection?[scaleProjection]:[])].map(r=>value(r,view)||0)),step=10**Math.floor(Math.log10(max)),ceiling=view==='counts'?Math.ceil(max/step)*step:100;
    const y=v=>bottom-(v||0)/ceiling*(bottom-top);
    const x=d=>left+(stamp(d)-stamp(first))/Math.max(DAY,stamp(last)-stamp(first))*(right-left);
    return {historical,current,observedCurrent,observed,projection,reference,year,left,right,top,bottom,ceiling,y,hx:x,cx:x,first,last,anchors};
  }

  function headline(series,view,from,through){
    const m=layout(series,view,from,through,true,false),rows=m.observed;
    if(!rows.length)return null;
    const first=rows[0],last=rows.at(-1),firstValue=value(first,view),lastValue=value(last,view);
    const dateLabel=d=>new Date(stamp(d)).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric',timeZone:'UTC'});
    const startLabel=first.date.endsWith('-12-31')?first.date.slice(0,4):dateLabel(first.date);
    const endLabel=last.date.endsWith('-12-31')?last.date.slice(0,4):dateLabel(last.date);
    return {first:firstValue,last:lastValue,period:first.date===last.date?endLabel:startLabel+'–'+endLabel,measure:view==='counts'?'12-month record count':'12-month share of records',direction:firstValue===null||lastValue===null||firstValue===lastValue?'flat':lastValue>firstValue?'increase':'decrease'};
  }
  function svg(series,view,from,through,includePartial,includeForecast=true){
    const m=layout(series,view,from,through,includePartial,includeForecast),{historical,current,observed,projection,year,left,right,top,bottom,ceiling,y,hx,cx}=m;
    const uniformShare=series.id==='IT-C001'&&view==='share';
    if(!historical.length&&!current.length)return '<p>No records in the selected range.</p>';
    const esc=t=>String(t).replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;'),f=n=>n.toFixed(3);
    const summary=points(series,series.cutoff,view,from,through,includePartial).map(p=>p.year+(p.incomplete?' so far':'')+': '+format(p.value,view));
    if(current.length)summary.push('12 months through '+series.cutoff+': '+format(value(observed.at(-1),view),view));
    const modelRange=!!(projection?.range?.coverage_probability&&view==='counts'),coverage=modelRange?projection.range.coverage_probability*100+'%':'',rangeKind=modelRange?'central '+coverage+' model range':'scenario range';
    if(projection&&!uniformShare)summary.push(year+' year-end '+rangeKind+': '+rangeText(projection,view));
    const out=[`<svg viewBox="0 0 780 278" class="daily-chart" role="img" aria-label="${esc(summary.join('; '))}" data-daily-chart="${series.id}">`];
    for(const tick of [0,ceiling/2,ceiling])out.push(`<line x1="${left}" x2="${right}" y1="${f(y(tick))}" y2="${f(y(tick))}" class="daily-grid"/><text x="${left-8}" y="${f(y(tick)+4)}" text-anchor="end" class="axis-label">${view==='counts'?format(tick,view):tick+'%'}</text>`);
    function trace(rows,x,kind){let path='',active=false;for(const r of rows){const v=value(r,view);if(v===null){active=false;continue;}path+=(active?'H'+f(x(r.date))+'V'+f(y(v)):'M'+f(x(r.date))+','+f(y(v)));active=true;}out.push(`<path class="daily-trace daily-${kind}" data-daily-points="${rows.length}" d="${path}"/>`);}
    trace(observed,hx,'historical');
    for(const p of m.anchors){const x=hx(p.year+'-12-31'),v=value(p,view);out.push(`<circle cx="${f(x)}" cy="${f(y(v))}" r="3.8" class="daily-annual-dot"><title>${p.year}: ${format(v,view)}</title></circle><text x="${f(x)}" y="${bottom+23}" text-anchor="middle" class="axis-label">${p.year}</text>`);}
    if(current.length){
      const actual=value(observed.at(-1),view);
      if(actual!==null){const ox=cx(series.cutoff),oy=y(actual);out.push(`<circle cx="${f(ox)}" cy="${f(oy)}" r="4.5" class="daily-observed-dot" data-observed-value="${actual}"/>`);
        const b=bounds(projection,view);if(b&&!uniformShare){const low=y(b[0]),high=y(b[1]);out.push(`<g class="year-end-range" data-lower="${b[0]}" data-upper="${b[1]}" data-date="${year}-12-31"><title>${year} year-end ${rangeKind}: ${rangeText(projection,view)}</title><path class="forecast-fan" data-origin-date="${series.cutoff}" data-origin-value="${actual}" d="M${f(ox)},${f(oy)}L${right},${f(high)}L${right},${f(low)}Z"/></g>`);}
      }
      out.push(`<text x="${right}" y="${bottom+23}" text-anchor="middle" class="axis-label">${year}</text>`);
    }
    out.push('</svg>');
    const cutoffLabel=new Date(stamp(series.cutoff)).toLocaleDateString('en-US',{month:'short',day:'numeric',timeZone:'UTC'});
    if(current.length&&value(observed.at(-1),view)!==null){
      if(uniformShare){out.push('<dl class="daily-endpoints is-single" aria-label="Share of all records"><div><dt>Share of records</dt><dd>100%</dd></div></dl>');return out.join('');}
      const endpoint=projection?`<dt>${year} year-end range${modelRange?' (central '+coverage+')':''}</dt><dd>${view==='counts'?'n ≈ ':''}${rangeText(projection,view)}</dd>`:`<dt>${year} so far</dt><dd>${format(value(current.at(-1),view),view)}</dd>`;
      out.push(`<dl class="daily-endpoints" aria-label="Current-year chart points"><div><dt>12 months to ${cutoffLabel}</dt><dd>${format(value(observed.at(-1),view),view)}</dd></div><div>${endpoint}</div></dl>`);
    }
    return out.join('');
  }
  function bindFigure(figure,series,view,from,through,includePartial,includeForecast=true){
    const chart=figure.querySelector('svg.daily-chart');if(!chart)return;
    const m=layout(series,view,from,through,includePartial,includeForecast),all=[...m.observed,...(m.projection&&!(series.id==='IT-C001'&&view==='share')?[{...m.projection,window:'estimate'}]:[])];
    let index=0;figure.setAttribute('tabindex','0');figure.setAttribute('aria-label','Explore daily chart. Use left and right arrows for dates, Shift for months, Home and End for endpoints.');
    let readout=figure.querySelector('.daily-readout');if(!readout){readout=document.createElement('figcaption');readout.className='daily-readout';figure.append(readout);}readout.textContent='';
    const ns='http://www.w3.org/2000/svg',cursor=document.createElementNS(ns,'line');cursor.setAttribute('class','daily-cursor');cursor.setAttribute('y1',m.top);cursor.setAttribute('y2',m.bottom);cursor.style.display='none';chart.append(cursor);
    function show(i){index=Math.max(0,Math.min(all.length-1,i));const r=all[index];if(!r)return;const x=r.window==='preceding_12_months'?m.hx(r.date):m.cx(r.date);cursor.setAttribute('x1',x);cursor.setAttribute('x2',x);cursor.style.display='';
      const dateLabel=new Date(stamp(r.date)).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric',timeZone:'UTC'});
      const amount=r.window==='estimate'?(view==='counts'?'n ≈ ':'')+rangeText(r,view):format(value(r,view),view)+(view==='counts'?' records':'');
      const dateNode=document.createElement('time'),valueNode=document.createElement('strong');
      dateNode.dateTime=r.date;dateNode.textContent=dateLabel;valueNode.textContent=amount;
      readout.replaceChildren(dateNode,valueNode);

    }
    chart.onpointermove=event=>{const rect=chart.getBoundingClientRect(),x=(event.clientX-rect.left)/rect.width*780;
      const fraction=Math.max(0,Math.min(1,(x-m.left)/(m.right-m.left))),target=stamp(m.first)+fraction*(stamp(m.last)-stamp(m.first));
      let nearest=0,distance=Infinity;all.forEach((r,i)=>{const d=Math.abs(stamp(r.date)-target);if(d<distance){nearest=i;distance=d;}});show(nearest);
    };
    chart.onpointerleave=()=>{readout.replaceChildren();cursor.style.display='none';};
    figure.onblur=()=>{readout.replaceChildren();cursor.style.display='none';};
    figure.onkeydown=event=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;event.preventDefault();readout.setAttribute('aria-live','polite');show(event.key==='Home'?0:event.key==='End'?all.length-1:index+(event.key==='ArrowRight'?1:-1)*(event.shiftKey?30:1));};
  }
  function csv(rows){return rows.map(row=>row.map(v=>'"'+String(v??'').replaceAll('"','""')+'"').join(',')).join('\r\n');}
  const api={points,csv,layout,headline,svg,bindFigure,value,format,rangeText};if(typeof module!=='undefined')module.exports=api;else scope.ARCOLENS_ANALYSIS=api;
})(typeof window==='undefined'?{}:window);
