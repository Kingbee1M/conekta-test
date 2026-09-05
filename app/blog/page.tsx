'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Clock, Calendar, ArrowUpRight, Search, Sparkles } from 'lucide-react';
import { BLOG_POSTS } from '@/lib/blog-data';

export default function BlogListingPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['All', 'Product & Vision', 'Security & Trust', 'Market Insights'];

  const filteredPosts = BLOG_POSTS.filter((post) => {
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredPost = BLOG_POSTS[0];

  return (
    <div className="min-h-screen bg-white text-text-primary selection:bg-tertiary-green selection:text-primary-green">
      
      {/* HEADER NAV */}
      <div className="border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link 
            href="/impact" 
            className="inline-flex items-center gap-2 text-xs font-bold text-gray-600 hover:text-primary-green transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Impact Hub</span>
          </Link>
          <div className="flex items-center gap-1.5 text-xs font-bold text-primary-green">
            <Sparkles className="h-4 w-4" />
            <span>Conekta Insights</span>
          </div>
        </div>
      </div>

      {/* HERO SECTION */}
      <section className="py-12 sm:py-16 border-b border-gray-100 bg-gray-50/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-4">
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-tertiary-green text-primary-green text-xs font-bold">
            News, Insights & Updates
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-gray-900 tracking-tight">
            The Conekta Blog
          </h1>
          <p className="text-xs sm:text-sm text-secondary-color max-w-xl mx-auto leading-relaxed">
            Perspectives on real estate innovation, rental safety, fractional investments, and proptech engineering.
          </p>
        </div>
      </section>

      {/* SEARCH & FILTERS */}
      <section className="py-8 border-b border-gray-100 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* CATEGORY TABS */}
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-primary-green text-white shadow-md shadow-primary-green/20'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* SEARCH INPUT */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search articles..."
              className="w-full pl-10 pr-4 py-2 rounded-2xl bg-gray-50 border border-gray-200 text-xs focus:outline-none focus:border-primary-green focus:bg-white transition-all"
            />
          </div>

        </div>
      </section>

      {/* FEATURED POST (Shown only when no search is active) */}
      {!searchQuery && selectedCategory === 'All' && featuredPost && (
        <section className="py-12 border-b border-gray-100">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400 block mb-4">
              Featured Article
            </span>
            <Link 
              href={`/blog/${featuredPost.slug}`}
              className="group grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-6 sm:p-8 rounded-3xl bg-gray-50/70 border border-gray-200/70 hover:border-primary-green/30 transition-all"
            >
              <div className="lg:col-span-7 relative h-64 sm:h-80 w-full rounded-2xl overflow-hidden bg-gray-100">
                <Image
                  src={featuredPost.coverImage}
                  alt={featuredPost.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="lg:col-span-5 space-y-4">
                <div className="flex items-center gap-3 text-[11px] text-gray-500 font-medium">
                  <span className="px-2.5 py-0.5 rounded-md bg-tertiary-green text-primary-green font-bold">
                    {featuredPost.category}
                  </span>
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{featuredPost.readTime}</span>
                </div>

                <h2 className="text-xl sm:text-2xl font-black text-gray-900 group-hover:text-primary-green transition-colors leading-snug">
                  {featuredPost.title}
                </h2>

                <p className="text-xs text-secondary-color leading-relaxed line-clamp-3">
                  {featuredPost.excerpt}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200/60">
                  <div className="flex items-center gap-2.5">
                    <Image 
                      src={featuredPost.author.avatar} 
                      alt={featuredPost.author.name}
                      width={32}
                      height={32}
                      className="rounded-full object-cover"
                    />
                    <div>
                      <p className="text-xs font-bold text-gray-900">{featuredPost.author.name}</p>
                      <p className="text-[10px] text-gray-500">{featuredPost.publishedAt}</p>
                    </div>
                  </div>
                  <span className="h-8 w-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-700 group-hover:bg-primary-green group-hover:text-white group-hover:border-primary-green transition-all">
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </div>
              </div>
            </Link>
          </div>
        </section>
      )}

      {/* POSTS GRID */}
      <section className="py-12 sm:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">
              {selectedCategory === 'All' ? 'Recent Articles' : `${selectedCategory} Articles`}
            </h2>
            <span className="text-xs text-gray-500">{filteredPosts.length} article(s)</span>
          </div>

          {filteredPosts.length === 0 ? (
            <div className="text-center py-16 bg-gray-50 rounded-3xl border border-gray-200 space-y-2">
              <p className="text-sm font-bold text-gray-900">No articles found</p>
              <p className="text-xs text-gray-500">Try adjusting your category filter or search keywords.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group flex flex-col bg-white rounded-3xl border border-gray-200/80 overflow-hidden hover:border-primary-green/30 hover:shadow-xl transition-all"
                >
                  <div className="relative h-48 w-full bg-gray-100 overflow-hidden">
                    <Image
                      src={post.coverImage}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-white/90 backdrop-blur-md text-[10px] font-extrabold text-primary-green">
                      {post.category}
                    </span>
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3 text-[11px] text-gray-400">
                        <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{post.publishedAt}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{post.readTime}</span>
                      </div>
                      <h3 className="text-base font-bold text-gray-900 group-hover:text-primary-green transition-colors leading-snug line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-xs text-secondary-color leading-relaxed line-clamp-3">
                        {post.excerpt}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Image
                          src={post.author.avatar}
                          alt={post.author.name}
                          width={24}
                          height={24}
                          className="rounded-full object-cover"
                        />
                        <span className="text-[11px] font-bold text-gray-700">{post.author.name}</span>
                      </div>
                      <span className="text-xs font-bold text-primary-green flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                        Read <ArrowUpRight className="h-3.5 w-3.5" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

    </div>
  );
}