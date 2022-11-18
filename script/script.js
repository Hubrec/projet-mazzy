const fond = document.querySelector('body'); // récupère l'élément body du html ce qui permet de modifier tout le flux html facilement

const settings = document.querySelector('div'); // récupère l'élément qui coprends l'intégralité de la page settings

// récupère dans le flux html tous les bouttons
const btnStart = document.querySelector('button');
const btnSet = document.getElementById('settings');
const btnAugm = document.getElementById('augm');
const btnDim = document.getElementById('dim');
const btnEsc = document.getElementById('esc');
const btnStyle1 = document.getElementById('style1');
const btnStyle2 = document.getElementById('style2');
const btnStyle3 = document.getElementById('style3');
const btnStyle4 = document.getElementById('style4');

// récupère dans le flux html tout le reste des éléments qui seront modifiés dans le code
const meterTaille = document.querySelector('meter');
const dataNbParties = document.getElementById('parties');
const dataScore = document.getElementById('score');
const dataMoyen = document.getElementById('moyenne');
const dataPercent = document.getElementById('message');
const hVal = document.getElementById('hval');
const root = document.documentElement; // récupère les variables root du document html

const MUR = 0; // constante désignant la valeur d'une case sol
const SOL = 1; // constante désignant la valeur d'une case mur
const canvas = document.createElement("canvas"); // crée l'objet canvas qui permet d'écrire et dessiner dans le flux html
const ctx = canvas.getContext('2d'); // crée le context 2d associé au canvas qui permet de dessiner librement dedan

var taille = 25; // taille en longueur et largeur du tableau et donc du labyrinthe, initialisé a 25 par défaut car c'est une taille optimisée pour découvrir le jeu, a savoir toutes les valeurs de tailles sont impaire afin d'avoir un mur entourant et pour la simplicité du code
var incr = 1; // variable utile lors de la création du labyrinthe, donne le nombre (la famille) des cases une par une
var score = 0; // variable du nombre de déplacements dans une partie

var colorEnd = "green"; // couleur de la case d'arrivée
var colorHead = "orange"; // couleur du tracé du personnage
var colorWalls = "black"; // couleur des murs du labyrinthe
var colorWay = "yellow"; // couleur de la tête du personnage

var far = [taille - 1, taille - 2]; // valeur de l'arrivée, initialisée dans le coin du labyrinthe puis changé a la valeur la plus loin du labyrinthe ensuite
var character = [0, 1]; // position du joueur dans le labyrynthe avec les paramètres x et y
var mazeTab; // tableau qui stocke les données du labyrinthe
var bigVal = 0; // variable qui stockera dans le programme la plus grande valeur en distance au départ dans le labyrinthe
var gameStarted = false; // boolean qui détermine si une partie est lancée
var wayBack = false; // boolean qui détermine si les distances sont calculées depuis le départ ou depuis l'arrivée
var globalScore = 0; // variable du score sur la session, sé réinitialise au rechargement de la page
var nbParties = 0; // variable du nombre de parties lancées, peu imports si on les a fini, pareil qu'au dessus
var percentPlayer = 0; // variable gameplay qui dit au joueur a quel point il est bon au jeu, attention cette variable ne représente pas le vrai classement du joueur mais simplement a quel point il est loin de la meilleur moyenne possible par partie (cette moyenne étant de 302)
var speedUp = false; // boolean qui détermine si l'avance rapide est instantanée, s'active au boutton A
var tailleCase = 0; // taille en picel d'une case calculée en fonction de la taille de la frame et du nombre de cases
var l; // variable de la taille du labyrinthe qui vaux la la taille de la frame arrondi pour que le nombre de cases tombe à l'entier pile
var drdBool = false; // boolean qui détermine si l'aide a la distance est activée, activable avec la touche C

fond.removeChild(settings); //enlève les explications présentes de base dans le html

