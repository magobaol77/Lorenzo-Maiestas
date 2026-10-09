const gain=resources=>({kind:'gain',resources});
const privilege=()=>({kind:'privilege'});
const leader=()=>({kind:'leader',count:1});
const choose=(...options)=>({kind:'choose',options:options.map(gain)});
const entry=(name,threshold,immediate,harvest,note='')=>({name,threshold,immediate,harvest,note,cost:{},implemented:!harvest.some(e=>e.kind==='manual')});
export const TERRITORIES={};
const eras=[[
entry('Monastery',6,[gain({militari:1,servitori:1})],[gain({fede:1,pietra:1})]),
entry('Forest',5,[],[gain({legno:3})]),
entry('Gravel Pit',4,[gain({pietra:2})],[gain({pietra:2})]),
entry('Village',3,[gain({pietra:2})],[gain({monete:1,servitori:1})]),
entry('Woods',2,[gain({legno:2})],[gain({legno:1})]),
entry('Commercial Hub',1,[gain({monete:2})],[gain({monete:1})]),
entry('City',6,[gain({monete:3})],[privilege()]),
entry('Citadel',5,[],[gain({militari:2,pietra:1})]),
entry('City · Leader',7,[leader()],[gain({vittoria:3})]),
entry('City · Risorse',3,[gain({pietra:1,legno:1})],[gain({pietra:1,legno:1})]),
entry('City · Privilegio',1,[privilege()],[gain({servitori:1})]),
entry('City · Fede',7,[],[gain({fede:1,vittoria:2})])
],[
entry('Hermitage',2,[gain({fede:1})],[gain({fede:1})]),
entry('Estate',4,[gain({servitori:2,legno:1})],[gain({monete:1,legno:2})]),
entry('Rock Pit',3,[gain({legno:1})],[gain({pietra:3})]),
entry('Mining Town',4,[gain({servitori:1,pietra:1})],[gain({servitori:1,pietra:2})]),
entry('Mountain Town',3,[gain({servitori:1})],[gain({militari:1,legno:2})]),
entry('Gold Mine',1,[gain({monete:1})],[gain({monete:2})]),
entry('Dukedom',6,[gain({monete:3})],[gain({monete:1,pietra:1,legno:2})]),
entry('Manor House',5,[gain({militari:1})],[gain({militari:2,servitori:2})]),
entry('City · Leader',3,[leader()],[gain({monete:1,pietra:1})]),
entry('Uncontaminated Land',4,[],[{kind:'copyTerritory'}],'Durante il raccolto copia l’effetto di un altro Territorio nel tuo dominio.'),
entry('Templars’ Castle',4,[gain({militari:1,fede:1})],[choose({militari:2},{fede:1})]),
entry('Rural Village',5,[gain({legno:1,servitori:1})],[choose({legno:3},{servitori:3})])
],[
entry('Colony',5,[gain({militari:2})],[gain({vittoria:4,legno:1})]),
entry('Marble Pit',2,[gain({vittoria:3})],[gain({vittoria:1,pietra:2})]),
entry('Province',6,[privilege(),gain({pietra:1})],[gain({vittoria:4,pietra:1})]),
entry('Sanctuary',1,[privilege()],[gain({monete:1,fede:1})]),
entry('Castle',4,[gain({vittoria:2,monete:2})],[gain({militari:3,servitori:1})]),
entry('Fortified Town',2,[gain({militari:2,servitori:1})],[gain({militari:1,servitori:2})]),
entry('Trading Town',1,[gain({vittoria:1,monete:1,servitori:1})],[gain({monete:3})]),
entry('Farm',3,[gain({vittoria:1,legno:1})],[gain({vittoria:2,legno:2})]),
entry('City · Prestigio',3,[],[gain({vittoria:5})]),
entry('Pistoia',4,[gain({legno:2,pietra:2})],[choose({pietra:3},{legno:3})]),
entry('City · Fede',7,[gain({monete:2,servitori:2})],[gain({fede:2,vittoria:1})]),
entry('City · Privilegio',6,[privilege(),gain({monete:1})],[privilege(),gain({vittoria:2})])
]];
eras.forEach((cards,era)=>cards.forEach((card,n)=>TERRITORIES[`territori-${era+1}-${String(n+1).padStart(2,'0')}`]=card));
export const PRIVILEGES=[gain({legno:1,pietra:1}),gain({servitori:2}),gain({monete:2}),gain({militari:2}),gain({fede:1})];
export const RESOURCE_LABELS={legno:'legno',pietra:'pietra',monete:'monete',servitori:'servitori',militari:'punti militari',fede:'punti fede',vittoria:'punti vittoria'};
export function describeEffect(e){if(e.kind==='gain')return Object.entries(e.resources).map(([k,v])=>`${v} ${RESOURCE_LABELS[k]}`).join(' + ');if(e.kind==='leader')return `Pesca ${e.count} Leader`;if(e.kind==='playLeaderFree')return 'Gioca un Leader ignorandone i requisiti';if(e.kind==='privilege')return `${e.count||1} privilegio del Consiglio a scelta`;if(e.kind==='distinctPrivileges')return `Scegli ${e.count} privilegi del Consiglio diversi tra loro`;if(e.kind==='choose')return e.options.map(describeEffect).join(' OPPURE ');if(e.kind==='copyTerritory')return 'Copia l’effetto di raccolto di un Territorio nel tuo dominio';if(e.kind==='copyCharacterImmediate')return 'Copia l’effetto immediato di un altro Personaggio nel tuo dominio';if(e.kind==='victoryRatio')return `${e.value} punto vittoria ogni ${e.per} punti vittoria posseduti`;if(e.kind==='trade')return `Spendi ${Object.entries(e.cost).map(([k,v])=>`${v} ${RESOURCE_LABELS[k]}`).join(' + ')} → ${Object.entries(e.resources).map(([k,v])=>`${v} ${RESOURCE_LABELS[k]}`).join(' + ')||e.label}`;if(e.kind==='repeatTrade')return `${describeEffect({kind:'trade',cost:e.cost,resources:e.resources})}, fino a X volte (X = valore della produzione)`;if(e.kind==='marketBonus')return 'Ottieni un bonus mercato visibile e ancora libero';if(e.kind==='countGain')return `Per ogni ${e.countType==='playedLeader'?'Leader giocato':e.countType}: ${describeEffect({kind:'gain',resources:e.per})}`;if(e.kind==='actionBonus')return `+${e.value} al valore di ${e.action}`;if(e.kind==='discount')return `Sconto per ${e.type}: ${Object.entries(e.resources).map(([k,v])=>`${v} ${RESOURCE_LABELS[k]}`).join(' + ')}`;if(e.kind==='neutralBonus')return `+${e.value} al familiare neutro`;if(e.kind==='coloredValue')return `I familiari colorati hanno valore minimo ${e.value}`;if(e.kind==='councilDiscount')return `−${e.value} moneta al Palazzo del Consiglio`;if(e.kind==='ignoreTowerBonuses')return 'Ignora i bonus dei due piani più alti delle torri';if(e.kind==='doubleTowerBonuses')return 'Raddoppia i bonus dei due piani più alti delle torri';if(e.kind==='virtualTower'){const tower=e.type?` sulla torre ${e.type}`:' sulle torri';const discount=e.discount?`, con sconto ${Object.entries(e.discount).map(([k,v])=>`${v} ${RESOURCE_LABELS[k]}`).join(' + ')}`:'';return `Piazzamento virtuale${tower} con valore ${e.value}${discount}, potenziabile con servitori`;}if(e.kind==='leaderPlayVP')return `${e.value} punto vittoria ogni volta che giochi un Leader permanente`;if(e.kind==='militaryScore')return `${e.vittoria} punto vittoria ogni ${e.per} punti militari`;if(e.kind==='faithScore')return `${e.vittoria} punto vittoria ogni ${e.per} punti fede`;if(e.kind==='resourceMarket')return 'Spendi 1 risorsa tra legno, pietra, servitori e monete → ottieni 2 risorse a scelta tra gli stessi tipi';if(e.kind==='bonusAction')return `Azione ${e.action} di valore ${e.value}`;if(e.kind==='activateBuilding')return `Attiva un Edificio con valore ${e.value}`;if(e.kind==='cappedScore')return `${e.vittoria} punto per ${RESOURCE_LABELS[e.resource]}, massimo ${e.max}`;if(e.kind==='pairedScore')return `${e.vittoria} punti per coppia ${e.resources.map(r=>RESOURCE_LABELS[r]).join(' + ')}, massimo ${e.max}`;if(e.kind==='chooseTrades')return e.options.map(describeEffect).join(' OPPURE ');return e.text;}
export function describeEffects(effects){return effects.length?effects.map(describeEffect).join('; '):'Nessuno';}
