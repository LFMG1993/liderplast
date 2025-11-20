// imagenes del home
import logo from "../assets/logo.avif";
import fachada from "../assets/iniciosLiderplast.avif";
import slider1 from "../assets/slider1.avif";
import multiSocialMedia from "../assets/multiSocialMedia.webp";
// Imagenes de las categorias
import contenedores from "../assets/category/Contenedores.webp";
import Bandejas from "../assets/category/Bandejas.webp";
import Bioseguridad from "../assets/category/Bioseguridad.webp";
import Bolsas from "../assets/category/Bolsas.webp";
import Cubiertos from "../assets/category/Cubiertos.webp";
import Frascos from "../assets/category/Frascos.webp";
import Platos from "../assets/category/Platos.webp";
import Vasos from "../assets/category/Vasos.webp";
import PeliculaExtensible from "../assets/category/PeliculaExtensible.webp";
import Alimentos from "../assets/category/Alimentos.webp"
import Catering from "../assets/category/Catering.webp";

export const ImagesHome = {logo, fachada, slider1} as const;
export const ImagesUI = {multiSocialMedia} as const;
export const ImagesCategory = {
    contenedores,
    Bandejas,
    Bioseguridad,
    Bolsas,
    Cubiertos,
    Frascos,
    Platos,
    Vasos,
    PeliculaExtensible,
    Alimentos,
    Catering
} as const;