//gestionnaire des touches enfoncées du clavier, elle va lance la plupart des ineractions entre le joueur et le jeu dans le programme
document.onkeydown = function handleKeyDown(e) {

    var key = e.keyCode;

    if (gameStarted) {
        
        ctx.fillStyle = colorHead;
        ctx.fillRect( character[0] * tailleCase, character[1] * tailleCase, tailleCase, tailleCase);

        switch(key) {
            case 37: // left
                if (character[0] != 0) {
                    if (mazeTab[character[0] - 1][character[1]] != MUR) {
                        character[0] -= 1;
                        score++;
                    }
                }
                break;
            case 38: // up
                if (character[1] != 0) {
                    if (mazeTab[character[0]][character[1] - 1] != MUR) {
                        character[1] -= 1;
                        score++;
                    }
                }
                break;
            case 39: // right
                if (character[0] != taille - 1) {
                    if (mazeTab[character[0] + 1][character[1]] != MUR) {
                        character[0] += 1;
                        score++;
                    }
                }            
                break;
            case 40: // down
                if (character[1] != taille - 1) {
                    if (mazeTab[character[0]][character[1] + 1] != MUR) {
                        character[1] += 1;
                        score++;
                    }
                }
                break;
            case 68: //letter D
                for (let i = 0; i < taille; i++) {
                    for (let j = 0; j < taille; j++) {
                        if (mazeTab[i][j] == MUR) {
                            mazeTab[i][j] = SOL;
                        }
                    }
                }
                break;
            case 67: // letter c
                if (wayBack) {
                    calculWay();
                }
            
                if (drdBool) {
                    blurDistances();
                } else {
                    drawDistances();
                }
                break;
            case 70: //letter f
                if (!wayBack) {
                    calculWayBack(far[0], far[1]);
                }
                
                if (speedUp) {
                    while (gameStarted) {
                        avancer();

                        if (character[0] == far[0] && character[1] == far[1]) {
                            endGame();
                        }
                    }
                } else {
                    avancer();
                }
                
                break;
            case 65: //letter a
                if (!speedUp) {
                    speedUp = true;
                } else {
                    speedUp = false;
                }
                break;
            default:
                //nothing
        }

        ctx.fillStyle = colorWay;
        ctx.fillRect( character[0] * tailleCase, character[1] * tailleCase, tailleCase, tailleCase);
    } else {
        if (fond.contains(settings)) {
            if (key == 107) { // +
                if (meterTaille.value < meterTaille.max) {
                    meterTaille.value += 2;
                    taille += 2;
                    hVal.textContent = "Valeur actuelle : " + taille;
                }
            } else if (key == 109) { // -
                if (meterTaille.value > meterTaille.min) {
                    meterTaille.value -= 2;
                    taille -= 2;
                    hVal.textContent = "Valeur actuelle : " + taille;
                }
            }
        }
    }

    if (key == 32) { //space
        if (fond.contains(btnStart)) {
            fond.removeChild(btnStart);
            fond.removeChild(btnSet);
            fond.appendChild(btnEsc);
            startGame();
        } else {
            fond.appendChild(btnStart);
            fond.appendChild(btnSet);
            fond.removeChild(btnEsc);
            gameStarted = false;
            
            if (fond.contains(canvas)) {
                fond.removeChild(canvas);
            } else {
                fond.removeChild(settings);
            }
        }
    }

    
    //fin de partie
    if (character[0] == far[0] && character[1] == far[1]) {
        endGame();
    }
}

// action lorsque l'on clique sur le boutton start, lancement d'une partie
btnStart.onclick = function() {
    fond.removeChild(btnStart);
    fond.removeChild(btnSet);
    fond.appendChild(btnEsc);
    startGame();
}

// action lorsque l'on clique sur le boutton réglages, montre le panneau de paramètres et l'explication du jeu
btnSet.onclick = function() {
    fond.removeChild(btnStart);
    fond.removeChild(btnSet);
    fond.appendChild(settings);
    fond.appendChild(btnEsc);
}

// action lorsque l'on clique sur le boutton augmenter, augmente de 2 la taille du labyrinthe
btnAugm.onclick = function() {
    if (meterTaille.value < meterTaille.max) {
        meterTaille.value += 2;
        taille += 2;
        hVal.textContent = "Valeur actuelle : " + taille;
    }
}

