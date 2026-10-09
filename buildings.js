const gain=resources=>({kind:'gain',resources});
const trade=(cost,resources,label='',extra=null)=>({kind:'trade',cost,resources,label,extra});
const chooseTrades=(...options)=>({kind:'chooseTrades',options});
const countGain=(countType,per)=>({kind:'countGain',countType,per});
const repeatTrade=(cost,resources)=>({kind:'repeatTrade',cost,resources});
const copyTerritory=()=>({kind:'copyTerritory'});
const manual=text=>({kind:'manual',text});
const entry=(name,cost,immediate,activation,production,note='')=>({name,cost:Array.isArray(cost)?{}:cost,costOptions:Array.isArray(cost)?cost:null,immediate,threshold:activation==='X'?1:activation,activation,production,note,implemented:!production.some(e=>e.kind==='manual')});
export const BUILDINGS={};
const eras=[[
entry('Stonemason’s Shop',{monete:1,pietra:2},[gain({vittoria:2})],1,[chooseTrades(trade({pietra:1},{monete:3}),trade({pietra:2},{monete:5}))]),
entry('Carpenter’s Shop',{monete:1,legno:2},[gain({vittoria:3})],4,[chooseTrades(trade({legno:1},{monete:3}),trade({legno:2},{monete:5}))]),
entry('Theater',{monete:1,legno:2},[gain({vittoria:5})],5,[countGain('personaggi',{vittoria:1})]),
entry('Triumphal Arch',{monete:1,pietra:2},[gain({vittoria:5})],1,[countGain('imprese',{vittoria:1})]),
entry('Tax Office',{legno:2,pietra:1},[gain({vittoria:4})],4,[countGain('territori',{monete:1})]),
entry('Mint',{legno:1,pietra:2},[gain({vittoria:4})],2,[countGain('edifici',{monete:1})]),
entry('Residence',{pietra:2},[gain({vittoria:1})],2,[trade({monete:1},{},'1 privilegio del Consiglio',{kind:'privilege'})]),
entry('Chapel',{legno:2},[gain({fede:1,vittoria:1})],2,[trade({monete:1},{fede:1})]),
entry('City Workshop',{legno:1,pietra:1,monete:1},[gain({vittoria:3})],4,[trade({vittoria:1},{},'1 privilegio del Consiglio',{kind:'privilege'})],'Effetto confermato: paga 1 punto vittoria per ottenere 1 privilegio del Consiglio.'),
entry('Garrison',{legno:1,pietra:1},[gain({servitori:2})],'X',[gain({servitori:1,militari:1})],'Effetto confermato: ottieni 1 servitore e 1 punto militare senza costi.'),
entry('Wood Exchange',{legno:2,monete:1},[gain({vittoria:2})],7,[repeatTrade({legno:1},{monete:1,vittoria:1})]),
entry('Stone Exchange',{pietra:2,monete:1},[gain({vittoria:2})],2,[repeatTrade({pietra:1},{monete:1,vittoria:1})])
],[
entry('Baptistery',{pietra:3},[gain({vittoria:3,fede:1})],2,[trade({fede:1},{monete:1,vittoria:3})]),
entry('Stonemasons’ Guild',{legno:1,pietra:2},[gain({vittoria:4})],4,[trade({servitori:1,legno:1,pietra:1},{vittoria:6})]),
entry('Sculptors’ Guild',{pietra:4},[gain({vittoria:6})],5,[chooseTrades(trade({pietra:1},{vittoria:3}),trade({pietra:3},{vittoria:7}))]),
entry('Painters’ Guild',{legno:4},[gain({vittoria:5})],4,[chooseTrades(trade({legno:1},{vittoria:3}),trade({legno:3},{vittoria:7}))]),
entry('Treasury',{legno:3},[gain({vittoria:4})],3,[chooseTrades(trade({monete:1},{vittoria:3}),trade({monete:2},{vittoria:5}))]),
entry('Marketplace',{legno:2,pietra:1},[gain({vittoria:3})],3,[trade({monete:2},{legno:2,pietra:2})]),
entry('Stronghold',{monete:2,legno:2,pietra:2},[gain({vittoria:6})],6,[gain({militari:2,vittoria:2})]),
entry('Barracks',{legno:1,pietra:1},[gain({vittoria:3})],2,[trade({servitori:1},{militari:3})]),
entry('Sacred Archive',{legno:3,pietra:1},[gain({vittoria:2}),{kind:'leader',count:1}],7,[countGain('leader',{fede:1})],'Effetto confermato: ottieni 1 punto fede per ogni Leader.'),
entry('Pilgrims’ Lodge',{legno:5},[gain({vittoria:7})],6,[trade({legno:1,pietra:1},{fede:3})],'Nome provvisorio.'),
entry('Guild Hall',{servitori:3,pietra:2},[gain({vittoria:6})],1,[repeatTrade({monete:1},{servitori:1,vittoria:1})],'Nome provvisorio.'),
entry('Rural Workshop',{pietra:2,monete:2},[gain({vittoria:5})],3,[copyTerritory()],'Nome provvisorio.')
],[
entry('Church',{legno:1,pietra:4},[gain({vittoria:5,fede:1})],1,[chooseTrades(trade({legno:1},{fede:2}),trade({pietra:1},{fede:2}))]),
entry('Palace',{monete:3,legno:3,pietra:1},[gain({vittoria:9})],6,[trade({monete:2},{servitori:2,vittoria:4})]),
entry('Fortress',{monete:2,legno:2,pietra:4},[gain({vittoria:9})],5,[gain({vittoria:2}),{kind:'privilege'}]),
entry('Garden',{servitori:2,legno:4,pietra:2},[gain({vittoria:10})],1,[gain({vittoria:3})]),
entry('Storehouse',{monete:4,legno:3},[gain({vittoria:7})],4,[gain({legno:2,pietra:2,vittoria:1})],'Nome provvisorio.'),
entry('Bank',{monete:3,legno:1,pietra:3},[gain({vittoria:7})],2,[gain({monete:4,vittoria:1})]),
entry('Cathedral',{legno:4,pietra:4},[gain({vittoria:7,fede:3})],2,[gain({vittoria:1})]),
entry('Military Academy',{servitori:1,legno:2,pietra:2},[gain({vittoria:7})],3,[trade({servitori:1},{militari:3,vittoria:2})]),
entry('Grand Arsenal',{monete:1,legno:4},[gain({vittoria:7})],4,[trade({militari:1,monete:1},{vittoria:6})],'Nome provvisorio.'),
entry('Reliquary',{monete:2,pietra:5},[gain({vittoria:6})],1,[repeatTrade({servitori:1},{fede:1,vittoria:1})],'Nome provvisorio.'),
entry('Diplomatic Hall',{servitori:2,legno:2,pietra:3},[gain({vittoria:4}),{kind:'privilege',count:2}],7,[countGain('playedLeader',{vittoria:1,militari:1})],'Nome provvisorio.'),
entry('Market Hall',{monete:2,legno:1,pietra:2},[gain({vittoria:5})],2,[{kind:'marketBonus'}],'Nome provvisorio.')
]];
eras.forEach((cards,era)=>cards.forEach((card,n)=>BUILDINGS[`edifici-${era+1}-${String(n+1).padStart(2,'0')}`]=card));
export function describeCost(cost){const labels={monete:'monete',legno:'legno',pietra:'pietra',servitori:'servitori',militari:'punti militari',fede:'punti fede',vittoria:'punti vittoria'};return Object.entries(cost).map(([k,v])=>`${v} ${labels[k]}`).join(' + ')||'Nessun costo';}
export function describeBuildingCost(building){return building.costOptions?building.costOptions.map(describeCost).join(' OPPURE '):describeCost(building.cost);}
