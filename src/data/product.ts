import type { CategoryImageKey } from "../utils/images";

export interface Product {
    id: number;
    name: string;
    title: string;
    description: string;
    category: string;
    image: CategoryImageKey;   // TS se asegura de que aquí solo pongas esas claves
}

// Definimos el array directamente en TS y lo comprobamos con `satisfies`
export const products =[
  {
    "id": 1,
    "title": "Contenedores Darnel Alimentos",
    "name": "Contenedores Desechables",
    "description": "Contenedores desechables de la marca Darnel para alimentos.",
    "category": "contenedores",
    "image": "contenedorP"
  },
    {
        "id": 2,
        "title": "Bolsa Parafinada Papas Fritas",
        "name": "",
        "description": "",
        "category": "bolsas",
        "image": "contenedorP"
    },
    {
        "id": 3,
        "title": "Contenedores Darnel Alimentos",
        "name": "Contenedores Desechables",
        "description": "Contenedores desechables de la marca Darnel para alimentos.",
        "category": "Cubiertos",
        "image": "contenedorP"
    }
] satisfies Product[];