// action lorsque l'on clique sur le boutton diminuer, diminu de 2 la taille du labyrinthe
btnDim.onclick = function() {
    if (meterTaille.value > meterTaille.min) {
        meterTaille.value -= 2;
        taille -= 2;
        hVal.textContent = "Valeur actuelle : " + taille;
    }
}

// action lorsque l'on clique sur le boutton esc, retourne au menu principal
btnEsc.onclick = function() {
    fond.appendChild(btnStart);
    fond.appendChild(btnSet);
    fond.removeChild(btnEsc);
    
    if (fond.contains(settings)) {
        fond.removeChild(settings);
    } else {
        fond.removeChild(canvas);
    }
}

// action lorsque l'on clique sur le boutton style de base, passe le style du jeu à celui par défaut
btnStyle1.onclick = function() {
    colorEnd = "green";
    colorHead = "orange";
    colorWalls = "black";
    colorWay = "yellow";

    root.style.setProperty('--mainCol', "#F3DE8A");
    root.style.setProperty('--secCol', "#bea74a");
    root.style.setProperty('--textCol', "black");
    root.style.setProperty('--thrdCol', "#947d21");
}

// action lorsque l'on clique sur le boutton style black & white, passe le style du jeu à celui en noir et blanc (et rouge !)
btnStyle2.onclick = function() {
    colorEnd = "#FA0000";
    colorHead = "#5D5D5D";
    colorWalls = "black";
    colorWay = "#FA0000";

    root.style.setProperty('--mainCol', "DFDFDF");
    root.style.setProperty('--secCol', "gray");
    root.style.setProperty('--textCol', "black");
    root.style.setProperty('--thrdCol', "darkgray");
}

// action lorsque l'on clique sur le boutton style bleu marine, passe le style du jeu à celui bleu azur
btnStyle3.onclick = function() {
    colorEnd = "#00FFFF";
    colorHead = "#30CB8F";
    colorWalls = "#6F2989";
    colorWay = "#14BD4A";

    root.style.setProperty('--mainCol', "#4FB3D8");
    root.style.setProperty('--secCol', "#3662B3");
    root.style.setProperty('--thrdCol', "#1A1F76");
    root.style.setProperty('--textCol', "black");
}

// action lorsque l'on clique sur le boutton style néon, passe le style du jeu a celui le plus douteux, stade de cette fonctionnalité : expérimental
btnStyle4.onclick = function() {
    colorEnd = "#1D049D";
    colorHead = "#BB0594";
    colorWalls = "#BB2525";
    colorWay = "#9D047C";

    root.style.setProperty('--mainCol', "black");
    root.style.setProperty('--secCol', "#E1D500");
    root.style.setProperty('--thrdCol', "#BBB425");
    root.style.setProperty('--textCol', "red");
}

// fonction appelée au lancement d'une nouvelle partie, réinitialise toutes les variables nénéssaires et lance le calcul du labyrinthe, du chemin et dessine ensuite le labyrinthe
function startGame() {
    gameStarted = true;
    character = [0 ,1];
    drdBool = false;
    score = 0;
    nbParties += 1;
    speedUp = false;
    dataNbParties.textContent = "Nombre de parties : " + nbParties;
    dataMoyen.textContent = "Score moyen par partie : " + Math.round(globalScore / nbParties);

    percentPlayer = 101 - Math.round((globalScore / nbParties) / 3);
    dataPercent.textContent = "Vous faites parti des " + percentPlayer + "% meilleurs joueurs";

    if (percentPlayer == 0) {
        dataPercent.textContent = "Vous êtes le meilleur joueur au monde !";
    }

    generateMaze();
    calculWay();
    drawMaze();
}

