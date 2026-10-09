const gain=resources=>({kind:'gain',resources});
const countGain=(countType,per)=>({kind:'countGain',countType,per});
const manual=text=>({kind:'manual',text});
const actionBonus=(action,value)=>({kind:'actionBonus',action,value});
const discount=(type,resources)=>({kind:'discount',type,resources});
const entry=(name,cost,immediate,permanent,note='')=>({name,cost:{monete:cost},immediate,permanent,note,implemented:!immediate.some(e=>e.kind==='manual')&&!permanent.some(e=>e.kind==='manual')});

export const CHARACTERS={};
const eras=[[
 entry('Artisan',3,[],[actionBonus('production',2)]),
 entry('Farmer',3,[],[actionBonus('harvest',2)]),
 entry('Knight',2,[{kind:'privilege'}],[actionBonus('imprese',2)]),
 entry('Dame',3,[],[discount('personaggi',{monete:1}),actionBonus('personaggi',2)]),
 entry('Stonemason',3,[],[discount('edifici',{legno:1,pietra:1}),actionBonus('edifici',2)]),
 entry('Warlord',2,[gain({militari:3})],[actionBonus('territori',2)]),
 entry('Preacher',2,[gain({fede:4})],[{kind:'ignoreTowerBonuses'}]),
 entry('Abbess',4,[gain({fede:1}),{kind:'virtualTower',value:4}],[]),
 entry('Actress',3,[{kind:'leader',count:2}],[]),
 entry('Abbot',2,[gain({fede:1}),{kind:'leader',count:1}],[]),
 entry('Tainted',4,[],[{kind:'doubleTowerBonuses'}]),
 entry('Court Lady',3,[{kind:'leader',count:1}],[{kind:'leaderPlayVP',value:1}],'Ottieni 1 punto vittoria ogni volta che giochi un Leader con effetto permanente.')
],[
 entry('Captain',4,[gain({militari:2}),{kind:'virtualTower',value:6,type:'territori'}],[]),
 entry('Architect',4,[{kind:'virtualTower',value:6,type:'edifici',discount:{legno:1,pietra:1}}],[]),
 entry('Patron',3,[{kind:'virtualTower',value:6,type:'personaggi',discount:{monete:2}}],[]),
 entry('Hero',4,[{kind:'privilege'},{kind:'virtualTower',value:6,type:'imprese'}],[]),
 entry('Peasant',4,[],[actionBonus('harvest',3)]),
 entry('Scholar',4,[],[actionBonus('production',3)]),
 entry('Papal Messenger',5,[gain({fede:3}),{kind:'privilege'}],[]),
 entry('Royal Messenger',5,[{kind:'distinctPrivileges',count:3}],[],'Scegli tre privilegi del Consiglio diversi tra loro.'),
 entry('Diplomat',7,[{kind:'playLeaderFree'}],[],'Gioca un Leader ignorandone i requisiti.'),
 entry('Master Artisan',5,[{kind:'bonusAction',action:'production',value:3}],[actionBonus('production',1)]),
 entry('Master Farmer',5,[{kind:'bonusAction',action:'harvest',value:3}],[actionBonus('harvest',1)]),
 entry('Council Envoy',4,[gain({fede:4})],[{kind:'councilDiscount',value:1}],'Il costo di accesso al Palazzo del Consiglio è ridotto di 1 moneta.')
],[
 entry('Paramour',7,[countGain('personaggi',{vittoria:2})],[]),
 entry('Herald',6,[countGain('imprese',{vittoria:2})],[]),
 entry('Cardinal',6,[gain({fede:2}),{kind:'bonusAction',action:'harvest',value:4}],[]),
 entry('Bishop',6,[gain({fede:1}),{kind:'bonusAction',action:'production',value:4}],[]),
 entry('General',4,[{kind:'militaryScore',per:2,vittoria:1}],[]),
 entry('Ambassador',6,[{kind:'privilege'},{kind:'virtualTower',value:7}],[]),
 entry('Noble',6,[countGain('territori',{vittoria:2})],[]),
 entry('Governor',6,[countGain('edifici',{vittoria:2})],[]),
 entry('Patrician',7,[{kind:'victoryRatio',per:5,value:1}],[]),
 entry('Leader Patron',6,[countGain('playedLeader',{vittoria:3})],[],'Nome provvisorio; interpretato come 3 punti per Leader giocato.'),
 entry('Devotee',7,[{kind:'faithScore',per:1,vittoria:1}],[],'Nome provvisorio; interpretato come 1 punto per punto fede.'),
 entry('Confessor',6,[{kind:'copyCharacterImmediate'}],[],'Copia l’effetto immediato di un altro Personaggio nel tuo dominio.')
]];
eras.forEach((cards,era)=>cards.forEach((card,n)=>CHARACTERS[`personaggi-${era+1}-${String(n+1).padStart(2,'0')}`]=card));

export function characterActionBonus(state,action){return state.collection.filter(c=>c.type==='personaggi').reduce((sum,c)=>sum+(CHARACTERS[c.id]?.permanent||[]).filter(e=>e.kind==='actionBonus'&&e.action===action).reduce((n,e)=>n+e.value,0),0);}
export function characterDiscount(state,type){const result={};for(const c of state.collection.filter(c=>c.type==='personaggi'))for(const e of CHARACTERS[c.id]?.permanent||[])if(e.kind==='discount'&&e.type===type)for(const [k,v] of Object.entries(e.resources))result[k]=(result[k]||0)+v;return result;}
export function characterPawnBonus(state,pawn){let bonus=0;for(const c of state.collection.filter(c=>c.type==='personaggi'))for(const e of CHARACTERS[c.id]?.permanent||[]){if(e.kind==='neutralBonus'&&pawn===3)bonus+=e.value;if(e.kind==='coloredValue'&&pawn!==3)bonus=Math.max(bonus,e.value-state.dice[pawn]);}return bonus;}
export function hasCharacterEffect(state,kind){return state.collection.some(c=>c.type==='personaggi'&&(CHARACTERS[c.id]?.permanent||[]).some(e=>e.kind===kind));}
