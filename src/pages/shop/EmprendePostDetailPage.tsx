import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import YouTube from 'react-youtube';
import { emprendePostService } from '../../services/emprendePostService';
import { SEO } from '../../components/general/SEO';
import { Spinner } from '../../components/general/Spinner';
import { slugify } from '../../utils/utils';
import { ShoppingBag } from 'lucide-react';

export default function EmprendePostDetailPage() {
    const { id } = useParams<{ id: string }>();

    const { data: post, isLoading, isError, error } = useQuery({
        queryKey: ['publicEmprendePost', id],
        queryFn: () => emprendePostService.getPublicById(Number(id)),
        enabled: !!id,
    });

    const getYouTubeVideoId = (url: string): string | null => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    if (isLoading) {
        return <div className="flex justify-center items-center h-screen"><Spinner /></div>;
    }

    if (isError) {
        return <div className="text-center py-20 text-red-500">Error al cargar el post: {(error as Error).message}</div>;
    }

    if (!post) {
        return <div className="text-center py-20">Post no encontrado.</div>;
    }

    const videoId = getYouTubeVideoId(post.youtubeUrl);

    return (
        <>
            <SEO
                title={`${post.title} - Emprende con Liderplast`}
                description={post.description || ''}
                canonicalUrl={`/emprender/${slugify(post.title)}/${post.id}`}
            />
            <main className="bg-[var(--color-background)] text-[var(--color-foreground)]">
                <div className="container mx-auto px-4 py-12">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">

                        {/* Columna Izquierda: Video */}
                        <div className="lg:col-span-2">
                            {videoId ? (
                                <div className="relative aspect-video rounded-lg overflow-hidden shadow-lg">
                                    <YouTube
                                        videoId={videoId}
                                        opts={{
                                            width: '100%',
                                            height: '100%',
                                            playerVars: { autoplay: 0, controls: 1 },
                                        }}
                                        className="absolute top-0 left-0 w-full h-full"
                                    />
                                </div>
                            ) : (
                                <div className="aspect-video bg-[var(--color-muted)] flex items-center justify-center rounded-lg">
                                    <p>Video no disponible.</p>
                                </div>
                            )}
                        </div>

                        {/* Columna Derecha: Información */}
                        <div className="lg:col-span-1">
                            <h1 className="text-3xl lg:text-4xl font-bold mb-4">{post.title}</h1>
                            {post.description && (
                                <p className="text-[var(--color-foreground)]/80 mb-8 leading-relaxed">
                                    {post.description}
                                </p>
                            )}

                            {post.products && post.products.length > 0 && (
                                <div className="mt-auto pt-6 border-t border-[var(--color-border)]">
                                    <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                        <ShoppingBag className="h-5 w-5 text-primary" />
                                        Productos Recomendados
                                    </h4>
                                    <div className="flex flex-col gap-3">
                                        {post.products.map(({ product }) => (
                                            <Link
                                                key={product.id}
                                                to={`/producto/${slugify(product.name)}/${product.id}`}
                                                className="flex items-center gap-3 p-3 bg-[var(--color-muted)] rounded-md hover:bg-[var(--color-border)] transition-colors"
                                            >
                                                <img src={product.imageUrl ?? '/placeholder.png'} alt={product.name} className="w-12 h-12 object-cover rounded-md flex-shrink-0" />
                                                <span className="text-sm font-medium">{product.name}</span>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}