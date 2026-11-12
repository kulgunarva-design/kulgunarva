(() => {
 const copy={
  ru:{navEvents:'Мероприятия',navVenice:'Нарвская Венеция ↗',contactLink:'Собрания, субботники и встречи — в разделе «Мероприятия» →',title:'Мероприятия кооператива',lead:'Собрания, субботники, работы по благоустройству и другие встречи членов кооператива.',upcoming:'Предстоящие мероприятия',past:'Прошедшие мероприятия',empty:'Новых объявлений пока нет.',emptyPast:'Прошедших мероприятий пока нет.',date:'Дата',time:'Время',place:'Место',tba:'Будет объявлено',read:'Подробнее',pageTitle:'Мероприятия кооператива — Кулгу, Нарва'},
  et:{navEvents:'Sündmused',navVenice:'Narva Veneetsia ↗',contactLink:'Koosolekud, talgud ja kohtumised leiad sündmuste lehelt →',title:'Ühistu sündmused',lead:'Koosolekud, talgud, heakorratööd ja muud ühistu liikmete kohtumised.',upcoming:'Tulevased sündmused',past:'Toimunud sündmused',empty:'Uusi teateid veel ei ole.',emptyPast:'Toimunud sündmusi veel ei ole.',date:'Kuupäev',time:'Kellaaeg',place:'Koht',tba:'Täpsustamisel',read:'Loe lähemalt',pageTitle:'Ühistu sündmused — Kulgu, Narva'},
  en:{navEvents:'Events',navVenice:'Narva Venice ↗',contactLink:'Meetings, clean-up days and gatherings — visit Events →',title:'Cooperative events',lead:'Meetings, clean-up days, maintenance work and other gatherings for cooperative members.',upcoming:'Upcoming events',past:'Past events',empty:'No new notices yet.',emptyPast:'No past events yet.',date:'Date',time:'Time',place:'Location',tba:'To be announced',read:'Read more',pageTitle:'Cooperative events — Kulgu, Narva'}
 };
 function update(){
  const lang=document.documentElement.lang,t=copy[lang]||copy.ru;
  document.querySelectorAll('[data-coop]').forEach(e=>{e.textContent=t[e.dataset.coop]||'';});
  const upcoming=document.getElementById('coop-upcoming'),past=document.getElementById('coop-past');
  if(!upcoming||!past)return;
  document.title=t.pageTitle;
  const local=v=>typeof v==='object'&&v!==null?(v[lang]||v.ru||Object.values(v)[0]||''):String(v||'');
  const today=new Intl.DateTimeFormat('sv-SE',{timeZone:'Europe/Tallinn',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
  const items=Array.isArray(window.COOP_EVENTS)?window.COOP_EVENTS:[];
  function render(root,list,empty){
   root.replaceChildren();
   if(!list.length){const p=document.createElement('p');p.className='coop-empty';p.textContent=empty;root.append(p);return;}
   list.forEach(item=>{
    const card=document.createElement('article');card.className='coop-event-card';card.id=item.id;
    const h=document.createElement('h3');h.textContent=local(item.title);card.append(h);
    const dl=document.createElement('dl');
    const date=item.date?new Intl.DateTimeFormat({ru:'ru-RU',et:'et-EE',en:'en-GB'}[lang]||'ru-RU',{day:'numeric',month:'long',year:'numeric'}).format(new Date(item.date+'T12:00:00')):(item.year?item.year+' · '+t.tba:t.tba);
    [[t.date,date],[t.time,item.time||t.tba],[t.place,local(item.location)||t.tba]].forEach(([label,value])=>{const dt=document.createElement('dt'),dd=document.createElement('dd');dt.textContent=label;dd.textContent=value;dl.append(dt,dd);});card.append(dl);
    const details=document.createElement('details'),summary=document.createElement('summary');summary.textContent=t.read;details.append(summary);local(item.body).split('\n\n').filter(Boolean).forEach(text=>{const p=document.createElement('p');p.textContent=text;details.append(p);});card.append(details);root.append(card);
   });
  }
  render(upcoming,items.filter(e=>!e.date||e.date>=today).sort((a,b)=>(a.date||`${a.year||9999}-12-31`).localeCompare(b.date||`${b.year||9999}-12-31`)),t.empty);
  render(past,items.filter(e=>e.date&&e.date<today).sort((a,b)=>b.date.localeCompare(a.date)),t.emptyPast);
 }
 document.addEventListener('DOMContentLoaded',update);
 document.querySelectorAll('.lang-btn').forEach(button=>button.addEventListener('click',()=>queueMicrotask(update)));
 new MutationObserver(update).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
 update();
})();
