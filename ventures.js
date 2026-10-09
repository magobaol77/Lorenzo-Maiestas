const gain=resources=>({kind:'gain',resources});
const manual=text=>({kind:'manual',text});
const entry=(name,cost,military,immediate,endGame,note='')=>({name,cost,military,immediate,endGame,note,implemented:!immediate.some(e=>e.kind==='manual')&&!endGame.some(e=>e.kind==='manual')});
export const VENTURES={};
const eras=[[
 entry('Building the Walls',{pietra:3},null,[gain({militari:2}),{kind:'privilege'}],[gain({vittoria:3})]),
 entry('Raising a Statue',{legno:2,pietra:2},null,[{kind:'distinctPrivileges',count:2}],[gain({vittoria:4})]),
 entry('Military Campaign',{}, {required:3,pay:2},[gain({monete:3})],[gain({vittoria:4})]),
 entry('Hosting Panhandlers',{legno:3},null,[gain({servitori:4})],[gain({vittoria:4})]),
 entry('Fighting Heresies',{}, {required:5,pay:3},[gain({fede:2})],[gain({vittoria:5})]),
 entry('Support to the Bishop',{legno:1,pietra:1,monete:2},{required:4,pay:2},[gain({fede:3})],[gain({vittoria:1})]),
 entry('Hiring Recruits',{monete:4},null,[gain({militari:5})],[gain({vittoria:4})]),
 entry('Repairing the Church',{monete:1,legno:1,pietra:1},null,[gain({fede:2})],[gain({vittoria:4})]),
 entry('Ecclesiastical Mission',{fede:1},{required:2,pay:1,combined:true},[{kind:'leader',count:1}],[gain({vittoria:6})]),
 entry('Household Service',{monete:2,servitori:3},null,[{kind:'leader',count:2}],[gain({vittoria:4})]),
 entry('Public Works',{legno:2,pietra:1},null,[gain({servitori:3})],[{kind:'cappedScore',resource:'servitori',vittoria:1,max:12}],'Nome provvisorio; 1 punto per servitore, massimo 12.'),
 entry('Supply Contract',{monete:1,servitori:1},{required:3,pay:2,combined:true},[gain({legno:2,pietra:2})],[{kind:'pairedScore',resources:['legno','pietra'],vittoria:2,max:12}],'Nome provvisorio; interpretazione del punteggio da verificare.')
],[
 entry('Improving the Canals',{servitori:2,monete:3},null,[{kind:'bonusAction',action:'harvest',value:4}],[gain({vittoria:4})]),
 entry('Hosting Foreigners',{legno:4},null,[gain({servitori:5})],[gain({vittoria:4})]),
 entry('Building the Bastions',{pietra:4},null,[gain({militari:3}),{kind:'privilege'}],[gain({vittoria:3})]),
 entry('Support to the King',{}, {required:6,pay:3},[gain({monete:4}),{kind:'privilege'}],[gain({vittoria:3})]),
 entry('Hiring Soldiers',{monete:6},null,[gain({militari:6})],[gain({vittoria:5})]),
 entry('Repairing the Abbey',{monete:2,legno:2,pietra:2},null,[gain({fede:2,servitori:1})],[gain({vittoria:6})]),
 entry('Crusade',{}, {required:8,pay:4},[gain({monete:5,fede:1})],[gain({vittoria:4})]),
 entry('Support to the Cardinal',{legno:2,pietra:2,monete:3},{required:7,pay:4},[gain({fede:3})],[gain({vittoria:4})]),
 entry('Fortification Works',{pietra:5},null,[gain({servitori:2})],[{kind:'countGain',countType:'territori',per:{vittoria:2}}],'Nome provvisorio.'),
 entry('Diplomatic Mission',{monete:2,servitori:3},null,[{kind:'privilege'}],[{kind:'countGain',countType:'personaggi',per:{vittoria:2}}]),
 entry('Urban Expansion',{legno:5},null,[gain({monete:2})],[{kind:'countGain',countType:'edifici',per:{vittoria:2}}],'Nome provvisorio.'),
 entry('Stone Commission',{monete:1,legno:2,pietra:3},null,[gain({militari:2})],[{kind:'countGain',countType:'imprese',per:{vittoria:2}}])
],[
 entry('Hiring Mercenaries',{monete:8},null,[gain({militari:7})],[gain({vittoria:7})]),
 entry('Repairing the Cathedral',{monete:3,legno:3,pietra:3},null,[gain({fede:1}),{kind:'virtualTower',value:7}],[gain({vittoria:5})]),
 entry('Building the Towers',{pietra:6},null,[gain({militari:4}),{kind:'privilege'}],[gain({vittoria:5})]),
 entry('Promoting Sacred Art',{legno:6},null,[gain({fede:3})],[gain({vittoria:4})]),
 entry('Military Conquest',{}, {required:12,pay:6},[gain({legno:3,pietra:3,monete:3})],[gain({vittoria:7})]),
 entry('Improving the Roads',{servitori:3,monete:4},null,[{kind:'bonusAction',action:'production',value:3}],[gain({vittoria:5})]),
 entry('Sacred War',{}, {required:15,pay:8},[gain({fede:4})],[gain({vittoria:7})]),
 entry('Support to the Pope',{legno:3,pietra:3,monete:3},{required:10,pay:5},[gain({fede:2})],[gain({vittoria:9})]),
 entry('Grand Construction',{pietra:7,legno:7},null,[{kind:'virtualTower',value:5}],[gain({vittoria:7})]),
 entry('Royal Crusade',{monete:6},{required:12,pay:6},[gain({fede:4})],[gain({vittoria:10})],'Nome provvisorio.'),
 entry('Trade Monopoly',{monete:4,legno:3,pietra:3},null,[{kind:'distinctPrivileges',count:3}],[gain({vittoria:10})]),
 entry('Great Patronage',{servitori:5},{required:14,pay:7},[gain({monete:3}),{kind:'activateBuilding',value:6}],[gain({vittoria:12})])
]];
eras.forEach((cards,era)=>cards.forEach((card,n)=>VENTURES[`imprese-${era+1}-${String(n+1).padStart(2,'0')}`]=card));
export function ventureCostOptions(state,venture){if(venture.military?.combined)return state.resources.militari>=venture.military.required?[{kind:'combined',label:`Paga le risorse e ${venture.military.pay} punti militari`}]:[];const options=[];if(Object.keys(venture.cost).length)options.push({kind:'resources',label:'Paga con risorse'});if(venture.military&&state.resources.militari>=venture.military.required)options.push({kind:'military',label:`Paga ${venture.military.pay} punti militari`});return options;}
