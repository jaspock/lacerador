let i: number;
let fantasma: Sprite;
function init_lab(lab: number[][], visitado: boolean[][]) {
    for (let i = 0; i < LADO; i++) {
        lab.push([])
        visitado.push([])
        for (let j = 0; j < LADO; j++) {
            if (i % 2 == 0 || j % 2 == 0) {
                lab[i].push(MURO)
                visitado[i].push(true)
            } else {
                lab[i].push(PASILLO)
                visitado[i].push(false)
            }
            
        }
    }
}

function pinta_mosaicos(lab: number[][]) {
    let puerta: Sprite;
    for (let i = 0; i < LADO; i++) {
        for (let j = 0; j < LADO; j++) {
            if (lab[i][j] == MURO) {
                tiles.setTileAt(tiles.getTileLocation(i, j), sprites.builtin.brick)
                tiles.setWallAt(tiles.getTileLocation(i, j), true)
            } else if (lab[i][j] == PASILLO) {
                tiles.setTileAt(tiles.getTileLocation(i, j), sprites.dungeon.darkGroundCenter)
            } else if (lab[i][j] == PUERTA) {
                puerta = sprites.create(img`
                    e e e e e e e e e e e e e e e e
                    e e e e e e e e e e e e e e e e
                    e e e e e e e e e e e e e e e e
                    e e e e e e e e e e e e e e e e
                    e e e e e e e e e e e e e e e e
                    e f f f f e e e e e e e e e e e
                    e f f f f e e e e e e e e e e e
                    e f f f f e e e e e e e e e e e
                    e f f f f e e e e e e e e e e e
                    e e e e e e e e e e e e e e e e
                    e e e e e e e e e e e e e e e e
                    e e e e e e e e e e e e e e e e
                    e e e e e e e e e e e e e e e e
                    e e e e e e e e e e e e e e e e
                    e e e e e e e e e e e e e e e e
                    e e e e e e e e e e e e e e e e
                `, SpriteKind.puerta)
                puerta.setPosition(i * 16 + 8, j * 16 + 8)
            } else if (lab[i][j] == TELETRANSPORTADOR) {
                puerta = sprites.create(assets.image`teletransportador`, SpriteKind.teletransportador)
                puerta.setPosition(i * 16 + 8, j * 16 + 8)
            }
            
        }
    }
}

function vecinos(c: number[]): number[][] {
    let v = []
    let x = c[0]
    let y = c[1]
    if (x - 2 > 0) {
        v.push([x - 2, y])
    }
    
    if (y + 2 < LADO) {
        v.push([x, y + 2])
    }
    
    if (x + 2 < LADO) {
        v.push([x + 2, y])
    }
    
    if (y - 2 > 0) {
        v.push([x, y - 2])
    }
    
    return v
}

function vecinos_no_visitados(c: number[]): number[][] {
    let todos : number[][] = []
    todos = vecinos(c)
    let no_visitados : number[][] = []
    no_visitados = []
    for (let h of todos) {
        if (!visitado[h[0]][h[1]]) {
            no_visitados.push(h)
        }
        
    }
    return no_visitados
}

function celda_enmedio(c1: number[], c2: number[]): number[] {
    let y: number;
    let x: number;
    let x1 = c1[0]
    let y1 = c1[1]
    let x2 = c2[0]
    let y2 = c2[1]
    if (y1 == y2) {
        y = y1
        if (x2 < x1) {
            x = x1 - 1
        } else {
            x = x1 + 1
        }
        
    } else {
        x = x1
        if (y2 < y1) {
            y = y1 - 1
        } else {
            y = y1 + 1
        }
        
    }
    
    return [x, y]
}

function aleatorio_impar(abajo: number, arriba: number): number {
    let nai = randint(abajo, arriba)
    if (nai % 2 == 1) {
        return nai
    } else if (nai == arriba) {
        return nai - 1
    } else {
        return nai + 1
    }
    
}

