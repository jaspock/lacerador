

def init_lab (lab:List[List[number]], visitado:List[List[bool]]):
    for i in range(LADO):
        lab.append([])
        visitado.append([])
        for j in range(LADO):
            if i%2==0 or j%2==0:
                lab[i].append(MURO)
                visitado[i].append(True)
            else:
                lab[i].append(PASILLO)
                visitado[i].append(False)

def pinta_mosaicos(lab:List[List[number]]):
    for i in range(LADO):
        for j in range(LADO):
            if lab[i][j]==MURO:
                tiles.set_tile_at(tiles.get_tile_location(i, j), sprites.builtin.brick)
                tiles.set_wall_at(tiles.get_tile_location(i, j), True)
            elif lab[i][j]==PASILLO:
                tiles.set_tile_at(tiles.get_tile_location(i, j), sprites.dungeon.dark_ground_center)
            elif lab[i][j]==PUERTA:
                puerta = sprites.create(img("""
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
                """),SpriteKind.puerta)
                puerta.set_position(i*16+8, j*16+8)
            elif lab[i][j]==TELETRANSPORTADOR:
                puerta = sprites.create(assets.image("""teletransportador"""),SpriteKind.teletransportador)
                puerta.set_position(i*16+8, j*16+8)


def vecinos(c:List[number]):
    v=[]
    x=c[0]
    y=c[1]
    if x-2>0:
        v.append([x-2,y])
    if y+2<LADO:
        v.append([x,y+2])
    if x+2<LADO:
        v.append([x+2,y])
    if y-2>0:
        v.append([x,y-2])
    return v
    
def vecinos_no_visitados(c:List[number]):
    todos: List[List[number]]= []
    todos=vecinos(c)
    no_visitados: List[List[number]]= []
    no_visitados=[]
    for h in todos:
        if not visitado[h[0]][h[1]]:
            no_visitados.append(h)
    return no_visitados
        

def celda_enmedio(c1:List[number],c2:List[number]):
    x1= c1[0]
    y1= c1[1]
    x2= c2[0]
    y2= c2[1]
    if y1==y2:
        y=y1
        if x2<x1:
            x=x1-1
        else:
            x=x1+1
    else:
        x=x1
        if y2<y1:
            y=y1-1
        else:
            y=y1+1
    return [x,y]

def aleatorio_impar(abajo,arriba):
    nai=randint(abajo,arriba)
    if nai%2==1:
        return nai
    elif nai==arriba:
        return nai-1
    else:
        return nai+1

def aleatorio_par(abajo,arriba):
    nap=randint(abajo,arriba)
    if nap%2==0:
        return nap
    elif nap==arriba:
        return nap-1
    else:
        return nap+1

def crea_laberinto(lab:List[List[number]], visitado:List[List[bool]]):
    pila: List[List[number]]= []
    pila.append([aleatorio_impar(0,LADO-1),aleatorio_impar(0,LADO-1)])
    while len(pila)!=0:
        actual=pila[len(pila)-1]
        visitado[actual[0]][actual[1]]= True
        vecinitos=vecinos_no_visitados(actual)
        if len(vecinitos)==0:
            pila.pop()
        else:
            n=randint(0, len(vecinitos)-1)
            sig=vecinitos[n]
            muro=celda_enmedio(actual,sig)
            lab[muro[0]][muro[1]]= PASILLO
            pila.append(sig)

def crea_puerta(lab:List[List[number]]):
    if borde==0:  # arriba
        y=0
        x=aleatorio_impar(0, LADO-1)
    elif borde==1:  # abajo
        y=LADO-1
        x=aleatorio_impar(0, LADO-1)
    elif borde==2: # izquierda
        y=aleatorio_impar(0, LADO-1)
        x=0
    else: # derecha
        y=aleatorio_impar(0, LADO-1)
        x=LADO-1
    lab[x][y]=PUERTA

def crea_teletranspotador(lab:List[List[number]]):
    for _ in range(NUM_TELETRANSPORTADORES):
        x=aleatorio_impar(0, LADO-1)
        y=aleatorio_impar(0, LADO-1)
        lab[x][y]=TELETRANSPORTADOR

def quita_muretes(lab:List[List[number]]):
    if LADO < 8:
        return
    MAX_INTENTOS= LADO*LADO*10
    intentos= 0
    muros= 0
    while muros < MUROS_DESAPARECIDOS and intentos < MAX_INTENTOS:
        x= aleatorio_par(3, LADO-4)
        y= aleatorio_par(3, LADO-4)
        if lab[x][y]==MURO:
            if lab[x-1][y]==MURO and lab[x-2][y]==MURO and \
               lab[x+1][y]==MURO and lab[x+2][y]==MURO and \
               lab[x][y+1]!=MURO and lab[x][y-1]!=MURO:
                lab[x][y]= PASILLO
                muros= muros+1
            elif lab[x][y-1]==MURO and lab[x][y-2]==MURO and \
                 lab[x][y+1]==MURO and lab[x][y+2]==MURO and \
                 lab[x+1][y]!=MURO and lab[x-1][y]!=MURO: 
                lab[x][y]= PASILLO
                muros= muros+1
        intentos= intentos+1

