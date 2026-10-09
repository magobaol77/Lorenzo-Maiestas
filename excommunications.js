const tile=(level,number,name,effect,key)=>({id:`scomunica-${level}-${String(number).padStart(2,'0')}`,level,name,effect,key});
export const EXCOMMUNICATIONS=[
 tile(1,1,'Produzione indebolita','−3 al valore di ogni produzione.','productionPenalty'),
 tile(1,2,'Raccolto indebolito','−3 al valore di ogni raccolto.','harvestPenalty'),
 tile(1,3,'Forza militare ridotta','Ogni volta che ottieni punti militari, ne ottieni 1 in meno.','militaryGainPenalty'),
 tile(1,4,'Servitori ridotti','Ogni volta che ottieni servitori, ne ottieni 1 in meno.','servantGainPenalty'),
 tile(1,5,'Materiali ridotti','Quando ottieni legno o pietra, ottieni 1 risorsa in meno; se ottieni entrambi scegli quale ridurre.','materialGainPenalty'),
 tile(1,6,'Entrate ridotte','Ogni volta che ottieni monete, ne ottieni 1 in meno.','coinGainPenalty'),
 tile(1,7,'Dadi indeboliti','I tre dadi colorati hanno valore −1.','coloredDicePenalty'),
 tile(1,8,'Leader onerosi','Per giocare un Leader devi spendere anche 1 punto militare, 1 moneta e 1 servitore.','leaderExtraCost'),
 tile(2,1,'Mercato proibito','Non puoi piazzare familiari al Mercato.','noMarket'),
 tile(2,2,'Imprese ostacolate','−5 al valore delle azioni sulla torre delle Imprese.','towerPenaltyImprese'),
 tile(2,3,'Personaggi ostacolati','−5 al valore delle azioni sulla torre dei Personaggi.','towerPenaltyPersonaggi'),
 tile(2,4,'Edifici ostacolati','−5 al valore delle azioni sulla torre degli Edifici.','towerPenaltyEdifici'),
 tile(2,5,'Territori ostacolati','−5 al valore delle azioni sulla torre dei Territori.','towerPenaltyTerritori'),
 tile(2,6,'Primo turno saltato','Salti la prima azione del round e recuperi l’azione dopo gli altri giocatori.','delayedFirstAction'),
 tile(2,7,'Servitori inefficienti','Servono 2 servitori per aumentare il valore di 1; con Carlo VIII, 2 servitori aumentano il valore di 2.','doubleServantCost'),
 tile(3,1,'Imprese senza gloria','Non ottieni punti finali dalle Imprese.','noVentureScore'),
 tile(3,2,'Territori senza gloria','Non ottieni punti finali dai Territori.','noTerritoryScore'),
 tile(3,3,'Personaggi senza gloria','Non ottieni punti finali dai Personaggi.','noCharacterScore'),
 tile(3,4,'Edifici onerosi','Perdi punti pari alla somma dei costi in legno e pietra dei tuoi Edifici.','buildingCostPenalty'),
 tile(3,5,'Risorse sprecate','Perdi 1 punto per ogni moneta, servitore, legno e pietra rimasti.','leftoverResourcePenalty'),
 tile(3,6,'Leader screditati','Perdi 4 punti per ogni Leader giocato.','leaderScorePenalty'),
 tile(3,7,'Dominio sovraccarico','Per ogni tipologia perdi 5 punti per la quinta carta e altri 5 per la sesta.','largeSetPenalty'),
 tile(3,8,'Prestigio eroso','Prima degli altri conteggi finali perdi 1 punto ogni 5 punti vittoria posseduti.','victoryRatioPenalty'),
 tile(3,9,'Forza militare onerosa','Perdi 1 punto per ogni punto militare posseduto.','militaryScorePenalty')
];
export const EXCOMMUNICATION_LEVELS=[1,2,3].map(level=>EXCOMMUNICATIONS.filter(tile=>tile.level===level));
