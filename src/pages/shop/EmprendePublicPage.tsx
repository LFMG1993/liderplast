import { useMemo } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { emprendePostService } from '../../services/emprendePostService';
import { SEO } from '../../components/general/SEO';
import { Spinner } from '../../components/general/Spinner';
import { Button } from '../../components/general/Button';
import { EmprendePostCard } from '../../components/emprende/EmprendePostCard';
import { useTranslation } from 'react-i18next';

export default function EmprendePublicPage() {
    const { t } = useTranslation();

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        isError,
        error
    } = useInfiniteQuery({
        queryKey: ['publicEmprendePosts'],
        queryFn: ({ pageParam = 1 }) => emprendePostService.listPublic({
            page: pageParam,
            pageSize: 9, // Mostramos 9 posts por página
        }),
        initialPageParam: 1,
        getNextPageParam: (lastPage, allPages) => {
            return lastPage.data.length > 0 ? allPages.length + 1 : undefined;
        },
    });

    const posts = useMemo(() => data?.pages.flatMap(page => page.data) ?? [], [data]);

    return (
        <>
            <SEO
                title={t('emprende.seoTitle')}
                description={t('emprende.seoDescription')}
                canonicalUrl="/emprender"
            />
            <main className="bg-[var(--color-background)] text-[var(--color-foreground)]">
                <section className="relative py-16 bg-primary/10">
                    <div className="container mx-auto text-center px-4">
                        <h1 className="text-4xl md:text-5xl font-bold uppercase">{t('emprende.title')}</h1>
                        <p className="mt-4 max-w-2xl mx-auto text-[var(--color-foreground)]/80 text-lg">
                            {t('emprende.subtitle')}
                        </p>
                    </div>
                </section>

                <section className="py-8">
                    <div className="container mx-auto px-4">
                        {isLoading ? (
                            <div className="flex justify-center items-center py-16"><Spinner /></div>
                        ) : isError ? (
                            <p className="text-center text-red-500">{t('emprende.errorLoading')} {(error as Error).message}</p>
                        ) : posts.length === 0 ? (
                            <p className="text-center text-[var(--color-foreground)]/60">{t('emprende.emptyState')}</p>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {posts.map(post => (
                                    <EmprendePostCard key={post.id} post={post} />
                                ))}
                            </div>
                        )}

                        <div className="col-span-full flex justify-center mt-12">
                            {hasNextPage && (
                                <Button onClick={() => fetchNextPage()} disabled={isFetchingNextPage} variant="primary" size="lg">
                                    {isFetchingNextPage ? t('emprende.loadingMore') : t('emprende.loadMore')}
                                </Button>
                            )}
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
}