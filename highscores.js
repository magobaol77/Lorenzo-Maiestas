const KEY='lorenzo-maiestas-highscores-v1';
const difficultyLabel={easy:'Facile',medium:'Media',hard:'Difficile'};

export function loadHighScores(){
 try{return JSON.parse(localStorage.getItem(KEY)||'[]');}catch{return[];}
}

function breakdown(score,leaderCount=0){
 const territories=score?.territories||0,buildings=score?.buildings||0,characters=score?.characters||0,ventures=score?.ventures||0,military=score?.military||0,penalties=score?.penalties||0,total=score?.total||0;
 return{base:total-territories-buildings-characters-ventures-military+penalties,territories,buildings,characters,ventures,military,leaders:0,leaderCount,penalties,total};
}

function playedCards(cards=[]){
 return cards.map(card=>({id:card.id,name:card.name,type:card.type,image:card.image}));
}

function playerRecord(player,score=player.finalScore){
 return{name:player.name,...breakdown(score,player.playedLeaders?.length||0),cards:playedCards(player.collection),playedLeaders:playedCards(player.playedLeaders)};
}

export function saveHighScore(state){
 const records=loadHighScores(),id=state.gameId||`${Date.now()}-${Math.random()}`;
 if(records.some(record=>record.id===id))return false;
 let record;
 if(state.mode==='solo'){
  const player=playerRecord(state.playerStates[0],state.playerStates[0].finalScore||state.finalScore),lorenzoScore=breakdown(state.solo.finalScore,state.solo.leaderCards||0),lorenzo={name:'Lorenzo',automa:true,...lorenzoScore,cards:playedCards(state.solo.collection),playedLeaders:[]};
  record={id,date:new Date().toISOString(),mode:'solo',difficulty:state.solo.difficulty,difficultyLabel:difficultyLabel[state.solo.difficulty]||state.solo.difficulty,won:player.total>lorenzo.total,draw:player.total===lorenzo.total,players:[player,lorenzo]};
 }else{
  const players=state.playerStates.map(player=>playerRecord(player)),best=Math.max(...players.map(player=>player.total));
  record={id,date:new Date().toISOString(),mode:'multiplayer',players:players.map(player=>({...player,winner:player.total===best}))};
 }
 records.push(record);records.sort((a,b)=>new Date(b.date)-new Date(a.date));localStorage.setItem(KEY,JSON.stringify(records.slice(0,100)));return true;
}
