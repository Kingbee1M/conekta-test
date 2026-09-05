import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Clock, Share2, Bookmark } from 'lucide-react';
import { BLOG_POSTS } from '@/lib/blog-data';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="min-h-screen bg-white text-text-primary selection:bg-tertiary-green selection:text-primary-green">
      
      {/* HEADER NAV */}
      <div className="border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link 
            href="/blog" 
            className="inline-flex items-center gap-2 text-xs font-bold text-gray-600 hover:text-primary-green transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>All Articles</span>
          </Link>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-600 transition-colors">
              <Share2 className="h-4 w-4" />
            </button>
            <button className="p-2 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-600 transition-colors">
              <Bookmark className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ARTICLE HEADER */}
      <header className="pt-10 pb-8 max-w-3xl mx-auto px-4 sm:px-6 space-y-6">
        <div className="flex items-center gap-3 text-xs">
          <span className="px-3 py-1 rounded-full bg-tertiary-green text-primary-green font-bold">
            {post.category}
          </span>
          <span className="text-gray-400">•</span>
          <span className="text-gray-500 flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{post.readTime}</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-gray-900 tracking-tight leading-[1.15]">
          {post.title}
        </h1>

        <p className="text-base sm:text-lg text-secondary-color leading-relaxed font-normal">
          {post.excerpt}
        </p>

        {/* AUTHOR CARD */}
        <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
          <Image
            src={post.author.avatar}
            alt={post.author.name}
            width={44}
            height={44}
            className="rounded-full object-cover"
          />
          <div>
            <p className="text-xs font-bold text-gray-900">{post.author.name}</p>
            <p className="text-[11px] text-gray-500">{post.author.role} • {post.publishedAt}</p>
          </div>
        </div>
      </header>

      {/* COVER IMAGE */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 mb-12">
        <div className="relative h-64 sm:h-96 w-full rounded-3xl overflow-hidden bg-gray-100 border border-gray-200">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>

      {/* ARTICLE CONTENT */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 pb-20 space-y-6 text-sm sm:text-base text-gray-700 leading-relaxed">
        {post.content.map((block, index) => {
          if (block.type === 'paragraph') {
            return <p key={index}>{block.text}</p>;
          }
          if (block.type === 'heading') {
            return (
              <h2 key={index} className="text-xl sm:text-2xl font-extrabold text-gray-900 pt-4">
                {block.text}
              </h2>
            );
          }
          if (block.type === 'quote') {
            return (
              <blockquote key={index} className="p-6 rounded-2xl bg-tertiary-green/40 border-l-4 border-primary-green text-gray-900 font-medium italic my-6">
                &quot;{block.text}&quot;
              </blockquote>
            );
          }
          if (block.type === 'list' && block.items) {
            return (
              <ul key={index} className="space-y-2 pl-5 list-disc my-4">
                {block.items.map((item, itemIdx) => (
                  <li key={itemIdx}>{item}</li>
                ))}
              </ul>
            );
          }
          return null;
        })}
      </div>

    </article>
  );
}