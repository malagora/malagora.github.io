const $ = id => document.getElementById(id);
const elements = {
  title: $('postTitle'), id: $('postId'), date: $('postDate'), image: $('postImage'), description: $('postDescription'),
  blocks: $('blocksList'), empty: $('blocksEmpty'), palette: $('blockPalette'), template: $('blockTemplate'), preview: $('postPreview'),
  previewShell: $('previewShell'), jsonFile: $('jsonFile'), existing: $('existingPost'), databaseStatus: $('databaseStatus'),
  exportStatus: $('exportStatus'), apply: $('applyToDatabase'), download: $('downloadJson'), copy: $('copyObject')
};

const BLOCK_NAMES = {
  text: 'Tekst', heading: 'Nagłówek', image: 'Zdjęcie', youtube: 'Film YouTube', link: 'Link',
  'unordered-list': 'Lista punktowana', 'ordered-list': 'Lista numerowana', html: 'Własny HTML'
};
const ALIGNMENTS = [['left','Do lewej'],['center','Do środka'],['right','Do prawej'],['justify','Wyjustowanie']];
const LIST_STYLES = {
  'unordered-list': [['disc','Pełne kółko'],['circle','Puste kółko'],['square','Kwadrat'],['custom','Własny znak']],
  'ordered-list': [['decimal','1, 2, 3'],['decimal-leading-zero','01, 02, 03'],['lower-alpha','a, b, c'],['upper-alpha','A, B, C'],['lower-roman','i, ii, iii'],['upper-roman','I, II, III']]
};

let database = [];
let blocks = [];
let editingOriginalId = '';
let previewTimer = null;

function uid() { return crypto.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`; }
function escapeHtml(value) { return String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
function escapeAttribute(value) { return escapeHtml(value).replace(/`/g, '&#96;'); }
function slugify(value) {
  return value.toLocaleLowerCase('pl-PL').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ł/g,'l')
    .replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'').slice(0,120);
}
function alignmentOptions(selected='left') { return ALIGNMENTS.map(([value,label]) => `<option value="${value}"${value===selected?' selected':''}>${label}</option>`).join(''); }
function optionList(options, selected) { return options.map(([value,label]) => `<option value="${value}"${value===selected?' selected':''}>${label}</option>`).join(''); }
function block(type, data={}) { return { id:uid(), type, data:{ align:'left', ...defaultData(type), ...data } }; }
function defaultData(type) {
  if (type === 'text') return { html:'<p>Wpisz treść akapitu…</p>' };
  if (type === 'heading') return { text:'Nagłówek sekcji', level:'h3' };
  if (type === 'image') return { src:'', alt:'', caption:'', imageAlign:'center', captionAlign:'right' };
  if (type === 'youtube') return { url:'', title:'Film YouTube', caption:'', captionAlign:'left' };
  if (type === 'link') return { url:'https://', label:'Tekst odnośnika', newTab:true };
  if (type === 'unordered-list') return { items:'Pierwszy punkt\nDrugi punkt', style:'disc', customMarker:'➔' };
  if (type === 'ordered-list') return { items:'Pierwszy punkt\nDrugi punkt', style:'decimal', start:'1' };
  if (type === 'html') return { html:'<!-- Wklej istniejący lub własny HTML -->' };
  return {};
}

function renderBlocks() {
  elements.blocks.replaceChildren();
  elements.empty.hidden = blocks.length > 0;
  blocks.forEach((item,index) => elements.blocks.append(renderBlock(item,index)));
  schedulePreview();
}