//fonction qui va générer un labyninthe unique et nouveau a chaque fois de la taille de la variable taille
function generateMaze() {

    mazeTab = new Array(taille);
    for (let i = 0; i < taille; i++) {
        mazeTab[i] = new Array(taille);
    }

    //premierement on rempli le tableau de sol
    for (let i = 0; i < taille; i++) {
        for (let j = 0; j < taille; j++) {
            mazeTab[i][j] = SOL;
        }
    }

    //on met des murs sur les bords du tableau
    for (let i = 0; i < taille ; i++) {
        mazeTab[i][0] = MUR;
    }
    for (let i = 0; i < taille ; i++) {
        mazeTab[0][i] = MUR;
    }
    for (let i = 0; i < taille ; i++) {
        mazeTab[i][taille-1] = MUR;
    }
    for (let i = 0; i < taille ; i++) {
        mazeTab[taille-1][i] = MUR;
    }

    //on quadrille le tableau de murs
    for (let i = 1; i < taille ; i++) {
        for (let j = 1; j < taille ; j++) {
            if (i % 2 == 0) {
                mazeTab[i][j] = MUR;
            }
        }
    }
    for (let i = 1; i < taille ; i++) {
        for (let j = 1; j < taille ; j++) {
            if (j % 2 == 0) {
                mazeTab[i][j] = MUR;
            }
        }
    }

    //on met sur chaque sol une valeur différente
    for (let i = 0; i < taille ; i++) {
        for (let j = 0; j < taille ; j++) {
            if (mazeTab[i][j] == SOL) {
                mazeTab[i][j] = incr;
                incr += 1;
            }
        }
    }

    //ouverture dans les coins
    mazeTab[0][1] = mazeTab[1][1];
 
    //on va maintenant rassambler toutes les cases petit a petit
    while (!merged()) {
        let x = 2 * getRand(0, (taille - 3) / 2, -1) + 1;
        let y = 2 * getRand(0, (taille - 3) / 2, -1) + 1;
        
        if (x > 1 && y > 1 && x < taille - 2 && y < taille - 2) {
            merge(x, y, getRand(1, 4, 0));
        } 
        else if (x == 1 && y == 1) {
            merge(x, y, getRand(2, 3, 0));
        }
        else if (x == 1 && y == taille - 2) {
            merge(x, y, getRand(3, 4, 0));
        }
        else if (x == taille - 2 && y == 1) {
            merge(x, y, getRand(1, 2, 0));
        }
        else if (x == taille - 2 && y == taille - 2) {
            let z;
            do {
                z = getRand(1, 4, 2);
            } while (z == 3);
            merge(x, y, z);
        }
        else if (x == 1) {
            merge(x, y, getRand(1, 4, 1));
        } 
        else if (x == taille - 2) {
            merge(x, y, getRand(1, 4, 3));
        } 
        else if (y == 1) {
            merge(x, y, getRand(1, 4, 4));
        } 
        else if (y == taille - 2) {
            merge(x, y, getRand(1, 4, 2));
        }
    }

    //on remet les valeurs de sol sur les cases qui ne sont pas des murs
    resetSol();
}

// fonction utilitaire qui va servir a remmetre a 0 les cases sol, c'est à dire les cases qui ne sont pas un mur
function resetSol() {
    for (let o = 0; o < taille; o++) {
        for (let k = 0; k < taille; k++) {
            if (mazeTab[o][k] != MUR) {
                mazeTab[o][k] = SOL;
            }
        }
    }
}

// fonction qui teste si le labyrinthe a validé son unicité, c'est a dire que toutes les cases sont de la même famille et ne forment donc qu'un seul et unique chemin, renvoi true si c'est bien le cas
function merged() {
    for (let i = 0; i < taille ; i++) {
        for (let j = 0; j < taille ; j++) {
            if (mazeTab[i][j] != mazeTab[5][5] && mazeTab[i][j] != MUR) {
                return false;
            }
        }
    }
    return true;
}

