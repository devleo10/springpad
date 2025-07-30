"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface NewsArticle {
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  source: {
    name: string;
  };
}
// Type for Yahoo Finance API news item
type YahooNewsItem = {
  title?: string;
  link?: string;
  summary?: string;
  thumbnail?: {
    resolutions: { url: string; tag: string; height: number; width: number }[];
  };
  providerPublishTime?: number;
  publisher?: string;
};

export function NewsPage() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNews = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const url = 'https://yahoo-finance15.p.rapidapi.com/api/v1/markets/insider-trades';
      const options = {
        method: 'GET',
        headers: {
          'x-rapidapi-key': '467dd760d8mshc30c18c0c31a7f5p1825d7jsncb49d2ac0ec7',
          'x-rapidapi-host': 'yahoo-finance15.p.rapidapi.com'
        }
      };

      const response = await fetch(url, options);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      console.log('API Response:', result); // Debug log
      
      // Check if we have valid data
      if (!result.data || !Array.isArray(result.data) || result.data.length === 0) {
        throw new Error('No news data available from API');
      }
      
      // Transform the API response to match our interface
      const transformedArticles: NewsArticle[] = (result.data as YahooNewsItem[])
        .filter((item) => item.title && item.link)
        .map((item) => {
          // Extract the best quality image URL
          let imageUrl = 'https://images.pexels.com/photos/159888/pexels-photo-159888.jpeg'; // fallback
          if (item.thumbnail?.resolutions && item.thumbnail.resolutions.length > 0) {
            // Use the largest resolution available
            const sortedResolutions = item.thumbnail.resolutions.sort((a, b) =>
              (b.width * b.height) - (a.width * a.height)
            );
            imageUrl = sortedResolutions[0].url;
          }

          return {
            title: item.title || '',
            description: item.summary || 'Read the full article for more details.',
            url: item.link || '#',
            urlToImage: imageUrl,
            publishedAt: item.providerPublishTime ?
              new Date(item.providerPublishTime * 1000).toISOString() :
              new Date().toISOString(),
            source: {
              name: item.publisher || 'Yahoo Finance'
            }
          };
        });

      if (transformedArticles.length === 0) {
        throw new Error('No valid articles found');
      }

      setArticles(transformedArticles);
      setError(null);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching news:', err);
      setError('Failed to fetch news from API. Please try again later.');
      setArticles([]); // Show empty state instead of sample data
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white relative overflow-hidden">
        {/* Background Animated Blobs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-32 h-32 bg-yellow-300/30 rounded-full blur-3xl animate-bounce"></div>
          <div className="absolute bottom-32 right-1/4 w-40 h-40 bg-yellow-200/30 rounded-full blur-2xl animate-pulse"></div>
        </div>
        
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, type: 'spring' }}
          className="relative z-10 bg-white/90 backdrop-blur-lg border border-yellow-200 rounded-2xl shadow-2xl px-8 py-10 flex flex-col items-center"
        >
          <span className="block w-14 h-14 border-4 border-yellow-400 border-t-neutral-800 rounded-full animate-spin mb-4"></span>
          <h2 className="text-lg font-bold text-[#2C5282] tracking-wide">Loading Latest News...</h2>
        </motion.div>
      </div>
    );
  }

  // Split articles into two rows for marquee animation
  const firstRowArticles = articles.slice(0, Math.ceil(articles.length / 2));
  const secondRowArticles = articles.slice(Math.ceil(articles.length / 2));

  // Error state or empty state
  if (error || articles.length === 0) {
    return (
      <div className="py-32 bg-white relative overflow-hidden">
        {/* Background Animated Blobs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-32 h-32 bg-yellow-300/30 rounded-full blur-3xl animate-bounce"></div>
          <div className="absolute bottom-32 right-1/4 w-40 h-40 bg-yellow-200/30 rounded-full blur-2xl animate-pulse"></div>
        </div>

        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-20 text-center px-4 mb-12"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-[#2C5282] mb-2">
            Mutual Fund News
          </h1>
          <p className="text-gray-600 font-medium text-lg mb-6">
            Latest Updates • Market Insights • Investment Trends
          </p>
        </motion.header>

        {/* Error/Empty State */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative z-10 max-w-2xl mx-auto px-4 text-center"
        >
          <div className="bg-white/60 backdrop-blur-lg border border-yellow-100 rounded-2xl shadow-xl p-8">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-[#2C5282] mb-2">
              {error ? 'Unable to Load News' : 'No News Available'}
            </h3>
            <p className="text-gray-600 mb-6">
              {error || 'No mutual fund news articles are currently available. Please check back later.'}
            </p>
            <button
              onClick={fetchNews}
              className="bg-yellow-300 hover:bg-yellow-400 text-[#2C5282] font-bold px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Try Again
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="py-32 bg-white relative overflow-hidden">
      {/* Background Animated Blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-yellow-300/30 rounded-full blur-3xl animate-bounce"></div>
        <div className="absolute bottom-32 right-1/4 w-40 h-40 bg-yellow-200/30 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-yellow-400/20 rounded-full blur-2xl animate-pulse"></div>
      </div>

      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-20 text-center px-4 mb-12"
      >
        <h1 className="text-3xl md:text-4xl font-bold text-[#2C5282] mb-2">
          Mutual Fund News
        </h1>
        <p className="text-gray-600 font-medium text-lg mb-6">
          Latest Updates • Market Insights • Investment Trends
        </p>
      </motion.header>

      {/* First Row - Left to Right Marquee */}
      <motion.div
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="relative z-10 mb-8 overflow-hidden"
      >
        <div className="flex animate-marquee-left space-x-6 hover:pause-animation">
          {/* Duplicate articles for seamless loop */}
          {[...firstRowArticles, ...firstRowArticles].map((article, idx) => (
            <div
              key={`first-${idx}`}
              className="flex-shrink-0 w-80 group relative flex flex-col bg-white/60 backdrop-blur-lg border border-yellow-100 rounded-2xl shadow-xl hover:shadow-2xl hover:border-yellow-300 transition-all duration-300 overflow-hidden"
            >
              {/* Gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-50 via-yellow-25 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none" />

              {/* Image */}
              <div className="relative h-44 w-full overflow-hidden">
                <Image
                  src={article.urlToImage}
                  alt={article.title}
                  fill
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-300"
                  sizes="320px"
                />
                <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-gray-700 px-3 py-1 rounded-full text-xs font-semibold shadow-lg border border-yellow-200">
                  {article.source.name}
                </span>
              </div>
              
              {/* Content */}
              <div className="relative z-10 flex-1 flex flex-col px-5 py-4">
                <h3 className="font-bold text-[#2C5282] text-base mb-2 overflow-hidden">
                  <span className="block overflow-hidden text-ellipsis" style={{
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical'
                  }}>
                    {article.title}
                  </span>
                </h3>
                <p className="text-gray-600 text-sm mb-4 flex-1 overflow-hidden" style={{
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical'
                }}>
                  {article.description}
                </p>
                <div className="flex items-center justify-between pt-3 border-t border-yellow-100 mt-auto">
                  <span className="text-xs text-gray-500 font-semibold">
                    {formatDate(article.publishedAt)}
                  </span>
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-yellow-300 hover:bg-yellow-400 text-[#2C5282] font-bold px-3 py-1 rounded-full text-xs shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer"
                  >
                    Read More →
                  </a>
                </div>
              </div>
              
              {/* Animated yellow blur */}
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-yellow-100 opacity-20 rounded-full blur-2xl pointer-events-none group-hover:opacity-40 transition-opacity duration-300" />
            </div>
          ))}
        </div>
      </motion.div>

      {/* Second Row - Right to Left Marquee */}
      <motion.div
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, delay: 0.4 }}
        className="relative z-10 overflow-hidden"
      >
        <div className="flex animate-marquee-right space-x-6 hover:pause-animation">
          {/* Duplicate articles for seamless loop */}
          {[...secondRowArticles, ...secondRowArticles].map((article, idx) => (
            <div
              key={`second-${idx}`}
              className="flex-shrink-0 w-80 group relative flex flex-col bg-white/60 backdrop-blur-lg border border-yellow-100 rounded-2xl shadow-xl hover:shadow-2xl hover:border-yellow-300 transition-all duration-300 overflow-hidden"
            >
              {/* Gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-50 via-yellow-25 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none" />

              {/* Image */}
              <div className="relative h-44 w-full overflow-hidden">
                <Image
                  src={article.urlToImage}
                  alt={article.title}
                  fill
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-300"
                  sizes="320px"
                />
                <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-gray-700 px-3 py-1 rounded-full text-xs font-semibold shadow-lg border border-yellow-200">
                  {article.source.name}
                </span>
              </div>
              
              {/* Content */}
              <div className="relative z-10 flex-1 flex flex-col px-5 py-4">
                <h3 className="font-bold text-[#2C5282] text-base mb-2 overflow-hidden">
                  <span className="block overflow-hidden text-ellipsis" style={{
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical'
                  }}>
                    {article.title}
                  </span>
                </h3>
                <p className="text-gray-600 text-sm mb-4 flex-1 overflow-hidden" style={{
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical'
                }}>
                  {article.description}
                </p>
                <div className="flex items-center justify-between pt-3 border-t border-yellow-100 mt-auto">
                  <span className="text-xs text-gray-500 font-semibold">
                    {formatDate(article.publishedAt)}
                  </span>
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-yellow-300 hover:bg-yellow-400 text-[#2C5282] font-bold px-3 py-1 rounded-full text-xs shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer"
                  >
                    Read More →
                  </a>
                </div>
              </div>
              
              {/* Animated yellow blur */}
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-yellow-100 opacity-20 rounded-full blur-2xl pointer-events-none group-hover:opacity-40 transition-opacity duration-300" />
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}