function field(label, control, wide=true) { return `<label class="block-field${wide?' wide':''}"><span>${label}</span>${control}</label>`; }
function renderBlock(item,index) {
  const fragment = elements.template.content.cloneNode(true);
  const article = fragment.querySelector('.content-block');
  article.dataset.blockId = item.id;
  fragment.querySelector('.block-kind').textContent = `${index+1}. ${BLOCK_NAMES[item.type]}`;
  const container = fragment.querySelector('.block-fields');
  container.innerHTML = blockFields(item);
  const rich = container.querySelector('.rich-editor');
  if (rich) rich.innerHTML = item.data.html;
  fragment.querySelectorAll('[data-action]').forEach(button => button.addEventListener('click', () => blockAction(item.id,button.dataset.action)));
  container.addEventListener('input', event => updateBlockFromInput(item,event));
  container.addEventListener('change', event => updateBlockFromInput(item,event));
  container.querySelectorAll('[data-command]').forEach(button => button.addEventListener('mousedown', event => {
    event.preventDefault();
    const command=button.dataset.command;
    const value=command==='createLink' ? prompt('Adres linku:', 'https://') : null;
    if (command!=='createLink' || value) document.execCommand(command,false,value);
    item.data.html=rich.innerHTML; schedulePreview();
  }));
  return fragment;
}

function blockFields(item) {
  const d=item.data;
  const align=field('Wyrównanie',`<select data-key="align">${alignmentOptions(d.align)}</select>`,false);
  if (item.type==='text') return `${align}<div class="block-field wide"><span>Treść</span><div class="rich-toolbar"><button type="button" data-command="bold"><b>B</b></button><button type="button" data-command="italic"><i>I</i></button><button type="button" data-command="createLink"><i class="fa fa-link"></i></button><button type="button" data-command="unlink"><i class="fa fa-chain-broken"></i></button></div><div class="rich-editor" contenteditable="true" data-rich="html"></div></div>`;
  if (item.type==='heading') return `${field('Poziom',`<select data-key="level"><option value="h2"${d.level==='h2'?' selected':''}>H2</option><option value="h3"${d.level==='h3'?' selected':''}>H3</option><option value="h4"${d.level==='h4'?' selected':''}>H4</option></select>`,false)}${align}${field('Treść',`<input data-key="text" value="${escapeAttribute(d.text)}">`)}`;
  if (item.type==='image') return `${field('Ścieżka lub URL zdjęcia',`<input data-key="src" value="${escapeAttribute(d.src)}" placeholder="/aktualnosci/media/…">`)}${field('Tekst alternatywny',`<input data-key="alt" value="${escapeAttribute(d.alt)}">`)}${field('Wyrównanie zdjęcia',`<select data-key="imageAlign">${alignmentOptions(d.imageAlign)}</select>`,false)}${field('Wyrównanie podpisu',`<select data-key="captionAlign">${alignmentOptions(d.captionAlign)}</select>`,false)}${field('Podpis pod zdjęciem',`<textarea data-key="caption" rows="3">${escapeHtml(d.caption)}</textarea>`)}`;
  if (item.type==='youtube') return `${field('Link YouTube lub identyfikator filmu',`<input data-key="url" value="${escapeAttribute(d.url)}" placeholder="https://www.youtube.com/watch?v=…">`)}${field('Tytuł ramki',`<input data-key="title" value="${escapeAttribute(d.title)}">`)}${field('Wyrównanie podpisu',`<select data-key="captionAlign">${alignmentOptions(d.captionAlign)}</select>`,false)}${field('Podpis pod filmem',`<textarea data-key="caption" rows="2">${escapeHtml(d.caption)}</textarea>`)}`;
  if (item.type==='link') return `${field('Adres',`<input data-key="url" value="${escapeAttribute(d.url)}">`)}${field('Tekst linku',`<input data-key="label" value="${escapeAttribute(d.label)}">`)}${align}${field('Otwieranie',`<select data-key="newTab"><option value="false"${!d.newTab?' selected':''}>W tej samej karcie</option><option value="true"${d.newTab?' selected':''}>W nowej karcie</option></select>`,false)}`;
  if (item.type.endsWith('list')) {
    const custom=item.type==='unordered-list' ? field('Własny punkt',`<input data-key="customMarker" value="${escapeAttribute(d.customMarker)}" maxlength="8">`,false) : field('Numer początkowy',`<input type="number" data-key="start" value="${escapeAttribute(d.start)}" min="1">`,false);
    return `${field('Styl',`<select data-key="style">${optionList(LIST_STYLES[item.type],d.style)}</select>`,false)}${align}${custom}${field('Elementy — jeden w każdym wierszu',`<textarea data-key="items" rows="7">${escapeHtml(d.items)}</textarea>`)}`;
  }
  return field('Kod HTML',`<textarea data-key="html" rows="12" spellcheck="false">${escapeHtml(d.html)}</textarea>`);
}