function aleatorio_par(abajo: number, arriba: number): number {
    let nap = randint(abajo, arriba)
    if (nap % 2 == 0) {
        return nap
    } else if (nap == arriba) {
        return nap - 1
    } else {
        return nap + 1
    }
    
}

function crea_laberinto(lab: number[][], visitado: boolean[][]) {
    let actual: number[];
    let vecinitos: number[][];
    let n: number;
    let sig: number[];
    let muro: number[];
    let pila : number[][] = []
    pila.push([aleatorio_impar(0, LADO - 1), aleatorio_impar(0, LADO - 1)])
    while (pila.length != 0) {
        actual = pila[pila.length - 1]
        visitado[actual[0]][actual[1]] = true
        vecinitos = vecinos_no_visitados(actual)
        if (vecinitos.length == 0) {
            pila.pop()
        } else {
            n = randint(0, vecinitos.length - 1)
            sig = vecinitos[n]
            muro = celda_enmedio(actual, sig)
            lab[muro[0]][muro[1]] = PASILLO
            pila.push(sig)
        }
        
    }
}

function crea_puerta(lab: number[][]) {
    let y: number;
    let x: number;
    if (borde == 0) {
        //  arriba
        y = 0
        x = aleatorio_impar(0, LADO - 1)
    } else if (borde == 1) {
        //  abajo
        y = LADO - 1
        x = aleatorio_impar(0, LADO - 1)
    } else if (borde == 2) {
        //  izquierda
        y = aleatorio_impar(0, LADO - 1)
        x = 0
    } else {
        //  derecha
        y = aleatorio_impar(0, LADO - 1)
        x = LADO - 1
    }
    
    lab[x][y] = PUERTA
}

function crea_teletranspotador(lab: number[][]) {
    let x: number;
    let y: number;
    for (let _ = 0; _ < NUM_TELETRANSPORTADORES; _++) {
        x = aleatorio_impar(0, LADO - 1)
        y = aleatorio_impar(0, LADO - 1)
        lab[x][y] = TELETRANSPORTADOR
    }
}

function quita_muretes(lab: number[][]) {
    let x: number;
    let y: number;
    if (LADO < 8) {
        return
    }
    
    let MAX_INTENTOS = LADO * LADO * 10
    let intentos = 0
    let muros = 0
    while (muros < MUROS_DESAPARECIDOS && intentos < MAX_INTENTOS) {
        x = aleatorio_par(3, LADO - 4)
        y = aleatorio_par(3, LADO - 4)
        if (lab[x][y] == MURO) {
            if (lab[x - 1][y] == MURO && lab[x - 2][y] == MURO && lab[x + 1][y] == MURO && lab[x + 2][y] == MURO && lab[x][y + 1] != MURO && lab[x][y - 1] != MURO) {
                lab[x][y] = PASILLO
                muros = muros + 1
            } else if (lab[x][y - 1] == MURO && lab[x][y - 2] == MURO && lab[x][y + 1] == MURO && lab[x][y + 2] == MURO && lab[x + 1][y] != MURO && lab[x - 1][y] != MURO) {
                lab[x][y] = PASILLO
                muros = muros + 1
            }
            
        }
        
        intentos = intentos + 1
    }
}

function crea_cruz(lab: number[][], visitado: boolean[][]) {
    let muro: number[];
    let xmuro: number;
    let ymuro: number;
    let celda = [3, 3]
    let vecinitos : number[][] = []
    vecinitos = vecinos(celda)
    for (let v of vecinitos) {
        muro = celda_enmedio(celda, v)
        xmuro = muro[0]
        ymuro = muro[1]
        lab[xmuro][ymuro] = PASILLO
    }
}

namespace SpriteKind {
    export const fantasma = SpriteKind.create()
    export const arma = SpriteKind.create()
    export const puerta = SpriteKind.create()
    export const teletransportador = SpriteKind.create()
}

//  LADO impar m??ximo de 255
let LADO = 10
if (LADO % 2 == 0) {
    LADO += 1
}

