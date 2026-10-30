import {acquisitionStatus,acquire,harvest,harvestPreview,production,productionPreview,market,council,resolvePending,resolveVirtualTower,leaderRequirementMet,playLeader,discardLeaderForPrivilege,activateLeader,nextPlayer,pawnValue,vaticanStatus,resolveVatican} from './engine.js?v=20261030-17';
import {TERRITORIES,PRIVILEGES} from './territories.js?v=20261030-17';
import {BUILDINGS} from './buildings.js?v=20261030-17';
import {CHARACTERS} from './characters.js?v=20261030-17';
import {VENTURES} from './ventures.js?v=20261030-17';

const TYPES=['territori','edifici','personaggi','imprese'];
const RESOURCE_KEYS=['monete','legno','pietra','servitori','militari','fede','vittoria'];
const MARKET_VALUE={'mercato-01':6,'mercato-02':6,'mercato-03':7,'mercato-04':7,'mercato-05':7,'mercato-06':7,'mercato-07':7,'mercato-08':7,'mercato-09':8,'mercato-10':8};

export function strategyFromLeaders(leaders=[]){
 const weights={territori:1,edifici:1,personaggi:1,imprese:1};
 for(const leader of leaders){const r=leader.requirementSpec||{};for(const type of TYPES)weights[type]+=(r[type]||0)*1.7;if(r.totalCards)for(const type of TYPES)weights[type]+=r.totalCards/8;const text=`${leader.requirement} ${leader.effect}`.toLowerCase();for(const [type,words] of Object.entries({territori:['territor','raccolto'],edifici:['edific','produzione'],personaggi:['personagg','leader'],imprese:['impres','militar']}))if(words.some(word=>text.includes(word)))weights[type]+=2;}
 return{weights,primary:[...TYPES].sort((a,b)=>weights[b]-weights[a])[0]};
}

export function leaderDraftValue(leader,owned=[]){
 const profile=strategyFromLeaders([...owned,leader]),r=leader.requirementSpec||{},specific=TYPES.reduce((sum,type)=>sum+(r[type]||0),0);
 return profile.weights[profile.primary]+specific+(leader.oncePerRound?2:0)+(leader.onPlay?1:0);
}

