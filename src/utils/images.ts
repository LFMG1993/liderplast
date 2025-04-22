// imagenes del home
import logo from "../assets/logo.png";
import fachada from "../assets/fachada.jpg";
import slider1 from "../assets/slider1.png";
// Imagenes de las categorias
import contenedorP from "../assets/ContenedorPresentacion.avif";
import contenedores from "../assets/category/Contenedores.webp";
import Bandejas from "../assets/category/Bandejas.webp";
import Bioseguridad from "../assets/category/Bioseguridad.webp";
import Bolsas from "../assets/category/Bolsas.webp";
import Cubiertos from "../assets/category/Cubiertos.webp";
import Frascos from "../assets/category/Frascos.webp";
import Platos from "../assets/category/Platos.webp";
import Vasos from "../assets/category/Vasos.webp";
import PeliculasExtensibles from "../assets/category/PeliculasExtensibles.webp";
import Alimentos from "../assets/category/Alimentos.webp"
import Catering from "../assets/category/Catering.webp";
// Imagenes de los productos
import Azucar from "../assets/products/Azucar-RIOPAILA-tubipack.avif";
import BandejaIco01 from "../assets/products/Bandeja-icopor-1.avif";
import BandejaIco04 from "../assets/products/Bandeja-icopor-4.avif";
import BandejaIco07 from "../assets/products/Bandeja-icopor-7.avif";
import BandejaIco08 from "../assets/products/Bandeja-icopor-8.avif";
import BandejaIco17 from "../assets/products/Bandeja-icopor-17.avif";
import Base17x8 from "../assets/products/Base-17x8cm.avif";
import BasesDoradasCarton from "../assets/products/Bases-Doradas-Carton.avif";
import BolsaAlum5x5 from "../assets/products/Bolsa-Aluminio-5x5.avif";
import BolsaPapelCubiertos from "../assets/products/Bolsa-Papel-Cubiertos.avif";
import BolsaBoutiqueEstampadas from "../assets/products/Bolsas-Boutique-Estampadas.webp";
import BolsaPapelBlanco from "../assets/products/Bolsas-Papel-Blanco.avif";
import BolsaPapelKraft from "../assets/products/Bolsas-Papel-Kraf.avif";
import Brocheta from "../assets/products/Brocheta-15cm.avif";
import CajaDesayunos from "../assets/products/Caja-Desayuno-Sorpresa.avif";
import CajaPizza from "../assets/products/Caja-pizza-blanca.avif";
import CajaTortas from "../assets/products/Cajas-Tortas.avif";
import Capacillos from "../assets/products/Capacillos.avif";
import CavasIcopor from "../assets/products/Cavas-Icopor.avif";
import Contenedor3Rect from "../assets/products/Contenedor-3-Divisiones-Rectangular.avif";
import Contenedor4 from "../assets/products/Contenedor-4-Divisiones.avif";
import ContenedorDobleUso from "../assets/products/Contenedor-Doble-Uso.avif";
import ContenedorIco4 from "../assets/products/Contenedor-icopor-4oz.avif";
import ContenedorIco8 from "../assets/products/Contenedor-icopor-8oz.avif";
import ContenedorIco12 from "../assets/products/Contenedor-icopor-12oz.avif";
import ContenedorIco16 from "../assets/products/Contenedor-icopor-16oz.avif";
import ContenedorIco24 from "../assets/products/Contenedor-icopor-24oz.avif";
import ContenedorIco32 from "../assets/products/Contenedor-icopor-32oz.avif";
import CopaFlauta from "../assets/products/Copa-Flauta.avif";
import CopasMurano from "../assets/products/Copas-murano-1.5ozjpg.avif";
import Cucharitas from "../assets/products/Cucharita.avif";
import DomoRect from "../assets/products/Domo-Rectangular-34cm.avif";
import EmpaqueHuevosCo from "../assets/products/Empaque-Huevos-Codorniz.avif";
import FrascosCuadrados from "../assets/products/Frascos-Cuadradados.avif";
import FrascosRedondos from "../assets/products/Frascos-Redondos.avif";
import Garrafa1L from "../assets/products/Garrafa-litro.avif";
import Mezclador from "../assets/products/Mezclador-Economico.avif";
import MiniPack from "../assets/products/mini-packs.avif";
import MoldeAluminio from "../assets/products/MOLDE-ALUMINIO.avif";
import MoldeMufi from "../assets/products/Molde-Mufi.avif";
import Motita6 from "../assets/products/Motita-6oz.avif";
import SetCubiertosDuo from "../assets/products/Set-Cubiertos-tami-Duo.avif";
import SerCubiertos3 from "../assets/products/Set-Cubiertos-tami-x3.avif";
import CubiertoTami11 from "../assets/products/Tami-11cm-Blanca-x100.avif";
import VasosCafe from "../assets/products/Vasos-cafe-papel.avif";
export const ImagesHome = { logo, fachada, slider1} as const;
export const ImagesCategory = { contenedorP, contenedores, Bandejas, Bioseguridad, Bolsas, Cubiertos, Frascos, Platos, Vasos, PeliculasExtensibles, Alimentos, Catering }as const;
export const ImagesProducts = { Azucar, BandejaIco01, BandejaIco04, BandejaIco07, BandejaIco08, BandejaIco17, Base17x8, BasesDoradasCarton, BolsaAlum5x5,
    BolsaPapelCubiertos, BolsaBoutiqueEstampadas, BolsaPapelBlanco, BolsaPapelKraft, Brocheta, CajaDesayunos, CajaPizza, CajaTortas, Capacillos, CavasIcopor, Contenedor3Rect
    , Contenedor4, ContenedorDobleUso, ContenedorIco4, ContenedorIco8, ContenedorIco12, ContenedorIco16, ContenedorIco24, ContenedorIco32, CopaFlauta,
    CopasMurano, Cucharitas, DomoRect, EmpaqueHuevosCo, FrascosCuadrados, FrascosRedondos, Garrafa1L, Mezclador, MiniPack, MoldeAluminio, MoldeMufi,
    Motita6, SetCubiertosDuo, SerCubiertos3, CubiertoTami11, VasosCafe } as const;

export type HomeImageKey = keyof typeof ImagesHome;
export type CategoryImageKey = keyof typeof ImagesCategory;
export type ProductImageKey = keyof typeof ImagesProducts;