// fonction qui va rassambler la case de coordonnées x et y et dans la direction d (valeurs de d = {1,2,3,4} pour haut droite bas gauche)
function merge(x, y, d) {
    
    let nv = mazeTab[x][y];
    let old;

    switch(d) {
        case 1:
            old = mazeTab[x-2][y];
            if (old != nv) {
                mazeTab[x-1][y] = nv;
                mazeTab[x-2][y] = nv;
            }
            break;
        case 2:
            old = mazeTab[x][y+2];
            if (old != nv) {
                mazeTab[x][y+1] = nv;
                mazeTab[x][y+2] = nv;
            }
            break;
        case 3:
            old = mazeTab[x+2][y];
            if (old != nv) {
                mazeTab[x+1][y] = nv;
                mazeTab[x+2][y] = nv;
            }
            break;
        case 4:
            old = mazeTab[x][y-2];
            if (old != nv) {
                mazeTab[x][y-1] = nv;
                mazeTab[x][y-2] = nv;
            }
            break;
    }
    
    for (let i = 0; i < taille; i++) {
        for (let j = 0; j < taille; j++) {
            if (mazeTab[i][j] == old) {
                mazeTab[i][j] = nv;
            }
        }
    }
}

// fonction qui fait avancer le joueur de 1, fonction utilisée dans les fonction de triche de la touche F
function avancer() {

    ctx.fillStyle = colorHead;
    ctx.fillRect( character[0] * tailleCase, character[1] * tailleCase, tailleCase, tailleCase);

    score++;

    if (mazeTab[character[0]][character[1]] > mazeTab[character[0] + 1][character[1]] &&
         mazeTab[character[0] + 1][character[1]] != MUR) {
        character[0] += 1;
    }
    else if (mazeTab[character[0]][character[1]] > mazeTab[character[0]][character[1] + 1] &&
         mazeTab[character[0]][character[1] + 1] != MUR) {
        character[1] += 1;
    }
    else if (mazeTab[character[0]][character[1]] > mazeTab[character[0] - 1][character[1]] &&
         mazeTab[character[0] - 1][character[1]] != MUR) {
        character[0] -= 1;
    }
    else if (mazeTab[character[0]][character[1]] > mazeTab[character[0]][character[1] - 1] &&
         mazeTab[character[0]][character[1] - 1] != MUR) {
        character[1] -= 1;
    }

    ctx.fillStyle = colorWay;
    ctx.fillRect(character[0] * tailleCase, character[1] * tailleCase, tailleCase, tailleCase);

}

// fonction qui calcul récursivament la distance au départ du labyrinthe
function calculWay() {
    var x = 1;
    var y = 1;
    var val = 2;
    bigVal = 0;

    mazeTab[0][1] = 2;
    
    voisinRecurs(x,y, val + 1);

    for (let i = 0; i < taille; i++) {
        for (let j = 0; j < taille; j++) {
            if (mazeTab[i][j] > bigVal) {
                bigVal = mazeTab[i][j];
                far[0] = i;
                far[1] = j;
            }
        }
    }

    wayBack = false;
}

// fonction qui calcul récursivement les distances a l'arrivée du labyrinthe pour toutes les cases sol, permet ensuite de trouver le plus court chemin qui mène à l'arrivée depuis nimporte quel point du labyrinthe
function calculWayBack(x, y) {
    var val = 2;
    resetSol();

    mazeTab[far[0]][far[1]] = val;
    
    voisinRecurs(x,y, val + 1);

    bigVal = mazeTab[0][1];
    wayBack = true;
}

// fonction racine de la récursivité utilisée dans les fonctions calculWay() et calculWayBack(), c'est cette fonction qui va s'executer récursivement, son point d'arrêt est quand tout le tableau est parcouru
function voisinRecurs(x, y, val) {

    mazeTab[x][y] = val;

    if (!(x == 0 && y == 1)) {

        if (mazeTab[x + 1][y] == SOL) {
            voisinRecurs(x + 1, y, val + 1);
        }
        
        if (mazeTab[x][y + 1] == SOL) {
            voisinRecurs(x, y + 1, val + 1);
        }
        
        if (mazeTab[x][y - 1] == SOL) {
            voisinRecurs(x,y - 1, val + 1);
        }
    
        if (mazeTab[x - 1][y] == SOL) {
            voisinRecurs(x - 1, y, val + 1);
        }
    } 
}

