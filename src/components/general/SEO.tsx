import {Helmet} from 'react-helmet-async';

interface SEOProps {
    title: string;
    description: string;
    canonicalUrl?: string;
    imageUrl?: string;
    ogImage?: string;
    noIndex?: boolean;
}

/**
 * Componente reutilizable para gestionar las etiquetas de SEO de cada página.
 * Proporciona valores por defecto y permite sobreescribirlos.
 */
export const SEO = ({title, description, canonicalUrl, ogImage, noIndex}: SEOProps) => {
    const siteName = "Liderplast";
    const fullTitle = `${title} | ${siteName}`;
    const defaultOgImage = "https://distribucioneslider.com.co/og-image.jpg";
    const finalOgImage = ogImage || defaultOgImage;
    const siteUrl = "https://distribucioneslider.com.co";
    const finalCanonicalUrl = canonicalUrl ? `${siteUrl}${canonicalUrl}` : siteUrl;

    const businessSchema = {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "name": "Distribuciones Liderplast",
        "image": "https://distribucioneslider.com.co/logo-para-schema.png",
        "@id": siteUrl,
        "url": siteUrl,
        "telephone": "+573242940464",
        "priceRange": "$$",
        "address": {
            "@type": "PostalAddress",
            "streetAddress": "Calle 6 # 4 - 18, Barrio Latino",
            "addressLocality": "Cúcuta",
            "addressRegion": "Norte de Santander",
            "postalCode": "540006",
            "addressCountry": "CO"
        },
        "geo": {
            "@type": "GeoCoordinates",
            "latitude": 7.891117,
            "longitude": -72.503773
        },
        "openingHoursSpecification": {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": [
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday"
            ],
            "opens": "07:30",
            "closes": "18:00"
        },
        "sameAs": [
            "https://web.facebook.com/lider.plast.52",
            "https://www.instagram.com/distribucionesliderplast",
            "https://www.tiktok.com/@liderplast1"
        ]
    };

    return (
        <Helmet>
            {noIndex && <meta name="robots" content="noindex, nofollow"/>}
            <title>{fullTitle}</title>
            <meta name="description" content={description}/>
            <link rel="canonical" href={finalCanonicalUrl}/>

            {/* Open Graph */}
            <meta property="og:title" content={fullTitle}/>
            <meta property="og:description" content={description}/>
            <meta property="og:image" content={finalOgImage}/>
            <meta property="og:url" content={finalCanonicalUrl}/>
            <meta property="og:site_name" content={siteName}/>

            {/* Twitter Cards */}
            <meta name="twitter:title" content={fullTitle}/>
            <meta name="twitter:description" content={description}/>
            <meta name="twitter:image" content={finalOgImage}/>

            {/* Schema.org JSON-LD */}
            <script type="application/ld+json">
                {JSON.stringify(businessSchema)}
            </script>
        </Helmet>
    );
};