function snapshot(s){return{resources:{...s.resources},cards:s.collection.length,leaders:s.playedLeaders.length};}
function delta(before,s){return RESOURCE_KEYS.map(key=>({key,value:(s.resources[key]||0)-(before.resources[key]||0)})).filter(item=>item.value);}
function resourceNeed(s,key){const target={monete:6,legno:4,pietra:4,servitori:3,militari:7,fede:5,vittoria:0}[key]||0;return Math.max(0,target-(s.resources[key]||0));}
function effectValue(effects=[],s){let value=0;for(const effect of effects||[]){if(effect.kind==='gain')for(const [key,n] of Object.entries(effect.resources||{}))value+=n*({vittoria:1.5,fede:1.3,militari:1.1,monete:1,legno:1,pietra:1,servitori:.9}[key]||1)+Math.min(2,resourceNeed(s,key))*.35;else if(effect.kind==='privilege')value+=2.5*(effect.count||1);else if(effect.kind==='leader')value+=3*(effect.count||1);else if(effect.kind==='bonusAction'||effect.kind==='virtualTower')value+=4;else if(effect.kind==='sequence')value+=effectValue(effect.effects,s);else value+=1.5;}return value;}
function cardData(card){return TERRITORIES[card.id]||BUILDINGS[card.id]||CHARACTERS[card.id]||VENTURES[card.id]||{};}
function cardValue(card,s,profile){const data=cardData(card),count=s.collection.filter(c=>c.type===card.type).length,completion=count===5?8:count===4?4:0;return 3+profile.weights[card.type]*1.3+completion+effectValue(data.immediate,s)+effectValue(data.harvest||data.production||data.permanent||data.endGame,s)*.65;}
function chooseByDifficulty(options,difficulty,rng){const sorted=[...options].sort((a,b)=>b.score-a.score);if(difficulty==='hard'||sorted.length===1)return sorted[0];if(difficulty==='medium')return sorted[Math.floor(rng()*Math.min(2,sorted.length))];return sorted[Math.floor(rng()*Math.min(4,sorted.length))];}
function bestZone(s,kind){const preview=kind==='harvest'?harvestPreview:productionPreview;for(const zone of [0,1,2,3])try{return{zone,...preview(s,zone)};}catch{}return null;}
function planActions(s,profile){const actions=[],original={selected:s.selected,servants:s.servants};for(const pawn of [0,1,2,3]){if(s.used.includes(pawn))continue;for(let servants=0;servants<=Math.min(s.resources.servitori,4);servants++){s.selected=pawn;s.servants=servants;for(const type of TYPES)for(let level=0;level<4;level++){const card=s.board[type]?.[level];if(!card)continue;const status=acquisitionStatus(s,type,level);if(status.ok)actions.push({kind:'tower',type,level,pawn,servants,card,score:cardValue(card,s,profile)-servants*.65});}for(const kind of ['harvest','production']){const preview=bestZone(s,kind);if(preview){const cards=preview.cards.filter(c=>!c.printed),base=cards.reduce((sum,c)=>sum+effectValue(c.printed?c.effects:kind==='harvest'?TERRITORIES[c.id]?.harvest:BUILDINGS[c.id]?.production,s),0);actions.push({kind,pawn,servants,zone:preview.zone,value:preview.value,score:2+base+cards.length*profile.weights[kind==='harvest'?'territori':'edifici']*.45-servants*.6});}}if(!s.activeExcommunications?.some(tile=>tile.key==='noMarket')&&pawnValue(s)>=1)for(let index=0;index<s.marketSlots.length;index++){const slot=s.marketSlots[index];if(!slot.occupied)actions.push({kind:'market',index,pawn,servants,score:(MARKET_VALUE[slot.id]||5)+Math.max(...Object.values(profile.weights))*.15-servants*.7});}const position=(s.turnOrder||s.players).indexOf(s.playerStates[s.activePlayerIndex].id),lateBonus=position>=Math.max(1,s.players.length-1)?3:0;actions.push({kind:'council',pawn,servants,score:2.5+lateBonus-servants*.7});}}
 s.selected=original.selected;s.servants=original.servants;return actions;}