function updateBlockFromInput(item,event) {
  const rich=event.target.closest('[data-rich]');
  if (rich) item.data[rich.dataset.rich]=rich.innerHTML;
  const key=event.target.dataset.key;
  if (key) item.data[key]=key==='newTab' ? event.target.value==='true' : event.target.value;
  schedulePreview();
}
function blockAction(id,action) {
  const index=blocks.findIndex(item=>item.id===id); if(index<0)return;
  if(action==='remove') blocks.splice(index,1);
  if(action==='up'&&index>0) [blocks[index-1],blocks[index]]=[blocks[index],blocks[index-1]];
  if(action==='down'&&index<blocks.length-1) [blocks[index+1],blocks[index]]=[blocks[index],blocks[index+1]];
  if(action==='duplicate') blocks.splice(index+1,0,{...structuredClone(blocks[index]),id:uid()});
  renderBlocks();
}

function youtubeId(value) {
  const raw=String(value||'').trim();
  if(/^[\w-]{11}$/.test(raw)) return raw;
  try { const url=new URL(raw); return url.hostname.includes('youtu.be') ? url.pathname.split('/')[1] : url.searchParams.get('v') || url.pathname.match(/\/(?:embed|shorts)\/([\w-]{11})/)?.[1] || ''; } catch { return ''; }
}
function safeCssMarker(value) { return String(value||'•').replace(/["'\\;]/g,'').slice(0,8); }
function lines(value) { return String(value||'').split(/\r?\n/).map(v=>v.trim()).filter(Boolean); }
function blockHtml(item) {
  const d=item.data, align=`text-align:${d.align||'left'};`;
  if(item.type==='html') return d.html;
  if(item.type==='text') return `<div class="post_content-text" style="border-bottom:none;${align}">${d.html}</div>`;
  if(item.type==='heading') { const level=['h2','h3','h4'].includes(d.level)?d.level:'h3'; return `<div class="post_content-text" style="border-bottom:none;${align}"><${level}>${escapeHtml(d.text)}</${level}></div>`; }
  if(item.type==='image') return `<figure class="post_content-img post-media-${d.imageAlign||'center'}"><img src="${escapeAttribute(d.src)}" alt="${escapeAttribute(d.alt)}" loading="lazy">${d.caption?`<figcaption style="text-align:${d.captionAlign||'right'};">${escapeHtml(d.caption)}</figcaption>`:''}</figure>`;
  if(item.type==='youtube') { const id=youtubeId(d.url); return `<figure class="post-youtube"><div class="post-youtube-frame"><iframe src="https://www.youtube-nocookie.com/embed/${escapeAttribute(id)}" title="${escapeAttribute(d.title||'Film YouTube')}" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe></div>${d.caption?`<figcaption style="text-align:${d.captionAlign||'left'};">${escapeHtml(d.caption)}</figcaption>`:''}</figure>`; }
  if(item.type==='link') return `<div class="post_content-text post-link-block" style="border-bottom:none;${align}"><p><a href="${escapeAttribute(d.url)}"${d.newTab?' target="_blank" rel="noopener noreferrer"':''}>${escapeHtml(d.label)}</a></p></div>`;
  if(item.type.endsWith('list')) {
    const ordered=item.type==='ordered-list', tag=ordered?'ol':'ul', items=lines(d.items).map(value=>`<li>${escapeHtml(value)}</li>`).join('');
    const custom=!ordered&&d.style==='custom';
    const style=custom?`--post-marker:'${safeCssMarker(d.customMarker)}';`: `list-style-type:${d.style};`;
    const start=ordered&&Number(d.start)>1?` start="${Math.floor(Number(d.start))}"`:'';
    return `<div class="post_content-text" style="border-bottom:none;${align}"><${tag} class="post-generated-list${custom?' post-list-custom':''}" style="${style}"${start}>${items}</${tag}></div>`;
  }
  return '';
}
function contentHtml() { return blocks.map(blockHtml).join(''); }
function postObject() { return { id:elements.id.value.trim(), title:elements.title.value.trim(), description:elements.description.value.trim(), image:elements.image.value.trim(), date:elements.date.value, content:contentHtml() }; }

function previewDocument() {
  const post=postObject();
  return `<!doctype html><html lang="pl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="stylesheet" href="/styles/post.css"><style>body{margin:0}.preview-note{padding:12px;background:#fff4cc;text-align:center;font:13px Verdana}.post{padding-top:1px}.post_content{padding-bottom:50px}@media(max-width:1000px){.banner{margin-top:0!important}.post_content{padding-left:20px!important;padding-right:20px!important}}</style></head><body><div class="preview-note">Podgląd roboczy — ${elements.previewShell.classList.contains('is-mobile')?'telefon':'komputer'}</div><section class="banner" style="margin:0"><div class="banner-image" style="background-image:url('${escapeAttribute(post.image)}')"></div><div class="banner-text"><div class="banner-text-content"><h1>${escapeHtml(post.title||'Tytuł artykułu')}</h1><p>${post.date?new Date(`${post.date}T12:00:00`).toLocaleDateString('pl-PL',{day:'numeric',month:'long',year:'numeric'}):'Data publikacji'}</p></div><a><p class="f-dArrow">↓</p><p class="f-dText">PRZEWIŃ DALEJ</p></a></div></section><section class="post"><div class="post_content"><header>${escapeHtml((post.title||'Tytuł artykułu').toUpperCase())}</header>${post.content||'<p>Dodaj elementy treści.</p>'}</div></section></body></html>`;
}
function schedulePreview() { clearTimeout(previewTimer); previewTimer=setTimeout(()=>{ elements.preview.srcdoc=previewDocument(); },120); }

function validatePost(post) {
  const missing=[]; if(!post.title)missing.push('tytuł'); if(!post.id)missing.push('ID'); if(!post.date)missing.push('datę'); if(!post.image)missing.push('obraz'); if(!post.description)missing.push('opis');
  if(missing.length) throw new Error(`Uzupełnij: ${missing.join(', ')}.`);
  if(!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(post.id)) throw new Error('ID może zawierać małe litery, cyfry i pojedyncze łączniki.');
}
function refreshDatabaseSelect(selected='') {
  elements.existing.innerHTML='<option value="">Nowy wpis</option>'+[...database].sort((a,b)=>new Date(b.date)-new Date(a.date)).map(post=>`<option value="${escapeAttribute(post.id)}"${post.id===selected?' selected':''}>${escapeHtml(post.date)} — ${escapeHtml(post.title)}</option>`).join('');
  elements.databaseStatus.textContent=`W bazie: ${database.length} ${database.length===1?'wpis':database.length<5?'wpisy':'wpisów'}.`;
}
function loadPost(post) {
  editingOriginalId=post?.id||''; elements.id.value=post?.id||''; elements.title.value=post?.title||''; elements.description.value=post?.description||''; elements.image.value=post?.image||''; elements.date.value=post?.date||new Date().toISOString().slice(0,10);
  blocks=post?.content ? [block('html',{html:post.content})] : [block('text')]; renderBlocks();
}
async function importDatabase(data) {
  if(!Array.isArray(data)||data.some(post=>!post||typeof post!=='object'||!post.id)) throw new Error('Plik nie zawiera poprawnej tablicy wpisów.');
  database=data; refreshDatabaseSelect(); loadPost(null); setStatus(`Wczytano ${database.length} wpisów.`);
}
function setStatus(message,error=false) { elements.exportStatus.textContent=message; elements.exportStatus.classList.toggle('is-error',error); }
function download(name,data,type='application/json') { const url=URL.createObjectURL(new Blob([data],{type})); const a=document.createElement('a'); a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000); }

elements.palette.addEventListener('click',event=>{ const button=event.target.closest('[data-add]'); if(!button)return; blocks.push(block(button.dataset.add)); renderBlocks(); elements.blocks.lastElementChild?.scrollIntoView({behavior:'smooth',block:'center'}); });
['input','change'].forEach(type=>document.querySelector('.metadata-panel').addEventListener(type,schedulePreview));
$('generateSlug').addEventListener('click',()=>{ elements.id.value=slugify(elements.title.value);schedulePreview(); });
$('newPost').addEventListener('click',()=>{ elements.existing.value='';loadPost(null);setStatus('Utworzono pusty szkic.'); });
$('saveDraft').addEventListener('click',()=>{ localStorage.setItem('mala-gora-post-creator-draft',JSON.stringify({post:postObject(),blocks,database,editingOriginalId}));setStatus('Szkic zapisano w tej przeglądarce.'); });
elements.jsonFile.addEventListener('change',async()=>{ try{await importDatabase(JSON.parse(await elements.jsonFile.files[0].text()));}catch(error){setStatus(error.message,true);} });
$('loadSiteJson').addEventListener('click',async()=>{try{const response=await fetch('/aktualnosci/post.json',{cache:'no-store'});if(!response.ok)throw new Error('Nie udało się pobrać /aktualnosci/post.json.');await importDatabase(await response.json());}catch(error){setStatus(error.message,true);} });
elements.existing.addEventListener('change',()=>{ const post=database.find(item=>item.id===elements.existing.value);loadPost(post||null); });
elements.apply.addEventListener('click',()=>{try{const post=postObject();validatePost(post);const collision=database.findIndex(item=>item.id===post.id);if(editingOriginalId&&editingOriginalId!==post.id)database=database.filter(item=>item.id!==editingOriginalId);const index=database.findIndex(item=>item.id===post.id);if(index>=0)database[index]=post;else database.unshift(post);editingOriginalId=post.id;refreshDatabaseSelect(post.id);setStatus(index>=0||collision>=0?'Zaktualizowano wpis w bazie roboczej.':'Dodano wpis do bazy roboczej.');}catch(error){setStatus(error.message,true);} });
elements.download.addEventListener('click',()=>{try{if(!database.length)throw new Error('Baza jest pusta. Najpierw dodaj wpis.');download('post.json',JSON.stringify(database,null,2));setStatus('Pobrano kompletny post.json.');}catch(error){setStatus(error.message,true);} });
elements.copy.addEventListener('click',async()=>{try{const post=postObject();validatePost(post);await navigator.clipboard.writeText(JSON.stringify(post,null,2));setStatus('Skopiowano obiekt wpisu.');}catch(error){setStatus(error.message,true);} });
document.querySelectorAll('[data-preview]').forEach(button=>button.addEventListener('click',()=>{document.querySelectorAll('[data-preview]').forEach(b=>b.classList.toggle('is-active',b===button));elements.previewShell.classList.toggle('is-mobile',button.dataset.preview==='mobile');schedulePreview();}));

try {
  const draft=JSON.parse(localStorage.getItem('mala-gora-post-creator-draft'));
  if(draft?.post&&Array.isArray(draft.blocks)) { database=Array.isArray(draft.database)?draft.database:[];blocks=draft.blocks;editingOriginalId=draft.editingOriginalId||'';elements.id.value=draft.post.id||'';elements.title.value=draft.post.title||'';elements.description.value=draft.post.description||'';elements.image.value=draft.post.image||'';elements.date.value=draft.post.date||'';refreshDatabaseSelect(editingOriginalId);renderBlocks();setStatus('Przywrócono lokalny szkic.'); }
  else throw new Error();
} catch { elements.date.value=new Date().toISOString().slice(0,10);blocks=[block('text')];refreshDatabaseSelect();renderBlocks(); }
