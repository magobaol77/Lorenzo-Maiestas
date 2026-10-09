# Lorenzo — prototipo solitario

Aprire con un server statico dalla cartella dist. Nessuna dipendenza o compilazione richiesta.

## Struttura
- dist/engine.js: stato, campionamento e progressione dei sei turni.
- dist/cards.js: catalogo delle 144 carte, 12 per ciascuna delle 12 combinazioni epoca/tipo.
- dist/app.js: tavolo, gestione manuale delle azioni e interfaccia.
- dist/assets: ritagli delle tavole fornite dall’utente.

## Regole implementate
Estrazione senza reinserimento di 8 carte su 12 per epoca e tipo all’avvio. Quattro carte per torre per turno, due turni per epoca, tre epoche. Dadi da 1 a 6, familiare neutro a 0, servitori per incrementare il valore. Valori piani 1/3/5/7. Quattro familiari per turno. Risorse iniziali dal regolamento base per il primo giocatore.

## Limiti intenzionali dello scheletro
Tavolo manuale, non partita completa con arbitro: costi, bonus dei piani, vincoli di torre, effetti, capienza carte, requisiti militari, leader, scomuniche e punteggio finale non sono automatizzati. Nessun automa inventato. Mercato visualizzato come riferimento, senza ipotizzare il nuovo sistema di disponibilità. Azioni registrate manualmente e contatori modificabili. Stato solo in memoria; ricaricare azzera la partita.

## Mappatura da confermare
Territori: ogni riga è un’epoca. Altre tavole: righe 1+4 = epoca I, 2+5 = II, 3+6 = III (sei carte per riga). Identificativi assegnati per posizione, poiché varie carte nuove non hanno titolo univoco. Conservati i testi originali nelle immagini. Per modificare le epoche aggiornare cards.js.
