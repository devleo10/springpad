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

export function NewsPage() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Sample news data as fallback
  const sampleNews: NewsArticle[] = [
    {
      title: "Global Climate Summit Reaches Historic Agreement",
      description: "World leaders unite on ambitious climate goals for the next decade, marking a turning point in environmental policy.",
      url: "#",
      urlToImage: "https://images.pexels.com/photos/87651/earth-blue-planet-globe-planet-87651.jpeg",
      publishedAt: "2025-01-08T10:30:00Z",
      source: { name: "Global News" }
    },
    {
      title: "Revolutionary AI Breakthrough Changes Healthcare",
      description: "New artificial intelligence system demonstrates unprecedented accuracy in early disease detection.",
      url: "#",
      urlToImage: "https://images.pexels.com/photos/356040/pexels-photo-356040.jpeg",
      publishedAt: "2025-01-08T09:15:00Z",
      source: { name: "Tech Daily" }
    },
    {
      title: "Space Mission Discovers New Exoplanet",
      description: "Scientists confirm the existence of a potentially habitable planet just 40 light-years from Earth.",
      url: "#",
      urlToImage: "https://images.pexels.com/photos/2156/sky-earth-space-working.jpg",
      publishedAt: "2025-01-08T08:45:00Z",
      source: { name: "Space Explorer" }
    },
    {
      title: "Economic Markets Show Strong Recovery",
      description: "Global markets continue upward trend as consumer confidence reaches five-year high.",
      url: "#",
      urlToImage: "https://images.pexels.com/photos/159888/pexels-photo-159888.jpeg",
      publishedAt: "2025-01-08T07:30:00Z",
      source: { name: "Financial Times" }
    },
    {
      title: "Olympic Games Preparation Underway",
      description: "Athletes from around the world prepare for the upcoming games with innovative training methods.",
      url: "#",
      urlToImage: "https://images.pexels.com/photos/863988/pexels-photo-863988.jpeg",
      publishedAt: "2025-01-08T06:20:00Z",
      source: { name: "Sports World" }
    },
    {
      title: "Renewable Energy Milestone Achieved",
      description: "Solar and wind power now account for 60% of new electricity generation worldwide.",
      url: "#",
      urlToImage: "https://images.pexels.com/photos/9875454/pexels-photo-9875454.jpeg",
      publishedAt: "2025-01-08T05:10:00Z",
      source: { name: "Energy Today" }
    }
  ];

  useEffect(() => {
    const fetchNews = async () => {
      try {
        // Using NewsAPI - you'll need to get your own API key
        // For demo purposes, we'll use sample data
        setLoading(true);
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // In a real implementation, you would use:
        // const response = await fetch(`https://newsapi.org/v2/top-headlines?country=us&apiKey=YOUR_API_KEY`);
        // const data = await response.json();
        // setArticles(data.articles);
        
        // Using sample data for demonstration
        setArticles(sampleNews);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch news');
        setArticles(sampleNews); // Fallback to sample data
        setLoading(false);
      }
    };

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
          <h2 className="text-lg font-bold text-neutral-800 tracking-wide">Loading Latest News...</h2>
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
        className="relative z-20 text-center px-4"
      >
        <h1 className="text-3xl md:text-4xl font-bold text-neutral-800 mb-2">
          News Highlights
        </h1>
        <p className="text-gray-600 font-medium text-lg mb-6">
          Breaking News • Live Updates • Global Coverage
        </p>
      </motion.header>

      {/* News Grid */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="relative z-10 max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        {articles.map((article, idx) => (
          <motion.a
            key={idx}
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05, y: -8 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="group relative flex flex-col bg-white/60 backdrop-blur-lg border border-yellow-100 rounded-2xl shadow-xl hover:shadow-2xl hover:border-yellow-300 transition-all duration-300 overflow-hidden"
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
                sizes="(max-width: 768px) 100vw, 33vw"
                priority={idx < 4}
              />
              <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-gray-700 px-3 py-1 rounded-full text-xs font-semibold shadow-lg border border-yellow-200">
                {article.source.name}
              </span>
            </div>
            
            {/* Content */}
            <div className="relative z-10 flex-1 flex flex-col px-5 py-4">
              <h3 className="font-bold text-neutral-800 text-base md:text-lg mb-2 line-clamp-2">
                {article.title}
              </h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-1">
                {article.description}
              </p>
              <div className="flex items-center justify-between pt-3 border-t border-yellow-100 mt-auto">
                <span className="text-xs text-gray-500 font-semibold">
                  {formatDate(article.publishedAt)}
                </span>
                <span className="inline-block bg-yellow-300 hover:bg-yellow-400 text-neutral-800 font-bold px-3 py-1 rounded-full text-xs shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer">
                  Read More →
                </span>
              </div>
            </div>
            
            {/* Animated yellow blur */}
            <div className="absolute -top-4 -right-4 w-16 h-16 bg-yellow-100 opacity-20 rounded-full blur-2xl pointer-events-none group-hover:opacity-40 transition-opacity duration-300" />
          </motion.a>
        ))}
      </motion.div>
    </div>
  );
}