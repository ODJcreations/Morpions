

const touches = document.querySelectorAll('.touches');
const ecran = document.querySelector('.ecran');
const morpions = document.querySelector('.morpions');
const bouton = document.querySelector('.bouton');
const boutonOK = document.querySelector('.boutonOK');
const lblSoreX = document.querySelector('.scoreX');
const lblSoreO = document.querySelector('.scoreO');

let labelx = document.querySelector('.labelX');
let labelo = document.querySelector('.labelO');
let valeurX = document.getElementById("joueurx");
let valeurO = document.getElementById("joueuro");
var choixPartie = document.getElementById('partie');

var partie = false;
var caseJoue = "";
var titre = "";
var compte = 0;
var gagnant = "";
var compteX = 0;
var compteO = 0;
var jX = "";
var jO = "";
var joueurSuivant = "";
let newPartie;
let local;
var signe = "";

// chargement des parties existantes
for (let i = 0; i < localStorage.length; i++) {
    choixPartie.options[choixPartie.length] = new Option(localStorage.key(i));
}
// sélection d'une partie dans la liste
choixPartie.addEventListener('change', () => {
    local = choixPartie.options[choixPartie.selectedIndex].label;
    chargerPartie();
})

// ------------------------- chargement d'une partie
function chargerPartie() {
    const nomJoueur = local.split('_');
    jX = (nomJoueur[1]);
    jO = (nomJoueur[2]);
    valeurX.value = jX;
    valeurO.value = jO;

    local = JSON.parse(localStorage.getItem(`Partie_${jX}_${jO}`));
    signe = local.joueurSuivant;
    document.getElementById("btn1").click(); // fait un clic fictif sur un bouton du clavier
    document.getElementById("btn1").textContent = "";

    if (local != null) {
        document.querySelector('.scoreX').innerText = local.scoreJoueurX;
        compteX = parseInt(local.scoreJoueurX);
        document.querySelector('.scoreO').innerText = local.scoreJoueurO;
        compteO = parseInt(local.scoreJoueurO);
        activeClavier();

    } else if (local == undefined) {
        recharger();
        return;
    } else {
        local = choixPartie.options[choixPartie.selectedIndex].label;
        const nomJoueur = local.split('_');
        console.log(nomJoueur);
        jX = (nomJoueur[1]);
        jO = (nomJoueur[2]);
        labelx.innerHTML = "";
        labelo.innerHTML = "";
        alert(`Je n'ai pas trouvé la partie [ ${jX} vs ${jO} ]`)
    }
}

function sauverPartie() {
    newPartie = `Partie_${jX}_${jO}`;
    const user = {
        joueurX: jX,
        joueurO: jO,
        joueurSuivant: signe,
        scoreJoueurX: compteX,
        scoreJoueurO: compteO
    }
    localStorage.setItem(newPartie, JSON.stringify(user));
    choixPartie.options[choixPartie.length] = new Option(newPartie, true);
    partie = true; // confirme que la partie a été sauvée
}
// ajouter une partie à la liste des parties
function addPartie(newPartie) {
    let partie = getItem();
    partie.push(newPartie);
}

// confirmation de la mise à zéro de la partie
function confirmAction() {
    let confirmAction = confirm(`Attention, la partie va être perdu
    voulez-vous sauver avant ?`);
    if (confirmAction) {
        sauverPartie();
        alert("La partie a été sauvée !!");
    }
}

function apropos() {
    document.getElementById('aPropos').style.display = "block";
    document.getElementById('aPropos').style.transform = scale(1);
}

function recharger() {
    if (partie != true) {
        confirmAction();
    }
    location.reload();
    boutonOK.style.disabled = "none";
    boutonOK.style.pointerEvents = "auto";
    boutonOK.style.opacity = '1';
}

// débloquage du clavier de jeu
function activeClavier() {
    if (valeurX.value === "" || valeurO.value === "") {
        document.getElementById('alerteJoueurs').style.display = "block";
        return;
    }

    morpions.style.opacity = '1';
    morpions.style.pointerEvents = 'auto';
    var inputX = document.getElementById("joueurx").value;
    var inputO = document.getElementById("joueuro").value;
    jX = inputX;
    jO = inputO;
    labelx.innerHTML = jX;
    labelo.innerHTML = jO;
    boutonOK.style.disabled = "true";
    boutonOK.style.pointerEvents = "none";
    boutonOK.style.opacity = '0.4';
    partie = true;
}

// cache la fenêtre d'alerte (joueurs) pour libérer le clavier
function fermeAlerte() {
    document.getElementById('alerteJoueurs').style.display = "none";
    document.getElementById('aPropos').style.display = "none";
}