//fonction d'affichage du labyrinthe dans le canvas
function drawMaze() {

    l = 0.95 * fond.clientHeight;
    var r = l % taille;
    l -= r;
    tailleCase = (l / taille);

    canvas.height = l; 
    canvas.width = l;

    ctx.fillStyle = colorWalls;
    for (let i = 0; i < taille; i++) {
        for (let j = 0; j < taille; j++) {
            if (mazeTab[i][j] == MUR) {
                ctx.fillRect(i * tailleCase, j * tailleCase, tailleCase, tailleCase);
            }
        }
    }

    ctx.fillStyle = colorWay;
    ctx.fillRect( character[0] * tailleCase, character[1] * tailleCase, tailleCase, tailleCase);

    ctx.fillStyle = colorEnd;
    ctx.fillRect( far[0] * tailleCase, far[1] * tailleCase, tailleCase, tailleCase);

    fond.appendChild(canvas);
}

// fonction qui dessine avec un linéar gradient de gris les distances du labyrinthe, plus la case est loin du départ plus elle est clair
function drawDistances() {
    let rgbStart = 40;
    let facteur = 1;

    let rgbCol = color(rgbStart,rgbStart,rgbStart);
   
    facteur = (255 - rgbStart - 15) / bigVal;

    for (let i = 0; i < taille; i++) {
        for (let j = 0; j < taille; j++) {
            if (mazeTab[i][j] != MUR && !(i == far[0] && j == far[1])) {
                rgbCol = color(Math.round(mazeTab[i][j] * facteur + rgbStart),Math.round( rgbStart + mazeTab[i][j] * facteur), Math.round(rgbStart + mazeTab[i][j] * facteur));
                ctx.fillStyle = rgbCol;
                ctx.fillRect(i * tailleCase, j * tailleCase, tailleCase, tailleCase);
            }
        }
    }
    drdBool = true;
}

// fonction qui cache les distances dessinées dans la fonction drawDistances()
function blurDistances() {
    
    ctx.clearRect(0, 0, l, l);
    drawMaze();
    drdBool = false;
}

// fonction qui calcul le score final à la fin d'une partie du joueur, a savoir que lesocre max en cas de chemin parfait est de 1.5 * la taille du labyrinthe
function calcScore() {
    return Math.round(taille*1.5) + bigVal - score - 3;
}

// fonction qui s'execute a la fin d'une partie, c'est a dire quand le jeueur atteint la case d'arrivée
function endGame() {
    ctx.font = "bold 50px sans-serif";
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.strokeStyle = colorWay;
    ctx.lineWidth = "5";
    ctx.strokeText("Bravo vous avez gagné", l/2, l/2 - 100);
    ctx.fillText("Bravo vous avez gagné", l/2, l/2 - 100);

    ctx.strokeText("Score : " + calcScore() + " points", l/2, l/2);
    ctx.fillText("Score : " + calcScore() + " points", l/2, l/2);

    if (gameStarted) {
        globalScore += calcScore();
        dataScore.textContent = "Score global : " + globalScore;
        dataMoyen.textContent = "Score moyen par partie : " + Math.round(globalScore / nbParties);

        percentPlayer = 101 - Math.round((globalScore / nbParties) / 3);
        dataPercent.textContent = "Vous faites parti des " + percentPlayer + "% meilleurs joueurs";

        if (percentPlayer == 0) {
            dataPercent.textContent = "Vous êtes le meilleur joueur au monde !";
        }
    }

    gameStarted = false;
}

//fonction utilitaire qui renvoi un entier aleatoire entre min et max exclu de e
function getRand(min, max, e) {
    let y;
    do {
        y = Math.floor(Math.random() * (max - min + 1));
        y += min;
    } 
    while (y == e);

    return y;
}

//fonction utilitaire qui prends en entrée trois entiers R, G et B correspondants a une valeur entre [0,255] et qui renvoi le code exadécimal de la couleur associée, fonction qui sers dans la fonction calculWay() pour le gradiant des couleurs
function color(r,g,b) {
    if (r > 255 || g > 255 || b > 255) {
        return "#FF0000";
    } else {
        let string = "#";

        var exa = r.toString(16);
        string = string + exa;
        exa = g.toString(16);
        string = string + exa;
        exa = b.toString(16);
        string = string + exa;

        return string;
    }
    
}