def crea_cruz(lab:List[List[number]], visitado:List[List[bool]]):
    celda=[3,3]
    vecinitos: List[List[number]]= []
    vecinitos=vecinos(celda)
    for v in vecinitos:
        muro=celda_enmedio(celda,v)
        xmuro= muro[0]
        ymuro= muro[1]
        lab[xmuro][ymuro]=PASILLO

def choca_chup(p,f):
    if armadillo:
        f.destroy(effects.fire, 500)
    else:
        game.over()

def coge_arma(p,a):
    global armadillo
    armadillo=True
    a.destroy(effects.star_field,500)

def toca_puerta(p,puerta):
    game.over(True,effects.blizzard)

def toca_teletransportador(p,t):
    global avisado
    if not avisado:
        avisado=True
        game.show_long_text("Pulsa A para teletransportarte cuando pases por un teletransportador.", DialogLayout.BOTTOM)
        pause(100)
    if controller.A.is_pressed():
        teseo.start_effect(effects.spray,500)
        music.sonar.play()
        teseo.set_position(aleatorio_impar(0, LADO-1)*16+8,aleatorio_impar(0, LADO-1)*16+8)
    
@namespace
class SpriteKind:
    fantasma=SpriteKind.create()
    arma=SpriteKind.create()
    puerta=SpriteKind.create()
    teletransportador=SpriteKind.create()

# LADO impar m??ximo de 255
LADO= 10
if LADO % 2 == 0:
    LADO += 1
if LADO > 255:
    LADO = 255
MUROS_DESAPARECIDOS=LADO
MURO=0
PASILLO=1
PUERTA=2
TELETRANSPORTADOR=3
NUM_FANTASMAS=6
NUM_ARMAS=NUM_FANTASMAS*2
NUM_TELETRANSPORTADORES=2
borde=randint(0,3)
armadillo=False
avisado=False


lab: List[List[number]] = []
visitado: List[List[bool]] = []


sprites.on_overlap(SpriteKind.player, SpriteKind.fantasma, choca_chup)
sprites.on_overlap(SpriteKind.player, SpriteKind.arma, coge_arma)
sprites.on_overlap(SpriteKind.player, SpriteKind.puerta, toca_puerta)
sprites.on_overlap(SpriteKind.player, SpriteKind.teletransportador, toca_teletransportador)


scene.set_background_color(3)
teseo = sprites.create(assets.image("""mi teseo"""), SpriteKind.player)
for i in range (NUM_FANTASMAS):
    fantasma = sprites.create(img("""
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
    """), SpriteKind.fantasma)
    fantasma.set_position(aleatorio_impar(0, LADO-1)*16+8,aleatorio_impar(0, LADO-1)*16+8 )    
    fantasma.follow(teseo,40)
for i in range (NUM_ARMAS):
    fantasma = sprites.create(img("""
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
    """), SpriteKind.arma)
    fantasma.set_position(aleatorio_impar(0, LADO-1)*16+8,aleatorio_impar(0, LADO-1)*16+8 )    

teseo.set_position(aleatorio_impar(0, LADO-1)*16+8,aleatorio_impar(0, LADO-1)*16+8)
controller.move_sprite(teseo)
teseo.set_bounce_on_wall(True)
# mapa del tama??o m??ximo: 255x255
tiles.set_tilemap(tilemap("""level1"""))

scene.camera_follow_sprite(teseo)

init_lab(lab, visitado)
crea_laberinto(lab, visitado)
crea_puerta(lab)
crea_teletranspotador(lab)
quita_muretes(lab)
pinta_mosaicos(lab)

def on_up_pressed():
    animation.run_image_animation(teseo,
        [img("""
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
            """),
            img("""
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
            """),
            img("""
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
            """),
            img("""
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
            """)],
        300,
        True)
controller.up.on_event(ControllerButtonEvent.PRESSED, on_up_pressed)

def on_left_pressed():
    animation.run_image_animation(teseo,
        [img("""
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
            """),
            img("""
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
            """),
            img("""
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
            """),
            img("""
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
            """)],
        300,
        True)
controller.left.on_event(ControllerButtonEvent.PRESSED, on_left_pressed)

def on_right_pressed():
    animation.run_image_animation(teseo,
        [img("""
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
            """),
            img("""
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
            """),
            img("""
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
            """),
            img("""
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
            """)],
        300,
        True)
controller.right.on_event(ControllerButtonEvent.PRESSED, on_right_pressed)

def on_down_pressed():
    animation.run_image_animation(teseo,
        [img("""
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
            """),
            img("""
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
            """),
            img("""
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
            """),
            img("""
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
            """)],
        300,
        True)
controller.down.on_event(ControllerButtonEvent.PRESSED, on_down_pressed)