touches.forEach((item) => {
    item.addEventListener('click', (e) => {
        partie = false;
        // annule les clicks, tant que le choix d'un joueur n'a pas été fait
        if (signe === "") {
            if (titre.innerHTML === "Tic Tac Toe") {
                ecran.textContent = 'Select a player';
            } else {
                ecran.textContent = 'Sélectionnez un joueur';
            }
            return
        };

        // si la case jouée n'est pas vide
        if (e.target.innerText !== "") { return };

        // si les 9 cases ont été jouées, les clics suivants sont annulés
        if (compte === 9) {
            return
        }
        // change le signe après un click sur une case
        // et affichage du joueur suivant
        if (signe === 'x') {
            e.target.innerText = signe;
            if (titre.innerHTML === "Tic Tac Toe") {
                ecran.textContent = jO.toUpperCase() + " it's up to you";
            } else {
                ecran.textContent = jO.toUpperCase() + " c'est à toi";
            }
            trouveGagnant();
            document.getElementById('ecran').style.color = 'white';
            signe = 'o';
        }
        else if (signe === 'o') {
            e.target.innerText = signe;
            if (titre.innerHTML === "Tic Tac Toe") {
                ecran.textContent = jX.toUpperCase() + " it's up to you";
            } else {
                ecran.textContent = jX.toUpperCase() + " c'est à toi";
            }
            trouveGagnant();
            document.getElementById('ecran').style.color = 'white';
            signe = 'x';
        }

        // annonce la fin du jeu sans gagnant
        if (compte === 8) {
            document.getElementById('ecran').style.color = 'red';
            if (titre.innerHTML === "Tic Tac Toe") {
                ecran.textContent = "There is no winner !!"
            } else {
                ecran.textContent = "Pas de gagnant !!"
            }
        }

        // si un joueur gagne avant que toutes les cases soient remplies,
        // les clics suivants sont annulés
        if (compte === 9) {
            return
        }
        compte += 1;
    })
});

function nextPlayer() {
    // change le signe après un click sur une case
    // et affichage du joueur suivant
    if (signe === 'x') {
        e.target.innerText = signe;
        if (titre.innerHTML === "Tic Tac Toe") {
            ecran.textContent = jO.toUpperCase() + " it's up to you";
        } else {
            ecran.textContent = jO.toUpperCase() + " c'est à toi";
        }
        trouveGagnant();
        document.getElementById('ecran').style.color = 'white';
        signe = 'o';
    }
    else if (signe === 'o') {
        e.target.innerText = signe;
        if (titre.innerHTML === "Tic Tac Toe") {
            ecran.textContent = jX.toUpperCase() + " it's up to you";
        } else {
            ecran.textContent = jX.toUpperCase() + " c'est à toi";
        }
        trouveGagnant();
        document.getElementById('ecran').style.color = 'white';
        signe = 'x';
    }
}

// affiche le joueur gagnant et incrémente son score
function ecranGagnant() {
    if (signe === 'x') {
        if (titre.innerHTML === "Tic Tac Toe") {
            ecran.textContent = jX.toUpperCase() + ' you win this part !!';
        } else {
            ecran.textContent = jX.toUpperCase() + ' tu gagnes la partie';
        }
    } else if (signe === 'o') {
        if (titre.innerHTML === "Tic Tac Toe") {
            ecran.textContent = jO.toUpperCase() + ' you win this part !!';
        } else {
            ecran.textContent = jO.toUpperCase() + ' tu gagnes la partie';
        }
    }


    // affiche le score
    if (signe === 'x') {
        document.querySelector('.scoreX').innerText = compteX += 1;
    } else {
        document.querySelector('.scoreO').innerText = compteO += 1;
    }
    document.getElementById('ecran').style.color = 'yellow';
    compte = 9;
}