if (LADO > 255) {
    LADO = 255
}

let MUROS_DESAPARECIDOS = LADO
let MURO = 0
let PASILLO = 1
let PUERTA = 2
let TELETRANSPORTADOR = 3
let NUM_FANTASMAS = 6
let NUM_ARMAS = NUM_FANTASMAS * 2
let NUM_TELETRANSPORTADORES = 2
let borde = randint(0, 3)
let armadillo = false
let avisado = false
let lab : number[][] = []
let visitado : boolean[][] = []
sprites.onOverlap(SpriteKind.Player, SpriteKind.fantasma, function choca_chup(p: Sprite, f: Sprite) {
    if (armadillo) {
        f.destroy(effects.fire, 500)
    } else {
        game.over()
    }
    
})
sprites.onOverlap(SpriteKind.Player, SpriteKind.arma, function coge_arma(p: Sprite, a: Sprite) {
    
    armadillo = true
    a.destroy(effects.starField, 500)
})
sprites.onOverlap(SpriteKind.Player, SpriteKind.puerta, function toca_puerta(p: Sprite, puerta: Sprite) {
    game.over(true, effects.blizzard)
})
sprites.onOverlap(SpriteKind.Player, SpriteKind.teletransportador, function toca_teletransportador(p: Sprite, t: Sprite) {
    
    if (!avisado) {
        avisado = true
        game.showLongText("Pulsa A para teletransportarte cuando pases por un teletransportador.", DialogLayout.Bottom)
        pause(100)
    }
    
    if (controller.A.isPressed()) {
        teseo.startEffect(effects.spray, 500)
        music.sonar.play()
        teseo.setPosition(aleatorio_impar(0, LADO - 1) * 16 + 8, aleatorio_impar(0, LADO - 1) * 16 + 8)
    }
    
})
scene.setBackgroundColor(3)
let teseo = sprites.create(assets.image`mi teseo`, SpriteKind.Player)
for (i = 0; i < NUM_FANTASMAS; i++) {
    fantasma = sprites.create(img`
        ........................
        ........................
        ........................
        ........................
        ..........ffff..........
        ........ff1111ff........
        .......fb111111bf.......
        .......f11111111f.......
        ......fd11111111df......
        ......fd11111111df......
        ......fddd1111dddf......
        ......fbdbfddfbdbf......
        ......fcdcf11fcdcf......
        .......fb111111bf.......
        .....ffffdb11bdffff.....
        ....fc111cfbbfc111cf....
        ....f1b1b1ffff1b1b1f....
        ....fbfbfbffffbfbfbf....
        .........ffffff.........
        ..........fff...........
        ...........f............
        ........................
        ........................
        ........................
    `, SpriteKind.fantasma)
    fantasma.setPosition(aleatorio_impar(0, LADO - 1) * 16 + 8, aleatorio_impar(0, LADO - 1) * 16 + 8)
    fantasma.follow(teseo, 40)
}
for (i = 0; i < NUM_ARMAS; i++) {
    fantasma = sprites.create(img`
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . c c . . . . . . . .
        . . . . c a f b c . . . . . . .
        . . . . b f f b c c . . . . . .
        . . . a a f b a b a c . . . . .
        . . . c a c b b f f b . . . . .
        . . . . b f f b f a b . . . . .
        . . . . a f f b b b a . . . . .
        . . . . . a b b c c . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
    `, SpriteKind.arma)
    fantasma.setPosition(aleatorio_impar(0, LADO - 1) * 16 + 8, aleatorio_impar(0, LADO - 1) * 16 + 8)
}
teseo.setPosition(aleatorio_impar(0, LADO - 1) * 16 + 8, aleatorio_impar(0, LADO - 1) * 16 + 8)
controller.moveSprite(teseo)
teseo.setBounceOnWall(true)
//  mapa del tama??o m??ximo: 255x255
tiles.setTilemap(tilemap`level1`)
scene.cameraFollowSprite(teseo)
init_lab(lab, visitado)
crea_laberinto(lab, visitado)
crea_puerta(lab)
crea_teletranspotador(lab)
quita_muretes(lab)
pinta_mosaicos(lab)
controller.up.onEvent(ControllerButtonEvent.Pressed, function on_up_pressed() {
    animation.runImageAnimation(teseo, [img`
                . . . . . . f f f f . . . . . . 
                        . . . . f f e e e e f f . . . . 
                        . . . f e e e f f e e e f . . . 
                        . . f f f f f 2 2 f f f f f . . 
                        . . f f e 2 e 2 2 e 2 e f f . . 
                        . . f e 2 f 2 f f 2 f 2 e f . . 
                        . . f f f 2 2 e e 2 2 f f f . . 
                        . f f e f 2 f e e f 2 f e f f . 
                        . f e e f f e e e e f e e e f . 
                        . . f e e e e e e e e e e f . . 
                        . . . f e e e e e e e e f . . . 
                        . . e 4 f f f f f f f f 4 e . . 
                        . . 4 d f 2 2 2 2 2 2 f d 4 . . 
                        . . 4 4 f 4 4 4 4 4 4 f 4 4 . . 
                        . . . . . f f f f f f . . . . . 
                        . . . . . f f . . f f . . . . .
            `, img`
                . . . . . . . . . . . . . . . . 
                        . . . . . . f f f f . . . . . . 
                        . . . . f f e e e e f f . . . . 
                        . . . f e e e f f e e e f . . . 
                        . . . f f f f 2 2 f f f f . . . 
                        . . f f e 2 e 2 2 e 2 e f f . . 
                        . . f e 2 f 2 f f f 2 f e f . . 
                        . . f f f 2 f e e 2 2 f f f . . 
                        . . f e 2 f f e e 2 f e e f . . 
                        . f f e f f e e e f e e e f f . 
                        . f f e e e e e e e e e e f f . 
                        . . . f e e e e e e e e f . . . 
                        . . . e f f f f f f f f 4 e . . 
                        . . . 4 f 2 2 2 2 2 e d d 4 . . 
                        . . . e f f f f f f e e 4 . . . 
                        . . . . f f f . . . . . . . . .
            `, img`
                . . . . . . f f f f . . . . . . 
                        . . . . f f e e e e f f . . . . 
                        . . . f e e e f f e e e f . . . 
                        . . f f f f f 2 2 f f f f f . . 
                        . . f f e 2 e 2 2 e 2 e f f . . 
                        . . f e 2 f 2 f f 2 f 2 e f . . 
                        . . f f f 2 2 e e 2 2 f f f . . 
                        . f f e f 2 f e e f 2 f e f f . 
                        . f e e f f e e e e f e e e f . 
                        . . f e e e e e e e e e e f . . 
                        . . . f e e e e e e e e f . . . 
                        . . e 4 f f f f f f f f 4 e . . 
                        . . 4 d f 2 2 2 2 2 2 f d 4 . . 
                        . . 4 4 f 4 4 4 4 4 4 f 4 4 . . 
                        . . . . . f f f f f f . . . . . 
                        . . . . . f f . . f f . . . . .
            `, img`
                . . . . . . . . . . . . . . . . 
                        . . . . . . f f f f . . . . . . 
                        . . . . f f e e e e f f . . . . 
                        . . . f e e e f f e e e f . . . 
                        . . . f f f f 2 2 f f f f . . . 
                        . . f f e 2 e 2 2 e 2 e f f . . 
                        . . f e f 2 f f f 2 f 2 e f . . 
                        . . f f f 2 2 e e f 2 f f f . . 
                        . . f e e f 2 e e f f 2 e f . . 
                        . f f e e e f e e e f f e f f . 
                        . f f e e e e e e e e e e f f . 
                        . . . f e e e e e e e e f . . . 
                        . . e 4 f f f f f f f f e . . . 
                        . . 4 d d e 2 2 2 2 2 f 4 . . . 
                        . . . 4 e e f f f f f f e . . . 
                        . . . . . . . . . f f f . . . .
            `], 300, true)
})
controller.left.onEvent(ControllerButtonEvent.Pressed, function on_left_pressed() {
    animation.runImageAnimation(teseo, [img`
                . . . . f f f f f f . . . . . . 
                        . . . f 2 f e e e e f f . . . . 
                        . . f 2 2 2 f e e e e f f . . . 
                        . . f e e e e f f e e e f . . . 
                        . f e 2 2 2 2 e e f f f f . . . 
                        . f 2 e f f f f 2 2 2 e f . . . 
                        . f f f e e e f f f f f f f . . 
                        . f e e 4 4 f b e 4 4 e f f . . 
                        . . f e d d f 1 4 d 4 e e f . . 
                        . . . f d d d d 4 e e e f . . . 
                        . . . f e 4 4 4 e e f f . . . . 
                        . . . f 2 2 2 e d d 4 . . . . . 
                        . . . f 2 2 2 e d d e . . . . . 
                        . . . f 5 5 4 f e e f . . . . . 
                        . . . . f f f f f f . . . . . . 
                        . . . . . . f f f . . . . . . .
            `, img`
                . . . . . . . . . . . . . . . . 
                        . . . . f f f f f f . . . . . . 
                        . . . f 2 f e e e e f f . . . . 
                        . . f 2 2 2 f e e e e f f . . . 
                        . . f e e e e f f e e e f . . . 
                        . f e 2 2 2 2 e e f f f f . . . 
                        . f 2 e f f f f 2 2 2 e f . . . 
                        . f f f e e e f f f f f f f . . 
                        . f e e 4 4 f b e 4 4 e f f . . 
                        . . f e d d f 1 4 d 4 e e f . . 
                        . . . f d d d e e e e e f . . . 
                        . . . f e 4 e d d 4 f . . . . . 
                        . . . f 2 2 e d d e f . . . . . 
                        . . f f 5 5 f e e f f f . . . . 
                        . . f f f f f f f f f f . . . . 
                        . . . f f f . . . f f . . . . .
            `, img`
                . . . . f f f f f f . . . . . . 
                        . . . f 2 f e e e e f f . . . . 
                        . . f 2 2 2 f e e e e f f . . . 
                        . . f e e e e f f e e e f . . . 
                        . f e 2 2 2 2 e e f f f f . . . 
                        . f 2 e f f f f 2 2 2 e f . . . 
                        . f f f e e e f f f f f f f . . 
                        . f e e 4 4 f b e 4 4 e f f . . 
                        . . f e d d f 1 4 d 4 e e f . . 
                        . . . f d d d d 4 e e e f . . . 
                        . . . f e 4 4 4 e e f f . . . . 
                        . . . f 2 2 2 e d d 4 . . . . . 
                        . . . f 2 2 2 e d d e . . . . . 
                        . . . f 5 5 4 f e e f . . . . . 
                        . . . . f f f f f f . . . . . . 
                        . . . . . . f f f . . . . . . .
            `, img`
                . . . . . . . . . . . . . . . . 
                        . . . . f f f f f f . . . . . . 
                        . . . f 2 f e e e e f f . . . . 
                        . . f 2 2 2 f e e e e f f . . . 
                        . . f e e e e f f e e e f . . . 
                        . f e 2 2 2 2 e e f f f f . . . 
                        . f 2 e f f f f 2 2 2 e f . . . 
                        . f f f e e e f f f f f f f . . 
                        . f e e 4 4 f b e 4 4 e f f . . 
                        . . f e d d f 1 4 d 4 e e f . . 
                        . . . f d d d d 4 e e e f . . . 
                        . . . f e 4 4 4 e d d 4 . . . . 
                        . . . f 2 2 2 2 e d d e . . . . 
                        . . f f 5 5 4 4 f e e f . . . . 
                        . . f f f f f f f f f f . . . . 
                        . . . f f f . . . f f . . . . .
            `], 300, true)
})
controller.right.onEvent(ControllerButtonEvent.Pressed, function on_right_pressed() {
    animation.runImageAnimation(teseo, [img`
                . . . . . . f f f f f f . . . . 
                        . . . . f f e e e e f 2 f . . . 
                        . . . f f e e e e f 2 2 2 f . . 
                        . . . f e e e f f e e e e f . . 
                        . . . f f f f e e 2 2 2 2 e f . 
                        . . . f e 2 2 2 f f f f e 2 f . 
                        . . f f f f f f f e e e f f f . 
                        . . f f e 4 4 e b f 4 4 e e f . 
                        . . f e e 4 d 4 1 f d d e f . . 
                        . . . f e e e 4 d d d d f . . . 
                        . . . . f f e e 4 4 4 e f . . . 
                        . . . . . 4 d d e 2 2 2 f . . . 
                        . . . . . e d d e 2 2 2 f . . . 
                        . . . . . f e e f 4 5 5 f . . . 
                        . . . . . . f f f f f f . . . . 
                        . . . . . . . f f f . . . . . .
            `, img`
                . . . . . . . . . . . . . . . . 
                        . . . . . . f f f f f f . . . . 
                        . . . . f f e e e e f 2 f . . . 
                        . . . f f e e e e f 2 2 2 f . . 
                        . . . f e e e f f e e e e f . . 
                        . . . f f f f e e 2 2 2 2 e f . 
                        . . . f e 2 2 2 f f f f e 2 f . 
                        . . f f f f f f f e e e f f f . 
                        . . f f e 4 4 e b f 4 4 e e f . 
                        . . f e e 4 d 4 1 f d d e f . . 
                        . . . f e e e e e d d d f . . . 
                        . . . . . f 4 d d e 4 e f . . . 
                        . . . . . f e d d e 2 2 f . . . 
                        . . . . f f f e e f 5 5 f f . . 
                        . . . . f f f f f f f f f f . . 
                        . . . . . f f . . . f f f . . .
            `, img`
                . . . . . . f f f f f f . . . . 
                        . . . . f f e e e e f 2 f . . . 
                        . . . f f e e e e f 2 2 2 f . . 
                        . . . f e e e f f e e e e f . . 
                        . . . f f f f e e 2 2 2 2 e f . 
                        . . . f e 2 2 2 f f f f e 2 f . 
                        . . f f f f f f f e e e f f f . 
                        . . f f e 4 4 e b f 4 4 e e f . 
                        . . f e e 4 d 4 1 f d d e f . . 
                        . . . f e e e 4 d d d d f . . . 
                        . . . . f f e e 4 4 4 e f . . . 
                        . . . . . 4 d d e 2 2 2 f . . . 
                        . . . . . e d d e 2 2 2 f . . . 
                        . . . . . f e e f 4 5 5 f . . . 
                        . . . . . . f f f f f f . . . . 
                        . . . . . . . f f f . . . . . .
            `, img`
                . . . . . . . . . . . . . . . . 
                        . . . . . . f f f f f f . . . . 
                        . . . . f f e e e e f 2 f . . . 
                        . . . f f e e e e f 2 2 2 f . . 
                        . . . f e e e f f e e e e f . . 
                        . . . f f f f e e 2 2 2 2 e f . 
                        . . . f e 2 2 2 f f f f e 2 f . 
                        . . f f f f f f f e e e f f f . 
                        . . f f e 4 4 e b f 4 4 e e f . 
                        . . f e e 4 d 4 1 f d d e f . . 
                        . . . f e e e 4 d d d d f . . . 
                        . . . . 4 d d e 4 4 4 e f . . . 
                        . . . . e d d e 2 2 2 2 f . . . 
                        . . . . f e e f 4 4 5 5 f f . . 
                        . . . . f f f f f f f f f f . . 
                        . . . . . f f . . . f f f . . .
            `], 300, true)
})
controller.down.onEvent(ControllerButtonEvent.Pressed, function on_down_pressed() {
    animation.runImageAnimation(teseo, [img`
                . . . . . . f f f f . . . . . . 
                        . . . . f f f 2 2 f f f . . . . 
                        . . . f f f 2 2 2 2 f f f . . . 
                        . . f f f e e e e e e f f f . . 
                        . . f f e 2 2 2 2 2 2 e e f . . 
                        . . f e 2 f f f f f f 2 e f . . 
                        . . f f f f e e e e f f f f . . 
                        . f f e f b f 4 4 f b f e f f . 
                        . f e e 4 1 f d d f 1 4 e e f . 
                        . . f e e d d d d d d e e f . . 
                        . . . f e e 4 4 4 4 e e f . . . 
                        . . e 4 f 2 2 2 2 2 2 f 4 e . . 
                        . . 4 d f 2 2 2 2 2 2 f d 4 . . 
                        . . 4 4 f 4 4 5 5 4 4 f 4 4 . . 
                        . . . . . f f f f f f . . . . . 
                        . . . . . f f . . f f . . . . .
            `, img`
                . . . . . . . . . . . . . . . . 
                        . . . . . . f f f f . . . . . . 
                        . . . . f f f 2 2 f f f . . . . 
                        . . . f f f 2 2 2 2 f f f . . . 
                        . . f f f e e e e e e f f f . . 
                        . . f f e 2 2 2 2 2 2 e e f . . 
                        . f f e 2 f f f f f f 2 e f f . 
                        . f f f f f e e e e f f f f f . 
                        . . f e f b f 4 4 f b f e f . . 
                        . . f e 4 1 f d d f 1 4 e f . . 
                        . . . f e 4 d d d d 4 e f e . . 
                        . . f e f 2 2 2 2 e d d 4 e . . 
                        . . e 4 f 2 2 2 2 e d d e . . . 
                        . . . . f 4 4 5 5 f e e . . . . 
                        . . . . f f f f f f f . . . . . 
                        . . . . f f f . . . . . . . . .
            `, img`
                . . . . . . f f f f . . . . . . 
                        . . . . f f f 2 2 f f f . . . . 
                        . . . f f f 2 2 2 2 f f f . . . 
                        . . f f f e e e e e e f f f . . 
                        . . f f e 2 2 2 2 2 2 e e f . . 
                        . . f e 2 f f f f f f 2 e f . . 
                        . . f f f f e e e e f f f f . . 
                        . f f e f b f 4 4 f b f e f f . 
                        . f e e 4 1 f d d f 1 4 e e f . 
                        . . f e e d d d d d d e e f . . 
                        . . . f e e 4 4 4 4 e e f . . . 
                        . . e 4 f 2 2 2 2 2 2 f 4 e . . 
                        . . 4 d f 2 2 2 2 2 2 f d 4 . . 
                        . . 4 4 f 4 4 5 5 4 4 f 4 4 . . 
                        . . . . . f f f f f f . . . . . 
                        . . . . . f f . . f f . . . . .
            `, img`
                . . . . . . . . . . . . . . . . 
                        . . . . . . f f f f . . . . . . 
                        . . . . f f f 2 2 f f f . . . . 
                        . . . f f f 2 2 2 2 f f f . . . 
                        . . f f f e e e e e e f f f . . 
                        . . f e e 2 2 2 2 2 2 e f f . . 
                        . f f e 2 f f f f f f 2 e f f . 
                        . f f f f f e e e e f f f f f . 
                        . . f e f b f 4 4 f b f e f . . 
                        . . f e 4 1 f d d f 1 4 e f . . 
                        . . e f e 4 d d d d 4 e f . . . 
                        . . e 4 d d e 2 2 2 2 f e f . . 
                        . . . e d d e 2 2 2 2 f 4 e . . 
                        . . . . e e f 5 5 4 4 f . . . . 
                        . . . . . f f f f f f f . . . . 
                        . . . . . . . . . f f f . . . .
            `], 300, true)
})
