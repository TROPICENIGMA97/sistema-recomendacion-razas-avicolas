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

tolerancia_calor(leghorn,          alta).
tolerancia_calor(rhode_island_red, alta).
tolerancia_calor(cuello_desnudo,   muy_alta).
tolerancia_calor(new_hampshire,    alta).
tolerancia_calor(australorp,       media).
tolerancia_calor(broiler,          baja).
tolerancia_calor(isa_brown,        alta).
tolerancia_calor(criollo,          muy_alta).
tolerancia_calor(plymouth_rock,    media).

consumo_alimento(leghorn,          bajo).
consumo_alimento(rhode_island_red, medio).
consumo_alimento(cuello_desnudo,   bajo).
consumo_alimento(new_hampshire,    alto).
consumo_alimento(australorp,       medio).
consumo_alimento(broiler,          alto).
consumo_alimento(isa_brown,        medio).
consumo_alimento(criollo,          muy_bajo).
consumo_alimento(plymouth_rock,    medio).

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

pts_calor(Raza, 3) :- tolerancia_calor(Raza, muy_alta), !.
pts_calor(Raza, 2) :- tolerancia_calor(Raza, alta), !.
pts_calor(Raza, 1) :- tolerancia_calor(Raza, media), !.
pts_calor(_, 0).

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

pts_alimentacion(Raza, limitado, 3) :- consumo_alimento(Raza, muy_bajo), !.
pts_alimentacion(Raza, limitado, 2) :- consumo_alimento(Raza, bajo), !.
pts_alimentacion(Raza, limitado, 1) :- consumo_alimento(Raza, medio), !.
pts_alimentacion(_, limitado, 0).
pts_alimentacion(Raza, moderado, 3) :- consumo_alimento(Raza, muy_bajo), !.
pts_alimentacion(Raza, moderado, 3) :- consumo_alimento(Raza, bajo), !.
pts_alimentacion(Raza, moderado, 2) :- consumo_alimento(Raza, medio), !.
pts_alimentacion(_, moderado, 1).
pts_alimentacion(_, abundante, 3).

recomendar(Objetivo, Presupuesto, Experiencia, Alimentacion, Raza, Total) :-
    raza(Raza),
    pts_proposito(Raza, Objetivo, P1),
    P1 > 0,
    pts_calor(Raza, P2),
    pts_presupuesto(Raza, Presupuesto, P3),
    pts_experiencia(Raza, Experiencia, P4),
    pts_alimentacion(Raza, Alimentacion, P5),
    Total is (P1 * 3) + (P2 * 2) + P3 + P4 + P5.
`;

export const MAX_SCORE = 24;
