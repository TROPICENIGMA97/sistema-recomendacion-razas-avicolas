export const PROLOG_CODE = `
raza(leghorn).
raza(rhode_island_red).
raza(cuello_desnudo).
raza(new_hampshire).
raza(australorp).
raza(broiler).
raza(isa_brown).
raza(criollo).
raza(plymouth_rock).

proposito(leghorn,          huevo).
proposito(rhode_island_red, doble_proposito).
proposito(cuello_desnudo,   doble_proposito).
proposito(new_hampshire,    carne).
proposito(australorp,       huevo).
proposito(broiler,          carne).
proposito(isa_brown,        huevo).
proposito(criollo,          doble_proposito).
proposito(plymouth_rock,    doble_proposito).

clima_optimo(leghorn,          calido_seco).
clima_optimo(rhode_island_red, calido_humedo).
clima_optimo(cuello_desnudo,   calido_humedo).
clima_optimo(new_hampshire,    calido_seco).
clima_optimo(australorp,       templado).
clima_optimo(broiler,          templado).
clima_optimo(isa_brown,        calido_seco).
clima_optimo(criollo,          calido_humedo).
clima_optimo(plymouth_rock,    templado).

espacio_requerido(leghorn,          mediano).
espacio_requerido(rhode_island_red, mediano).
espacio_requerido(cuello_desnudo,   pequeno).
espacio_requerido(new_hampshire,    grande).
espacio_requerido(australorp,       mediano).
espacio_requerido(broiler,          grande).
espacio_requerido(isa_brown,        pequeno).
espacio_requerido(criollo,          pequeno).
espacio_requerido(plymouth_rock,    mediano).

resistencia(leghorn,          media).
resistencia(rhode_island_red, alta).
resistencia(cuello_desnudo,   muy_alta).
resistencia(new_hampshire,    alta).
resistencia(australorp,       alta).
resistencia(broiler,          baja).
resistencia(isa_brown,        media).
resistencia(criollo,          muy_alta).
resistencia(plymouth_rock,    alta).

facilidad(leghorn,          media).
facilidad(rhode_island_red, facil).
facilidad(cuello_desnudo,   facil).
facilidad(new_hampshire,    facil).
facilidad(australorp,       facil).
facilidad(broiler,          media).
facilidad(isa_brown,        facil).
facilidad(criollo,          muy_facil).
facilidad(plymouth_rock,    facil).

costo(leghorn,          medio).
costo(rhode_island_red, medio).
costo(cuello_desnudo,   bajo).
costo(new_hampshire,    medio).
costo(australorp,       medio).
costo(broiler,          alto).
costo(isa_brown,        alto).
costo(criollo,          muy_bajo).
costo(plymouth_rock,    medio).

pts_proposito(Raza, Obj, 3) :- proposito(Raza, Obj), !.
pts_proposito(Raza, huevo, 2) :- proposito(Raza, doble_proposito), !.
pts_proposito(Raza, carne, 2) :- proposito(Raza, doble_proposito), !.
pts_proposito(_, _, 0).

pts_clima(Raza, C, 3) :- clima_optimo(Raza, C), !.
pts_clima(Raza, calido_humedo, 2) :- clima_optimo(Raza, calido_seco), !.
pts_clima(Raza, calido_seco,   2) :- clima_optimo(Raza, calido_humedo), !.
pts_clima(Raza, templado,      2) :- clima_optimo(Raza, calido_humedo), !.
pts_clima(Raza, templado,      2) :- clima_optimo(Raza, calido_seco), !.
pts_clima(Raza, calido_humedo, 1) :- clima_optimo(Raza, templado), !.
pts_clima(Raza, calido_seco,   1) :- clima_optimo(Raza, templado), !.
pts_clima(_, _, 1).

pts_espacio(Raza, pequeno, 3) :- espacio_requerido(Raza, pequeno), !.
pts_espacio(Raza, pequeno, 1) :- espacio_requerido(Raza, mediano), !.
pts_espacio(_, pequeno, 0).
pts_espacio(Raza, mediano, 3) :- espacio_requerido(Raza, pequeno), !.
pts_espacio(Raza, mediano, 3) :- espacio_requerido(Raza, mediano), !.
pts_espacio(Raza, mediano, 1) :- espacio_requerido(Raza, grande), !.
pts_espacio(_, grande, 3).

pts_presupuesto(Raza, bajo, 3) :- costo(Raza, muy_bajo), !.
pts_presupuesto(Raza, bajo, 2) :- costo(Raza, bajo), !.
pts_presupuesto(Raza, bajo, 1) :- costo(Raza, medio), !.
pts_presupuesto(_, bajo, 0).
pts_presupuesto(Raza, medio, 3) :- costo(Raza, muy_bajo), !.
pts_presupuesto(Raza, medio, 3) :- costo(Raza, bajo), !.
pts_presupuesto(Raza, medio, 2) :- costo(Raza, medio), !.
pts_presupuesto(_, medio, 1).
pts_presupuesto(_, alto, 3).

pts_experiencia(Raza, principiante, 3) :- facilidad(Raza, muy_facil), !.
pts_experiencia(Raza, principiante, 2) :- facilidad(Raza, facil), !.
pts_experiencia(Raza, principiante, 1) :- facilidad(Raza, media), !.
pts_experiencia(_, principiante, 0).
pts_experiencia(Raza, intermedio, 3) :- facilidad(Raza, muy_facil), !.
pts_experiencia(Raza, intermedio, 3) :- facilidad(Raza, facil), !.
pts_experiencia(Raza, intermedio, 2) :- facilidad(Raza, media), !.
pts_experiencia(_, intermedio, 1).
pts_experiencia(_, experto, 3).

recomendar(Objetivo, Clima, Espacio, Presupuesto, Experiencia, Raza, Total) :-
    raza(Raza),
    pts_proposito(Raza, Objetivo, P1),
    P1 > 0,
    pts_clima(Raza, Clima, P2),
    pts_espacio(Raza, Espacio, P3),
    pts_presupuesto(Raza, Presupuesto, P4),
    pts_experiencia(Raza, Experiencia, P5),
    Total is (P1 * 3) + (P2 * 2) + P3 + P4 + P5.
`;

export const MAX_SCORE = 24;
