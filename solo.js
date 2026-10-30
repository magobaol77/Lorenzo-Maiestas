import {MILITARY_REQUIREMENTS,shuffle,faithVictoryPoints,finalScore} from './engine.js?v=20261030-17';

const COLORS={green:'territori',yellow:'edifici',blue:'personaggi',purple:'imprese'};
const TARGETS=[
 ['green','council','purple','yellow'],['purple','blue','green','council'],['yellow','council','blue','green'],['blue','yellow','purple','council'],
 ['green','council','yellow','blue'],['council','green','blue','purple'],['purple','yellow','council','blue'],['council','purple','yellow','green'],
 ['blue','green','council','purple'],['yellow','purple','blue','council'],['council','blue','green','yellow'],['yellow','purple','council','green']
];
const SECONDARY=[
 ['marketLeft','production','privilege3vp'],['harvest','discardGreen','marketLeft'],['production','marketRight','purpleVP'],['marketRight','faith3','harvest'],
 ['marketLeft','blueVP','harvest'],['military2','harvest','discardYellow'],['faith3','marketLeft','purpleVP'],['blueVP','faithMilitary','marketRight'],
 ['privilege3vp','discardPurple','production'],['faithMilitary','production','marketRight'],['harvest','marketRight','discardBlue'],['military2','production','marketLeft']
];
const SELECTOR=[0,1,2,3,0,1,2,3,0,1,2,3];
const TARGET_LABELS={green:'Torre Territori',yellow:'Torre Edifici',blue:'Torre Personaggi',purple:'Torre Imprese',council:'Palazzo del Consiglio'};
const ACTION_LABELS={marketLeft:'Blocca lo spazio libero più a sinistra del Mercato',marketRight:'Blocca lo spazio libero più a destra del Mercato',production:'Blocca lo spazio principale della Produzione',harvest:'Blocca lo spazio principale del Raccolto',privilege3vp:'Ottiene 1 favore e 3 PV',faith3:'Ottiene 3 fede',military2:'Ottiene 2 punti militari',faithMilitary:'Ottiene 1 fede e 1 punto militare',purpleVP:'Ottiene 1 PV per ogni Impresa posseduta',blueVP:'Ottiene 1 PV per ogni Personaggio posseduto',discardGreen:'Scarta la carta più alta disponibile dalla torre Territori',discardYellow:'Scarta la carta più alta disponibile dalla torre Edifici',discardPurple:'Scarta la carta più alta disponibile dalla torre Imprese',discardBlue:'Scarta la carta più alta disponibile dalla torre Personaggi'};
export const SOLO_CARD_REFERENCE=Array.from({length:12},(_,i)=>{const id=i+1;return{id,leaderIcon:id<=6,front:`assets/solo/solo-${String(id).padStart(2,'0')}-front.webp`,back:`assets/solo/solo-${String(id).padStart(2,'0')}-back.webp`,selector:SELECTOR[i]+1,targets:TARGETS[i].map(x=>TARGET_LABELS[x]),secondary:SECONDARY[i].map(x=>ACTION_LABELS[x]),mainAlternative:'Ottiene tanti PV quanto il dado',secondaryAlternative:'Ottiene 1 favore'};});
const vpAllowed=s=>s.solo.difficulty==='hard';
function gain(s,key,n){if(key==='vittoria'&&!vpAllowed(s))return;s.solo.resources[key]+=n;}
function privilege(s){if(s.solo.resources.militari<=s.resources.militari)s.solo.resources.militari+=2;else s.solo.resources.fede+=1;}
function applyImmediate(s,effects){for(const e of effects||[]){if(e.kind==='gain'){for(const [k,n] of Object.entries(e.resources))if(['militari','fede','vittoria'].includes(k))gain(s,k,n);}else if(e.kind==='privilege'){for(let i=0;i<(e.count||1);i++)privilege(s);}else if(e.kind==='distinctPrivileges'){for(let i=0;i<(e.count||1);i++)privilege(s);}else if(e.kind==='sequence')applyImmediate(s,e.effects);}}
function alt(s,kind,die){if(kind==='main')s.solo.resources.vittoria+=die;else privilege(s);}
function occupyTower(s,type,die,cardData){const cards=s.solo.collection.filter(c=>c.type===type);if(cards.length>=6)return false;for(let level=3;level>=0;level--){if([1,3,5,7][level]>die)continue;const card=s.board[type][level];if(!card)continue;if(type==='territori'&&s.solo.resources.militari<MILITARY_REQUIREMENTS[cards.length])continue;s.board[type][level]=null;s.towerPawns[type].push({player:'lorenzo',pawn:8,level});s.solo.collection.push(card);applyImmediate(s,cardData(card));return true;}return false;}
function blockZone(s,kind){const zones=kind==='harvest'?s.harvestZones:s.productionZones,pawns=kind==='harvest'?s.harvestPawns:s.productionPawns;if(zones[0])return false;zones[0]++;pawns.push({player:'lorenzo',pawn:8,zone:0});return true;}
function marketBlock(s,right=false){const indexes=s.marketSlots.map((_,i)=>i).filter(i=>!s.marketSlots[i].occupied);if(!indexes.length)return false;const i=right?indexes.at(-1):indexes[0];s.marketSlots[i].occupied=true;s.marketSlots[i].occupiedBy='lorenzo';return true;}
function discardTower(s,type){for(let level=3;level>=0;level--)if(s.board[type][level]){s.board[type][level]=null;s.towerPawns[type].push({player:'lorenzo',pawn:8,level});return true;}return false;}
function secondary(s,action,die){let ok=true;if(action==='harvest'||action==='production')ok=blockZone(s,action);else if(action==='marketLeft'||action==='marketRight')ok=marketBlock(s,action==='marketRight');else if(action.startsWith('discard'))ok=discardTower(s,COLORS[action.slice(7).toLowerCase()]);else if(action==='faith3')gain(s,'fede',3);else if(action==='military2')gain(s,'militari',2);else if(action==='faithMilitary'){gain(s,'fede',1);gain(s,'militari',1);}else if(action==='privilege3vp'){privilege(s);gain(s,'vittoria',3);}else if(action==='purpleVP')gain(s,'vittoria',s.solo.collection.filter(c=>c.type==='imprese').length);else if(action==='blueVP')gain(s,'vittoria',s.solo.collection.filter(c=>c.type==='personaggi').length);if(!ok)alt(s,'secondary',die);return ok;}
export function initSolo(s,difficulty='medium',rng=Math.random){s.mode='solo';const deck=shuffle(Array.from({length:12},(_,i)=>i+1),rng),currentId=deck.shift();s.solo={difficulty,resources:{vittoria:0,militari:0,fede:0},collection:[],leaderCards:0,eraSymbols:0,deck,currentId,selectorCardId:deck[0],used:[],current:null,lastResult:null,turnsThisRound:0,nextActor:'player',roundStarter:'player',councilFirst:null,log:[]};return s.solo;}
export function soloNewEra(s,rng=Math.random){s.solo.deck=shuffle(Array.from({length:12},(_,i)=>i+1),rng);s.solo.currentId=s.solo.deck.shift();s.solo.selectorCardId=s.solo.deck[0];s.solo.used=[];s.solo.eraSymbols=0;s.solo.current=null;s.solo.lastResult=null;}
export function soloTurn(s,cardData,rng=Math.random){if(!s.solo)throw Error('Modalità solitaria non preparata.');if(s.solo.nextActor!=='lorenzo')throw Error('Prima devi svolgere la tua azione.');if(s.solo.turnsThisRound>=4)throw Error('Lorenzo ha già svolto quattro turni in questo round.');const before={...s.solo.resources},beforeCards=s.solo.collection.length,id=s.solo.currentId,selectorId=s.solo.deck[0],card={id,front:`assets/solo/solo-${String(id).padStart(2,'0')}-front.webp`,back:`assets/solo/solo-${String(selectorId).padStart(2,'0')}-back.webp`,selectorId},die=1+Math.floor(rng()*6),column=SELECTOR[selectorId-1],target=TARGETS[id-1][column];s.solo.current=card;s.solo.selectorCardId=selectorId;s.solo.used.push(id);s.solo.turnsThisRound++;s.solo.nextActor='player';if(SOLO_CARD_REFERENCE[id-1].leaderIcon)s.solo.eraSymbols++;let placed=false;if(target==='council'){s.councilPawns.push({player:'lorenzo',pawn:8});if(!s.solo.councilFirst)s.solo.councilFirst='lorenzo';if(['medium','hard'].includes(s.solo.difficulty))s.solo.resources.vittoria+=die;placed=true;}else placed=occupyTower(s,COLORS[target],die,cardData);if(!placed)alt(s,'main',die);const acquired=s.solo.collection.length>beforeCards?s.solo.collection.at(-1):null,action=SECONDARY[id-1][Math.floor((die-1)/2)],secondaryDone=secondary(s,action,die),gains=Object.entries(s.solo.resources).map(([key,value])=>({key,value:value-before[key]})).filter(x=>x.value);s.solo.log.unshift(`Fronte ${id}, freccia del retro ${selectorId}, dado ${die}: ${target}; azione secondaria ${action}${secondaryDone?'':' non disponibile'}.`);const result={card,die,target,targetLabel:TARGET_LABELS[target],action,actionLabel:ACTION_LABELS[action],placed,acquired,secondaryDone,selectorId,column,gains,mainText:placed?(acquired?`Prende ${acquired.name} dalla ${TARGET_LABELS[target]}.`:`Piazza un familiare nel ${TARGET_LABELS[target]}.`):`Piazzamento non possibile: ottiene ${die} PV, pari al dado.`,secondaryText:secondaryDone?ACTION_LABELS[action]:`Secondo familiare non piazzabile: ottiene 1 favore.`};s.solo.lastResult=result;if(s.solo.used.length%8!==0){s.solo.currentId=s.solo.deck.shift();s.solo.selectorCardId=s.solo.deck[0];}return result;}
export function soloEndRound(s,completedRound=s.round,councilPlacements=s.councilPawns||[]){s.solo.turnsThisRound=0;const firstCouncil=councilPlacements.find(placement=>placement.player==='lorenzo'||placement.player==='player-1'),councilStarter=firstCouncil?(firstCouncil.player==='lorenzo'?'lorenzo':'player'):null;s.solo.roundStarter=councilStarter||s.solo.councilFirst||s.solo.roundStarter||'player';s.solo.nextActor=s.solo.roundStarter;s.solo.councilFirst=null;if(completedRound%2===0){s.solo.resources.vittoria+=faithVictoryPoints(s.solo.resources.fede);s.solo.resources.fede=0;const n=s.solo.eraSymbols;s.solo.leaderCards+=n>=6?3:n===5?2:n===4?1:0;s.solo.eraSymbols=0;}}
export function soloFinalScore(s){const proxy={collection:s.solo.collection,resources:{monete:0,legno:0,pietra:0,servitori:0,militari:s.solo.resources.militari,fede:s.solo.resources.fede,vittoria:s.solo.resources.vittoria},paidCardCosts:{},playedLeaders:Array.from({length:s.solo.leaderCards},()=>({})),activeExcommunications:[],referencePlayers:2,militaryRank:s.solo.resources.militari>s.resources.militari?1:2,log:[],pending:[]};const score=finalScore(proxy);s.solo.resources.vittoria=score.total;s.solo.finalScore={...score,leaderCards:s.solo.leaderCards};return s.solo.finalScore;}



