// controle si l'un des joueurs a 3 cases alignées
function trouveGagnant() {
    // horizontal
    if (btn1.innerText === 'x' && btn2.innerText === 'x' && btn3.innerText === 'x' ||
        (btn1.innerText === 'o' && btn2.innerText === 'o' && btn3.innerText === 'o')) {
        ecranGagnant()
        btn1.style.backgroundColor = 'pink';
        btn2.style.backgroundColor = 'pink';
        btn3.style.backgroundColor = 'pink';
    } else if (btn4.innerText === 'x' && btn5.innerText === 'x' && btn6.innerText === 'x' ||
        (btn4.innerText === 'o' && btn5.innerText === 'o' && btn6.innerText === 'o')) {
        ecranGagnant()
        btn4.style.backgroundColor = 'pink';
        btn5.style.backgroundColor = 'pink';
        btn6.style.backgroundColor = 'pink';
    } else if (btn7.innerText === 'x' && btn8.innerText === 'x' && btn9.innerText === 'x' ||
        (btn7.innerText === 'o' && btn8.innerText === 'o' && btn9.innerText === 'o')) {
        ecranGagnant()
        btn7.style.backgroundColor = 'pink';
        btn8.style.backgroundColor = 'pink';
        btn9.style.backgroundColor = 'pink';
    }

    // vertical
    if (btn1.innerText === 'x' && btn4.innerText === 'x' && btn7.innerText === 'x' ||
        (btn1.innerText === 'o' && btn4.innerText === 'o' && btn7.innerText === 'o')) {
        ecranGagnant()
        btn1.style.backgroundColor = 'pink';
        btn4.style.backgroundColor = 'pink';
        btn7.style.backgroundColor = 'pink';
    } else if (btn2.innerText === 'x' && btn5.innerText === 'x' && btn8.innerText === 'x' ||
        (btn2.innerText === 'o' && btn5.innerText === 'o' && btn8.innerText === 'o')) {
        ecranGagnant()
        btn5.style.backgroundColor = 'pink';
        btn2.style.backgroundColor = 'pink';
        btn8.style.backgroundColor = 'pink';
    } else if (btn3.innerText === 'x' && btn6.innerText === 'x' && btn9.innerText === 'x' ||
        (btn3.innerText === 'o' && btn6.innerText === 'o' && btn9.innerText === 'o')) {
        ecranGagnant()
        btn9.style.backgroundColor = 'pink';
        btn6.style.backgroundColor = 'pink';
        btn3.style.backgroundColor = 'pink';
    }

    // diagonal
    if (btn1.innerText === 'x' && btn5.innerText === 'x' && btn9.innerText === 'x' ||
        (btn1.innerText === 'o' && btn5.innerText === 'o' && btn9.innerText === 'o')) {
        ecranGagnant()
        btn1.style.backgroundColor = 'pink';
        btn5.style.backgroundColor = 'pink';
        btn9.style.backgroundColor = 'pink';
    } else if (btn3.innerText === 'x' && btn5.innerText === 'x' && btn7.innerText === 'x' ||
        (btn3.innerText === 'o' && btn5.innerText === 'o' && btn7.innerText === 'o')) {
        ecranGagnant()
        btn7.style.backgroundColor = 'pink';
        btn5.style.backgroundColor = 'pink';
        btn3.style.backgroundColor = 'pink';
    }
}

// vide toutes les cases et retire la couleur des cases gagnantes
function videCases() {
    btn1.innerText = ""; btn1.style.backgroundColor = 'transparent';
    btn2.innerText = ""; btn2.style.backgroundColor = 'transparent';
    btn3.innerText = ""; btn3.style.backgroundColor = 'transparent';
    btn4.innerText = ""; btn4.style.backgroundColor = 'transparent';
    btn5.innerText = ""; btn5.style.backgroundColor = 'transparent';
    btn6.innerText = ""; btn6.style.backgroundColor = 'transparent';
    btn7.innerText = ""; btn7.style.backgroundColor = 'transparent';
    btn8.innerText = ""; btn8.style.backgroundColor = 'transparent';
    btn9.innerText = ""; btn9.style.backgroundColor = 'transparent';
    compte = 0;
    if (signe === "") { return };
    document.getElementById('ecran').style.color = 'white';

    if (signe === "x") {
        if (titre.innerHTML === "Tic Tac Toe") {
            ecran.textContent = jX.toUpperCase() + " it's up to you";
        } else {
            ecran.textContent = jX.toUpperCase() + " c'est à toi";
        }
    } else if (signe === "o") {
        if (titre.innerHTML === "Tic Tac Toe") {
            ecran.textContent = jO.toUpperCase() + " it's up to you";
        } else {
            ecran.textContent = jO.toUpperCase() + " c'est à toi";
        }
    }
}

// choix de la langue et du drapeau
function flag() {
    var select = document.getElementById('language');
    var value = select.options[select.selectedIndex].value;
    if (value === "en") {
        document.getElementById("iconFlag").src = "./images/English.png";
        titre = document.querySelector('.titre');
        titre.innerText = "Tic Tac Toe";
        document.getElementById("joueur").innerText = "which player begins ?"
        document.querySelector('.reset').innerHTML = "New game";
        document.querySelector('.jouerEncore').innerHTML = "Play again";
        document.querySelector('.jouerEncore').title = "do another part";
        document.querySelector('.reset').title = "Reset the game";
        ecran.textContent = "Welcome"
    } else if (value === "fr") {
        document.getElementById("iconFlag").src = "./images/France.png";
        titre = document.querySelector('.titre');
        titre.innerText = "morpion";
        document.querySelector('.titre').innerText = "Morpions";
        document.getElementById("joueur").innerText = "Quel joueur commence ?"
        document.querySelector('.reset').innerHTML = "Recommencer";
        document.querySelector('.jouerEncore').innerHTML = "Nouvelle partie";
        document.querySelector('.jouerEncore').title = "Rejouer une partie";
        document.querySelector('.reset').title = "Reprendre le jeu à zéro";
        ecran.textContent = "Bienvenue"
    }
}

// choix du joueur qui doit ommencer la partie
// la requette est lancée depuis le HTML (input radio)
function joueur(choix) {
    signe = choix;
    document.getElementById('X').disabled = true;
    document.getElementById('O').disabled = true;
    ecran.textContent = '';
}

titre = document.querySelector('.titre').innerText = "Morpions";

