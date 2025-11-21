import type {EmprendePost} from '../../types';
import {Link} from 'react-router-dom';
import {slugify} from '../../utils/utils';
import {ShoppingBag} from 'lucide-react';

interface EmprendePostCardProps {
    post: EmprendePost;
}

const getYouTubeVideoId = (url: string): string | null => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
};

export const EmprendePostCard = ({post}: EmprendePostCardProps) => {
    const videoId = getYouTubeVideoId(post.youtubeUrl);
    const thumbnailUrl = videoId ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg` : '/placeholder.png';

    return (
        <Link
            to={`/emprender/${slugify(post.title)}/${post.id}`}
            className="bg-[var(--color-card)] rounded-lg shadow-md border border-[var(--color-border)] overflow-hidden flex flex-col h-full group"
        >
            <div className="block relative aspect-video">
                <img src={thumbnailUrl} alt={post.title} className="w-full h-full object-cover"/>
                <div
                    className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg className="w-16 h-16 text-white" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M8 5v14l11-7z"/>
                    </svg>
                </div>
            </div>

            <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold mb-2 line-clamp-2 group-hover:text-primary transition-colors">{post.title}</h3>
                {post.description && (
                    <p className="text-[var(--color-foreground)]/80 text-sm mb-4 line-clamp-3 flex-grow">
                        {post.description}
                    </p>
                )}

                {post.products && post.products.length > 0 && (
                    <div className="mt-auto pt-4 border-t border-[var(--color-border)]">
                        <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                            <ShoppingBag className="h-4 w-4 text-primary"/>
                            Productos en este video:
                        </h4>
                        <div className="flex flex-wrap gap-2">
                            {post.products.map(({product}) => (
                                <span
                                    key={product.id}
                                    className="px-3 py-1 bg-[var(--color-muted)] text-[var(--color-muted-foreground)] border border-[var(--color-border)] rounded-full text-xs"
                                >
                                     {product.name}
                                 </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </Link>
    );
};