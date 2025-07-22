// Vite gestiona el CSS.
import './style.css'

// Importaciones de imágenes
import car1 from '@shared-assets/carrousel/lider11.avif'
import car2 from '@shared-assets/carrousel/lider12.avif'
import car3 from '@shared-assets/carrousel/lider13.avif'
import logo from '@shared-assets/logoR.avif'
import favicon from '@shared-assets/faviconlider.png'
import iniciosLiderplast from '@shared-assets/Inicios3.avif'
import vasos from '@shared-assets/category/Vasos.webp'
import platos from '@shared-assets/category/Platos.webp'
import cubiertos from '@shared-assets/category/Cubiertos.webp'
import empaques from '@shared-assets/category/Bolsas.webp'

/**
 * Usa un mapa para que sea más fácil de mantener y depurar.
 */
function loadPageImages() {
    const imageMap = {
        'logo-img': logo,
        'inicio-img': iniciosLiderplast,
        'vasos': vasos,
        'platos': platos,
        'cubiertos': cubiertos,
        'empaques': empaques
    };

    for (const id in imageMap) {
        const element = document.getElementById(id);
        if (element) {
            element.src = imageMap[id];
        } else {
            console.warn(`Elemento con ID "${id}" no encontrado.`);
        }
    }
}

/**
 * Configura el favicon de la página.
 */
function setupFavicon() {
    const link = document.createElement('link');
    link.rel = 'icon';
    link.type = 'image/png';
    link.href = favicon;
    document.head.append(link);
}

/**
 * Inicializa y controla el carrusel de imágenes.
 */
function initCarousel() {
    const carouselItems = document.querySelectorAll('.carousel-item');
    const carouselImageUrls = [car1, car2, car3];
    const totalItems = carouselItems.length;
    if (totalItems === 0) return;

    let currentIndex = 0;

    carouselItems.forEach((item, index) => {
        if (carouselImageUrls[index]) {
            item.style.backgroundImage = `url(${carouselImageUrls[index]})`;
        }
    });

    function showNextItem() {
        carouselItems[currentIndex].classList.remove('is-active');
        currentIndex = (currentIndex + 1) % totalItems;
        carouselItems[currentIndex].classList.add('is-active');
    }

    carouselItems[0].classList.add('is-active');
    setInterval(showNextItem, 5000);
}

/**
 * Gestiona el efecto de scroll en el header para cambiar su apariencia.
 */
function initHeaderScrollEffect() {
    const header = document.getElementById('main-header');
    if (!header) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('header-scrolled');
        } else {
            header.classList.remove('header-scrolled');
        }
    });
}

/**
 * Gestiona la lógica de la burbuja y notificación de WhatsApp.
 */
function initWhatsAppWidget() {
    const bubble = document.getElementById('whatsapp-bubble');
    const dot = document.getElementById('whatsapp-dot');
    const button = document.getElementById('whatsapp-button');

    if (!bubble || !dot || !button) return;

    const startBubbleCycle = () => {
        setTimeout(() => bubble.classList.add('is-hidden'), 7000);
        setInterval(() => {
            bubble.classList.remove('is-hidden');
            setTimeout(() => bubble.classList.add('is-hidden'), 7000);
        }, 10000);
    };

    button.addEventListener('click', () => {
        dot.style.display = 'none';
    }, {once: true});

    startBubbleCycle();
}

// --- PUNTO DE ENTRADA PRINCIPAL ---
document.addEventListener('DOMContentLoaded', () => {
    try {
        setupFavicon();
        loadPageImages();
        initCarousel();
        initHeaderScrollEffect();
        initWhatsAppWidget();
    } catch (error) {
        console.error("Ocurrió un error durante la inicialización de los scripts:", error);
    }
});