function executeAction(s,a){s.selected=a.pawn;s.servants=a.servants;if(a.kind==='tower'){acquire(s,a.type,a.level);return`acquisisce ${a.card.name} dalla Torre ${a.type}`;}if(a.kind==='harvest'){const result=harvest(s,a.zone);return`esegue un Raccolto di valore ${result.value}`;}if(a.kind==='production'){const result=production(s,a.zone);return`esegue una Produzione di valore ${result.value}`;}if(a.kind==='market'){const slot=market(s,a.index);return`usa ${slot.id} al Mercato`;}council(s);return'va al Palazzo del Consiglio';}
function pendingChoice(s,p,profile){if(p.kind==='privilege'){const scores=PRIVILEGES.map((effect,index)=>({index,score:effectValue([effect],s)}));return chooseByDifficulty(scores,'hard',Math.random).index;}if(p.kind==='distinctPrivileges')return 0;if(p.kind==='playLeaderFree')return s.leaderHand.reduce((best,leader,index)=>leaderDraftValue(leader,s.playedLeaders)>best.score?{index,score:leaderDraftValue(leader,s.playedLeaders)}:best,{index:0,score:-1}).index;if(p.kind==='resourceMarket'){if(!p.stage)return p.resources.reduce((best,key,index)=>(s.resources[key]||0)>(s.resources[p.resources[best]]||0)?index:best,0);return p.resources.reduce((best,key,index)=>resourceNeed(s,key)>resourceNeed(s,p.resources[best])?index:best,0);}if(p.kind==='bonusAction')return Math.min(s.resources.servitori,Math.max(0,3-p.value));if(p.kind==='activateTerritory'){const cards=s.collection.filter(c=>c.type==='territori'&&TERRITORIES[c.id].threshold<=p.value);return cards.reduce((best,card,index)=>effectValue(TERRITORIES[card.id].harvest,s)>best.score?{index,score:effectValue(TERRITORIES[card.id].harvest,s)}:best,{index:0,score:-1}).index;}if(p.kind==='activateBuilding'){const cards=s.collection.filter(c=>c.type==='edifici'&&(BUILDINGS[c.id].threshold==='X'||BUILDINGS[c.id].threshold<=p.value));return cards.reduce((best,card,index)=>effectValue(BUILDINGS[card.id].production,s)>best.score?{index,score:effectValue(BUILDINGS[card.id].production,s)}:best,{index:0,score:-1}).index;}if(p.kind==='repeatTrade')return Math.max(1,Math.min(p.maxUses,...Object.entries(p.cost||{}).map(([key,n])=>Math.floor(s.resources[key]/n))));if(p.kind==='materialPenalty')return(s.resources.legno||0)>=(s.resources.pietra||0)?'legno':'pietra';if(p.kind==='marketBonus')return 0;if(p.kind==='manual')return'manual';if(p.kind==='trade')return 0;if(p.kind==='chooseTrades'||p.options)return 0;if(p.kind==='copyTerritory'||p.kind==='copyCharacterImmediate')return 0;return 0;}
function resolveAll(s,profile){let guard=0;while(s.pending.length&&guard++<30){const p=s.pending[0];if(p.kind==='virtualTower'){let chosen=null;for(let servants=0;servants<=s.resources.servitori;servants++)for(const type of TYPES)for(let level=0;level<4;level++){if(p.type&&p.type!==type)continue;const card=s.board[type]?.[level];if(!card)continue;const status=acquisitionStatus(s,type,level,p.value,servants,p.discount||{});if(status.ok){const score=cardValue(card,s,profile)-servants*.6;if(!chosen||score>chosen.score)chosen={type,level,servants,score};}}if(chosen)resolveVirtualTower(s,chosen.type,chosen.level,chosen.servants);else resolvePending(s,'skip');continue;}try{resolvePending(s,pendingChoice(s,p,profile));}catch{try{resolvePending(s,'skip');}catch{s.pending.shift();}}}}
function freeLeaderActions(s,profile){for(let guard=0;guard<8;guard++){const index=s.leaderHand.findIndex(leader=>leaderRequirementMet(s,leader));if(index<0)break;try{playLeader(s,index);resolveAll(s,profile);}catch{break;}}for(let i=0;i<s.playedLeaders.length;i++){const leader=s.playedLeaders[i];if(leader.oncePerRound&&!s.leaderUses?.[leader.id]){try{activateLeader(s,i);resolveAll(s,profile);}catch{}}}if(s.round>=5&&s.leaderHand.length){let worst=0;for(let i=1;i<s.leaderHand.length;i++)if(leaderDraftValue(s.leaderHand[i],s.playedLeaders)<leaderDraftValue(s.leaderHand[worst],s.playedLeaders))worst=i;try{discardLeaderForPrivilege(s,worst);resolveAll(s,profile);}catch{}}}

export function runAutomaTurn(s,rng=Math.random){const player=s.playerStates[s.activePlayerIndex];if(player?.kind!=='automa')throw Error('Il giocatore attivo non è un automa.');const before=snapshot(s),profile=strategyFromLeaders([...(s.leaderHand||[]),...(s.playedLeaders||[])]);freeLeaderActions(s,profile);const options=planActions(s,profile);if(!options.length)throw Error('L’automa non ha azioni legali disponibili.');const action=chooseByDifficulty(options,player.difficulty||'medium',rng),description=executeAction(s,action);resolveAll(s,profile);freeLeaderActions(s,profile);const report={player:player.name,difficulty:player.difficulty||'medium',strategy:profile.primary,description,changes:delta(before,s),cardsGained:s.collection.slice(before.cards).map(card=>card.name),leadersPlayed:s.playedLeaders.slice(before.leaders).map(leader=>leader.name)};s.lastAutomaSummary=report;s.log.unshift(`${player.name}: ${description}. Strategia ${profile.primary}.`);return report;}

export function automaDefendsVatican(s){const status=vaticanStatus(s),player=s.playerStates[s.activePlayerIndex];if(!status||player?.kind!=='automa')return null;const harmful=/(perdi|non ottieni|riduci|meno|−|paghi|costo)/i.test(status.tile.effect),difficulty=player.difficulty||'medium',defend=status.canDefend&&(harmful||status.points>=({easy:8,medium:5,hard:3}[difficulty]||5));resolveVatican(s,defend);return{player:player.name,defend,status};}

export function passAfterAutoma(s){return nextPlayer(s);}

















