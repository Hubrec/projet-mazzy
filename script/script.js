const fond = document.querySelector('body');
const btnStart = document.querySelector('button');
const btnSet = document.getElementById('settings');
const settings = document.querySelector('div');

const btnAugm = document.getElementById('augm');
const btnDim = document.getElementById('dim');
const meterTaille = document.querySelector('meter');
const btnEsc = document.getElementById('esc');

const btnStyle1 = document.getElementById('style1');
const btnStyle2 = document.getElementById('style2');
const btnStyle3 = document.getElementById('style3');
const btnStyle4 = document.getElementById('style4');

const hVal = document.getElementById('hval');

fond.removeChild(settings);

btnStart.onclick = function() {
    fond.removeChild(btnStart);
    fond.removeChild(btnSet);
    fond.appendChild(btnEsc);
    startGame();
}

btnSet.onclick = function() {
    fond.removeChild(btnStart);
    fond.removeChild(btnSet);
    fond.appendChild(settings);
    fond.appendChild(btnEsc);
}

//click normal
btnAugm.onclick = function() {
    if (meterTaille.value < meterTaille.max) {
        meterTaille.value += 2;
        taille += 2;
        hVal.textContent = "Valeur actuelle : " + taille;
    }
}

btnDim.onclick = function() {
    if (meterTaille.value > meterTaille.min) {
        meterTaille.value -= 2;
        taille -= 2;
        hVal.textContent = "Valeur actuelle : " + taille;
    }
}

//plus rapide
window.scrollY = function(e) {
    consloe.log(e);
}

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

const MUR = 0;
const SOL = 1;
var taille = 25;
var incr = 1;
var score = 0;

var colorEnd = "green";
var colorHead = "orange";
var colorWalls = "black";
var colorWay = "yellow";

var far = [taille - 1, taille - 2];
var character = [0, 1];
var mazeTab;
var bigVal = 0;
var gameStarted = false;
var wayBack = false;

var root = document.documentElement;

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

function startGame() {
    gameStarted = true;
    character = [0 ,1];
    drdBool = false;
    score = 0;

    generateMaze();
    calculWay();
    drawMaze();
}

//fonction qui va générer un labyninthe unique et nouveau a chaque fois
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

function resetSol() {
    for (let o = 0; o < taille; o++) {
        for (let k = 0; k < taille; k++) {
            if (mazeTab[o][k] != MUR) {
                mazeTab[o][k] = SOL;
            }
        }
    }
}

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

const canvas = document.createElement("canvas");
const ctx = canvas.getContext('2d');
var tailleCase = 0;
var l;

var drdBool = false;

//fonction d'affichage
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

//fonction qui renvoi un entier aleatoire entre min et max exclu de e
function getRand(min, max, e) {
    let y;
    do {
        y = Math.floor(Math.random() * (max - min + 1));
        y += min;
    } 
    while (y == e);

    return y;
}

//gestionnaire des touches enfoncées
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

                avancer();
                
                break;
            default:
                //nothing
        }

        ctx.fillStyle = colorWay;
        ctx.fillRect( character[0] * tailleCase, character[1] * tailleCase, tailleCase, tailleCase);
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

        gameStarted = false;
    }
}

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

function calculWayBack(x, y) {
    var val = 2;
    resetSol();

    mazeTab[far[0]][far[1]] = val;
    
    voisinRecurs(x,y, val + 1);

    bigVal = mazeTab[0][1];
    wayBack = true;
}

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

function blurDistances() {
    
    ctx.clearRect(0, 0, l, l);
    drawMaze();
    drdBool = false;
}

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

function calcScore() {
    return Math.round(taille*1.5) + bigVal - score - 3; 
}