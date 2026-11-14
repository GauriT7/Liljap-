/* Extra trip operations, live weather and memory tools for little japan. */
(() => {
  const $ = s => document.querySelector(s);
  const $$ = s => [...document.querySelectorAll(s)];
  const KEY = 'littlejapan_';
  const get = (k, fallback) => { try { return JSON.parse(localStorage.getItem(KEY+k)) ?? fallback; } catch { return fallback; } };
  const set = (k, v) => { try { localStorage.setItem(KEY+k, JSON.stringify(v)); } catch { toast('Storage is full. Export a backup and remove a few large photos.'); } };
  const toast = msg => { const el=$('#toast'); if(!el) return; el.textContent=msg; el.classList.add('show'); setTimeout(()=>el.classList.remove('show'),2600); };
  const open = url => window.open(url, '_blank', 'noopener');

  const bookingItems = [
    ['FUJI EXCURSION · 9 Dec','Train · Shinjuku → Kawaguchiko','https://e.fujikyu-railway.jp/fujikaiyuu/','Book / verify reserved seats'],
    ['Kawaguchiko → Mishima · 10 Dec','Highway bus','https://www.fujikyucitybus.com/highwaybus/kawaguchiko.html','Book / verify reserved seats'],
    ['Mishima → Kyoto · 10 Dec','Tokaido Shinkansen','https://smart-ex.jp/en/','Choose a service after the bus arrival'],
    ['Tokyo hotel · 4–9 Dec','Stay · Shinjuku','https://www.google.com/maps/search/?api=1&query=LiVEMAX+Shinjuku+Kabukicho','Confirm exact dates and address'],
    ['Fuji hotel · 9–10 Dec','Stay · Kawaguchiko','https://www.google.com/maps/search/?api=1&query=Royal+Hotel+Kawaguchiko','Ask about shuttle, meals and private bath eligibility'],
    ['Kyoto hotel · 10–12 Dec','Stay · Kawaramachi / Gion-Shijo area','https://www.google.com/maps/search/?api=1&query=hotels+Kawaramachi+Kyoto','Confirm exact property and dates'],
    ['Osaka hotel · 12–14 Dec','Stay · Shinsaibashi / Namba','https://www.google.com/maps/search/?api=1&query=Hotel+Sanrriott+Shinsaibashi','Confirm checkout and airport route'],
    ['SHIBUYA SKY · 5 Dec','Timed rooftop entry','https://www.shibuya-scramble-square.com/sky/','Target 15:30–16:00; check ticket release rules'],
    ['teamLab Borderless · 7 Dec 19:00','Timed entry · birthday','https://www.teamlab.art/e/tokyo/','Previously marked booked — check email / QR'],
    ['Tokyo DisneySea · 8 Dec','Full-day ticket','https://www.tokyodisneyresort.jp/en/tds/','Check ticket, app and date-specific park hours'],
    ['1 OAK Tokyo · 6 Dec','Birthday-eve night out','https://www.1oaktokyo.com/','Verify event, entry rules, age/ID and dress code'],
    ['Solaniwa Onsen · 13 Dec optional','Private bath candidate','https://solaniwa.com/explore/private_bath/','Confirm group eligibility, rate and availability']
  ];
  const locations = {
    tokyo:{label:'Tokyo',lat:35.6762,lon:139.6503},
    fuji:{label:'Kawaguchiko / Fuji',lat:35.4994,lon:138.7689},
    kyoto:{label:'Kyoto',lat:35.0116,lon:135.7681},
    osaka:{label:'Osaka',lat:34.6937,lon:135.5023}
  };
  const weatherCode = c => ({0:'Clear',1:'Mostly clear',2:'Partly cloudy',3:'Overcast',45:'Fog',48:'Rime fog',51:'Light drizzle',53:'Drizzle',55:'Dense drizzle',61:'Light rain',63:'Rain',65:'Heavy rain',71:'Light snow',73:'Snow',75:'Heavy snow',80:'Rain showers',81:'Showers',82:'Heavy showers',95:'Thunderstorm'}[c] || 'Mixed conditions');

  function renderDayOps(){
    const sel=$('#daySelect'); const tripDays=window.tripDays; if(!sel || !tripDays) return;
    sel.innerHTML=tripDays.map((d,i)=>`<option value="${i}">${d.date} · ${d.city} — ${d.title}</option>`).join('');
    const render=()=>{
      const i=Number(sel.value), d=tripDays[i], completed=get('dayEnjoyed',{});
      $('#todaySummary').innerHTML=`<div class="today-date">${d.date} · ${d.pace}</div><h4>${d.title}</h4><p>${d.vibe}</p><div class="today-stop-pills">${d.stops.map(s=>`<span>${s[0]} · ${s[1]}</span>`).join('')}</div><p class="muted">${completed[d.id]?'✓ Marked as enjoyed — lovely.':'A good day has 2–4 anchors, one proper meal and a little breathing room.'}</p>`;
      $('#markDayDone').textContent=completed[d.id]?'Day enjoyed ✓':'Mark day as enjoyed ✓';
      $('#markDayDone').dataset.day=d.id;
      const city=d.city.toLowerCase(); const filter=city.includes('fuji')?'fuji':city.includes('kyoto')?'kyoto':city.includes('osaka')||city.includes('nara')?'osaka':'tokyo';
      $('#todayMapLink').onclick=()=>{const b=document.querySelector(`[data-filter="${filter}"]`); if(b)b.click();};
    };
    sel.addEventListener('change',render); render();
    $('#markDayDone').addEventListener('click',()=>{const obj=get('dayEnjoyed',{}), id=$('#markDayDone').dataset.day;obj[id]=!obj[id];set('dayEnjoyed',obj);render();toast(obj[id]?'A memory made ♥':'Day marker cleared');});
  }

  async function loadWeather(){
    const key=$('#weatherCity').value, loc=locations[key], out=$('#weatherResult');
    out.innerHTML='<p class="muted">Checking the latest forecast…</p>';
    try{
      const url=`https://api.open-meteo.com/v1/forecast?latitude=${loc.lat}&longitude=${loc.lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,weather_code,cloud_cover_mean&forecast_days=16&timezone=Asia%2FTokyo`;
      const res=await fetch(url); if(!res.ok) throw new Error('Forecast unavailable'); const data=await res.json();
      const c=data.current, today=new Date().toLocaleDateString('en-CA',{timeZone:'Asia/Tokyo'});
      const idx=data.daily.time.indexOf(today);
      let tripNote='Your December travel dates are outside the normal short-range forecast right now. Refresh nearer departure.';
      if(idx>=0){const tripRows=data.daily.time.map((date,i)=>({date,i})).filter(x=>x.date>='2026-12-04'&&x.date<='2026-12-14');if(tripRows.length){tripNote=tripRows.map(x=>`<div class="forecast-row"><b>${new Date(x.date+'T12:00:00').toLocaleDateString('en-GB',{day:'numeric',month:'short'})}</b><span>${data.daily.temperature_2m_min[x.i]}° / ${data.daily.temperature_2m_max[x.i]}°</span><span>${weatherCode(data.daily.weather_code[x.i])}</span><small>Rain ${data.daily.precipitation_probability_max[x.i]??'—'}% · Cloud ${data.daily.cloud_cover_mean[x.i]??'—'}%</small></div>`).join('');}}
      const current=`<div class="weather-current"><div><small>NOW IN ${loc.label.toUpperCase()}</small><strong>${Math.round(c.temperature_2m)}°C</strong><span>${weatherCode(c.weather_code)}</span></div><div class="weather-stats"><span>Feels ${Math.round(c.apparent_temperature)}°</span><span>Humidity ${c.relative_humidity_2m}%</span><span>Wind ${Math.round(c.wind_speed_10m)} km/h</span></div></div>`;
      out.innerHTML=current+`<div class="forecast-heading">DEC 4–14 TRIP OUTLOOK</div><div class="forecast-list">${tripNote}</div><small class="muted">Updated ${new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})} Japan time · Open-Meteo</small>`;
    }catch(e){out.innerHTML='<p class="muted">Could not load a forecast. Check your connection and try again. Saved itinerary and offline notes still work.</p>';}
  }
  function renderBookingBoard(){
    const states=['Not checked','Need to book','Booked','Verified'];const saved=get('bookings',{});
    $('#bookingBoard').innerHTML=bookingItems.map((b,i)=>`<div class="booking-row"><div class="booking-main"><b>${b[0]}</b><span>${b[1]}</span><small>${b[3]}</small><a href="${b[2]}" target="_blank" rel="noopener">Open official / map link ↗</a></div><select data-booking="${i}" aria-label="Status for ${b[0]}">${states.map(s=>`<option ${((saved[i]||'Not checked')===s)?'selected':''}>${s}</option>`).join('')}</select></div>`).join('');
    $('#bookingBoard').addEventListener('change',e=>{if(!e.target.matches('[data-booking]'))return;const v=get('bookings',{});v[e.target.dataset.booking]=e.target.value;set('bookings',v);toast('Booking status saved');});
  }
  const rescues={
    low:['Choose one nearby anchor only.','Have a warm café breakfast, do one short walk, return to the hotel for a proper rest, then pick an easy dinner near your base.','Skip cross-city transfers, queues and anything with a timed entry you do not already hold.'],
    rain:['Turn the day into indoor neighbourhood hopping.','Tokyo: department-store depachika + Ginza / indoor shopping. Kyoto: Nishiki Market (check stall hours) + tea stop. Osaka: covered Shinsaibashi-suji arcade + food.','Use trains between clusters and keep a compact umbrella / waterproof shoes handy.'],
    fuji:['Do not chase the mountain all day.','Check cloud cover early. If Fuji is hidden, have Hōtō noodles, a warm café, lakeside stroll if conditions are pleasant, hotel onsen and a slow evening.','Do not hire a bike or attempt exposed viewpoints in icy / poor-visibility conditions.'],
    slow:['Pick a neighbourhood and stay in it.','Yanaka / Nezu in Tokyo, Gion backstreets in Kyoto, or Nakameguro / Daikanyama: one coffee, one little shop, one walk, one meal.','Leave the afternoon unscheduled. A small discovery is the point.']
  };
  function renderRescue(kind='low'){$('#rescueResult').innerHTML=`<h4>${rescues[kind][0]}</h4><p>${rescues[kind][1]}</p><small>${rescues[kind][2]}</small>`;}

  function renderDocs(){const docs=get('docs',[]);$('#docList').innerHTML=docs.map((d,i)=>`<div class="doc-row"><span><b>${esc(d.name)}</b><small>${esc(d.ref||'No reference label')}</small></span><span>${d.url?`<a target="_blank" rel="noopener" href="${esc(d.url)}">Open ↗</a>`:''}<button data-doc-delete="${i}" aria-label="Remove document">×</button></span></div>`).join('')||'<p class="muted">Nothing indexed yet.</p>';}
  function esc(s=''){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
  function photoData(file){return new Promise((resolve,reject)=>{const reader=new FileReader();reader.onerror=reject;reader.onload=()=>{const img=new Image();img.onload=()=>{const max=1000,ratio=Math.min(1,max/Math.max(img.width,img.height)),canvas=document.createElement('canvas');canvas.width=Math.round(img.width*ratio);canvas.height=Math.round(img.height*ratio);canvas.getContext('2d').drawImage(img,0,0,canvas.width,canvas.height);resolve(canvas.toDataURL('image/jpeg',.72));};img.onerror=reject;img.src=reader.result;};reader.readAsDataURL(file);});}
  function renderMemories(){const items=get('memories',[]);$('#memoryCount').textContent=`${items.length} ${items.length===1?'moment':'moments'}`;$('#memoryFeed').innerHTML=items.slice().reverse().map((m,ri)=>{const i=items.length-1-ri;return `<article class="memory-entry"><div class="memory-entry-top"><span>${esc(m.date)} · ${esc(m.city)}</span><button data-memory-delete="${i}" aria-label="Delete memory">×</button></div><h3>${esc(m.title)}</h3><p>${esc(m.text||'A moment worth keeping.')}</p>${m.photos?.length?`<div class="memory-photos">${m.photos.map(src=>`<img src="${src}" loading="lazy" alt="Trip memory">`).join('')}</div>`:''}</article>`;}).join('')||'<p class="muted">Your first memory is waiting to happen. Add one after a meal, a view or a funny little detour.</p>';}
  const packing={
    'Winter layers':['Thermal base top','Thermal leggings for Fuji','Warm coat / puffer','Fleece or sweater','Scarf','Gloves','Beanie / ear coverage','Thick socks','Comfortable grippy walking shoes'],
    'Daily carry':['Small crossbody / day bag','Compact umbrella','Reusable water bottle','Coin pouch + small yen cash','Tissues / handkerchief','Lip balm + moisturiser','Hand warmers (kairo)','Foldable tote'],
    'Tech & documents':['Passport + visa / entry documents','Phone + charger','Power bank','Japan plug adapter (Type A)','eSIM / roaming details','Travel insurance details','Hotel addresses saved offline','Offline maps + translation downloaded'],
    'Personal':['Regular medicines in original packaging','Basic personal care kit','Sunglasses','Sleepwear','Laundry pouch','Small first-aid basics']
  };
  function renderPacking(){const state=get('packing',{});$('#packingList').innerHTML=Object.entries(packing).map(([group,items])=>`<details class="packing-group" open><summary>${group} <small>${items.filter(x=>state[x]).length}/${items.length}</small></summary>${items.map(x=>`<label class="packing-item"><input type="checkbox" data-pack="${esc(x)}" ${state[x]?'checked':''}><span>${esc(x)}</span></label>`).join('')}</details>`).join('');}
  function exportBackup(){const out={app:'little-japan',version:2,exportedAt:new Date().toISOString(),data:{}};for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(k?.startsWith(KEY)){try{out.data[k.slice(KEY.length)]=JSON.parse(localStorage.getItem(k));}catch{}}}const blob=new Blob([JSON.stringify(out,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='little-japan-backup-'+new Date().toISOString().slice(0,10)+'.json';a.click();URL.revokeObjectURL(url);toast('Backup downloaded');}
  function importBackup(file){const r=new FileReader();r.onload=()=>{try{const data=JSON.parse(r.result);if(data.app!=='little-japan'||!data.data)throw Error('Not a little japan backup');Object.entries(data.data).forEach(([k,v])=>set(k,v));toast('Backup restored — refreshing');setTimeout(()=>location.reload(),700);}catch(e){toast('Could not read that backup file');}};r.readAsText(file);}
  function init(){
    renderDayOps();renderBookingBoard();renderRescue('low');renderDocs();renderMemories();renderPacking();
    $('#refreshWeather').addEventListener('click',loadWeather);$('#weatherCity').addEventListener('change',loadWeather);
    $$('.rescue-moods [data-rescue]').forEach(b=>b.addEventListener('click',()=>{$$('.rescue-moods [data-rescue]').forEach(x=>x.classList.toggle('active',x===b));renderRescue(b.dataset.rescue);}));
    $('#docForm').addEventListener('submit',e=>{e.preventDefault();const docs=get('docs',[]);docs.push({name:$('#docName').value.trim(),url:$('#docUrl').value.trim(),ref:$('#docRef').value.trim()});set('docs',docs);e.target.reset();renderDocs();toast('Added to your index');});
    $('#docList').addEventListener('click',e=>{const b=e.target.closest('[data-doc-delete]');if(!b)return;const docs=get('docs',[]);docs.splice(Number(b.dataset.docDelete),1);set('docs',docs);renderDocs();});
    $('#memoryForm').addEventListener('submit',async e=>{e.preventDefault();const btn=e.submitter;btn.disabled=true;try{const files=[...$('#memoryPhoto').files].slice(0,4),photos=await Promise.all(files.map(photoData)),items=get('memories',[]);items.push({title:$('#memoryTitle').value.trim(),date:$('#memoryDate').value,city:$('#memoryCity').value,text:$('#memoryText').value.trim(),photos});set('memories',items);e.target.reset();$('#memoryDate').value='2026-12-04';renderMemories();toast('Memory saved ♥');}catch(err){toast('Could not save photos. Try fewer or smaller images.');}finally{btn.disabled=false;}});
    $('#memoryFeed').addEventListener('click',e=>{const b=e.target.closest('[data-memory-delete]');if(!b)return;const items=get('memories',[]);items.splice(Number(b.dataset.memoryDelete),1);set('memories',items);renderMemories();});
    $('#packingList').addEventListener('change',e=>{if(!e.target.matches('[data-pack]'))return;const s=get('packing',{});s[e.target.dataset.pack]=e.target.checked;set('packing',s);renderPacking();});
    $('#exportBackup').addEventListener('click',exportBackup);$('#importBackup').addEventListener('change',e=>{if(e.target.files[0])importBackup(e.target.files[0]);});$('#printGuide').addEventListener('click',()=>window.print());
    loadWeather();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();