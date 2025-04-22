import type { ProductImageKey} from "../utils/images";

export interface Product {
    id: number;
    name: string;
    title: string;
    description: string;
    category: string;
    image: ProductImageKey;   // TS se asegura de que aquí solo pongas esas claves
}

// Definimos el array directamente en TS y lo comprobamos con `satisfies`
export const products =[
  {
    "id": 1,
    "title": "Paquete de Azucar 5g",
    "name": "Azucar Riopaila",
    "description": "",
    "category": "alimentos",
    "image": "Azucar"
  },
    {
        "id": 2,
        "title": "Bandeja Icopor N 1",
        "name": "",
        "description": "",
        "category": "platos",
        "image": "BandejaIco01"
    },
    {
        "id": 3,
        "title": "Bandeja Icopor N 4",
        "name": "",
        "description": "",
        "category": "platos",
        "image": "BandejaIco04"
    },
    {
        "id": 4,
        "title": "Bandeja Icopor N 7",
        "name": "",
        "description": "",
        "category": "platos",
        "image": "BandejaIco07"
    },
    {
        "id": 5,
        "title": "Bandeja Icopor N 8",
        "name": "",
        "description": "",
        "category": "platos",
        "image": "BandejaIco08"
    },
    {
        "id": 6,
        "title": "Bandeja Icopor N 17",
        "name": "",
        "description": "",
        "category": "platos",
        "image": "BandejaIco17"
    },
    {
        "id": 7,
        "title": "Base de 17x8cm",
        "name": "",
        "description": "",
        "category": "contenedores",
        "image": "Base17x8"
    },
    {
        "id": 8,
        "title": "Base de Carton Dorada",
        "name": "",
        "description": "",
        "category": "catering",
        "image": "BasesDoradasCarton"
    },
    {
        "id": 9,
        "title": "Bolsa de Aluminio 5x5",
        "name": "",
        "description": "",
        "category": "bolsas",
        "image": "BolsaAlum5x5"
    },
    {
        "id": 10,
        "title": "Bolsa de Papel para Cubiertos",
        "name": "",
        "description": "",
        "category": "bolsas",
        "image": "BolsaPapelCubiertos"
    },
    {
        "id": 11,
        "title": "Bolsas Boutique Estampadas",
        "name": "",
        "description": "",
        "category": "bolsas",
        "image": "BolsaBoutiqueEstampadas"
    },
    {
        "id": 12,
        "title": "Bolsas de Papel Blanco",
        "name": "",
        "description": "",
        "category": "bolsas",
        "image": "BolsaPapelBlanco"
    },
    {
        "id": 13,
        "title": "Bolsas de Papel Kraft",
        "name": "",
        "description": "",
        "category": "bolsas",
        "image": "BolsaPapelKraft"
    },
    {
        "id": 14,
        "title": "Brocheta de 15cm",
        "name": "",
        "description": "",
        "category": "catering",
        "image": "Brocheta"
    },
    {
        "id": 15,
        "title": "Caja de Desayuno Sorpresa",
        "name": "",
        "description": "",
        "category": "contenedores",
        "image": "CajaDesayunos"
    },
    {
        "id": 16,
        "title": "Caja de Pizza Blanca",
        "name": "",
        "description": "",
        "category": "contenedores",
        "image": "CajaPizza"
    },
    {
        "id": 17,
        "title": "Caja para Tortas",
        "name": "",
        "description": "",
        "category": "contenedores",
        "image": "CajaTortas"
    },
    {
        "id": 18,
        "title": "Capacillos",
        "name": "",
        "description": "",
        "category": "catering",
        "image": "Capacillos"
    },
    {
        "id": 19,
        "title": "Cavas de Icopor",
        "name": "",
        "description": "",
        "category": "contenedores",
        "image": "CavasIcopor"
    },
    {
        "id": 20,
        "title": "Contenedor Rectangular 3 Compartimentos",
        "name": "",
        "description": "",
        "category": "contenedores",
        "image": "Contenedor3Rect"
    },
    {
        "id": 21,
        "title": "Contenedor 4 Compartimentos",
        "name": "",
        "description": "",
        "category": "contenedores",
        "image": "Contenedor4"
    },
    {
        "id": 22,
        "title": "Contenedor Doble Uso",
        "name": "",
        "description": "",
        "category": "contenedores",
        "image": "ContenedorDobleUso"
    },
    {
        "id": 23,
        "title": "Contenedor Icopor 4oz",
        "name": "",
        "description": "",
        "category": "contenedores",
        "image": "ContenedorIco4"
    },
    {
        "id": 24,
        "title": "Contenedor Icopor 8oz",
        "name": "",
        "description": "",
        "category": "contenedores",
        "image": "ContenedorIco8"
    },
    {
        "id": 25,
        "title": "Contenedor Icopor 12oz",
        "name": "",
        "description": "",
        "category": "contenedores",
        "image": "ContenedorIco12"
    },
    {
        "id": 26,
        "title": "Contenedor Icopor 16oz",
        "name": "",
        "description": "",
        "category": "contenedores",
        "image": "ContenedorIco16"
    },
    {
        "id": 27,
        "title": "Contenedor Icopor 24oz",
        "name": "",
        "description": "",
        "category": "contenedores",
        "image": "ContenedorIco24"
    },
    {
        "id": 28,
        "title": "Contenedor Icopor 32oz",
        "name": "",
        "description": "",
        "category": "contenedores",
        "image": "ContenedorIco32"
    },
    {
        "id": 29,
        "title": "Copa Flauta",
        "name": "",
        "description": "",
        "category": "vasos",
        "image": "CopaFlauta"
    },
    {
        "id": 30,
        "title": "Copas Murano 1.5oz",
        "name": "",
        "description": "",
        "category": "vasos",
        "image": "CopasMurano"
    },
    {
        "id": 31,
        "title": "Cucharitas de Plastico",
        "name": "",
        "description": "",
        "category": "cubiertos",
        "image": "Cucharitas"
    },
    {
        "id": 32,
        "title": "Domo Rectangular 34 cm",
        "name": "",
        "description": "",
        "category": "contenedores",
        "image": "DomoRect"
    },
    {
        "id": 33,
        "title": "Empaque de Huevos de Codorniz",
        "name": "",
        "description": "",
        "category": "catering",
        "image": "EmpaqueHuevosCo"
    },
    {
        "id": 34,
        "title": "Frascos Cuadrados",
        "name": "",
        "description": "",
        "category": "frascos",
        "image": "FrascosCuadrados"
    },
    {
        "id": 35,
        "title": "Frascos Redondos",
        "name": "",
        "description": "",
        "category": "frascos",
        "image": "FrascosRedondos"
    },
    {
        "id": 36,
        "title": "Garrafa de 1 Litro",
        "name": "",
        "description": "",
        "category": "frascos",
        "image": "Garrafa1L"
    },
    {
        "id": 37,
        "title": "Mezclador Economico",
        "name": "",
        "description": "",
        "category": "catering",
        "image": "Mezclador"
    },
    {
        "id": 38,
        "title": "Mini Packs",
        "name": "",
        "description": "",
        "category": "catering",
        "image": "MiniPack"
    },
    {
        "id": 39,
        "title": "Molde de Aluminio",
        "name": "",
        "description": "",
        "category": "peliculas",
        "image": "MoldeAluminio"
    },
    {
        "id": 40,
        "title": "Molde Mufi",
        "name": "",
        "description": "",
        "category": "contenedores",
        "image": "MoldeMufi"
    },
    {
        "id": 41,
        "title": "Motita de 6oz",
        "name": "",
        "description": "",
        "category": "contenedores",
        "image": "Motita6"
    },
    {
        "id": 42,
        "title": "Set de Cubiertos Duo",
        "name": "",
        "description": "",
        "category": "cubiertos",
        "image": "SetCubiertosDuo"
    },
    {
        "id": 43,
        "title": "Set de Cubiertos Tami x3",
        "name": "",
        "description": "",
        "category": "cubiertos",
        "image": "SerCubiertos3"
    },
    {
        "id": 44,
        "title": "Cubierto Tami 11cm Blanco x100",
        "name": "",
        "description": "",
        "category": "cubiertos",
        "image": "CubiertoTami11"
    },
    {
        "id": 45,
        "title": "Vasos de Papel para cafe",
        "name": "",
        "description": "",
        "category": "vasos",
        "image": "VasosCafe"
    },

] satisfies Product[];
