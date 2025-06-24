import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  PlayIcon, 
  InformationCircleIcon, 
  XMarkIcon,
  MagnifyingGlassIcon,
  BellIcon,
  UserIcon,
  ChatBubbleLeftRightIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
  PlusIcon,
  HandThumbUpIcon,
  HandThumbDownIcon,
  CheckIcon,
  AdjustmentsHorizontalIcon,
  StarIcon,
  ClockIcon,
  CalendarIcon,
  FilmIcon,
  TvIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  EyeIcon,
  ShareIcon,
  SpeakerXMarkIcon as MutedIcon,
  ChevronDownIcon,
  FunnelIcon
} from '@heroicons/react/24/solid';
import { useProfiles, useWatchlist, useSearch, useRating, useKeyboardNavigation } from './hooks';
import { utils } from './utils';

// Mock data for Netflix content
const mockContent = {
  featured: {
    id: 1,
    title: "Squid Game: Season 3",
    description: "The final season of the acclaimed Korean series continues Seong Gi-hun's quest to dismantle the deadly games. Prepare for the ultimate showdown in this gripping conclusion.",
    image: "https://images.pexels.com/photos/8421972/pexels-photo-8421972.jpeg",
    videoId: "2LuQ7uAfYrY", // Squid Game Season 3 trailer
    year: 2025,
    rating: "TV-MA",
    duration: "8 Episodes"
  },
  trending: [
    {
      id: 1,
      title: "Squid Game: Season 3",
      image: "https://images.pexels.com/photos/8421972/pexels-photo-8421972.jpeg",
      videoId: "2LuQ7uAfYrY"
    },
    {
      id: 2,
      title: "Ginny & Georgia: Season 3",
      image: "https://images.pexels.com/photos/7299488/pexels-photo-7299488.jpeg",
      videoId: "HiYDrR9rQWc"
    },
    {
      id: 3,
      title: "FUBAR: Season 2",
      image: "https://images.pexels.com/photos/32643635/pexels-photo-32643635.jpeg",
      videoId: "P-M6LLdp7jM"
    },
    {
      id: 4,
      title: "KPop Demon Hunters",
      image: "https://images.pexels.com/photos/3526022/pexels-photo-3526022.jpeg",
      videoId: "dQw4w9WgXcQ"
    },
    {
      id: 5,
      title: "The Waterfront",
      image: "https://images.pexels.com/photos/32658200/pexels-photo-32658200.jpeg",
      videoId: "ScMzIvxBSi4"
    },
    {
      id: 6,
      title: "Comedy Central",
      image: "https://images.pexels.com/photos/713149/pexels-photo-713149.jpeg",
      videoId: "YQHsXMglC9A"
    }
  ],
  myList: [
    {
      id: 7,
      title: "Documentary Series",
      image: "https://images.pexels.com/photos/275977/pexels-photo-275977.jpeg",
      videoId: "hFZFjoX2cGg"
    },
    {
      id: 8,
      title: "Netflix Originals",
      image: "https://images.pexels.com/photos/2659629/pexels-photo-2659629.jpeg",
      videoId: "P-M6LLdp7jM"
    }
  ],
  continueWatching: [
    {
      id: 9,
      title: "Action Thriller",
      image: "https://images.pexels.com/photos/32643635/pexels-photo-32643635.jpeg",
      videoId: "ScMzIvxBSi4",
      progress: 65
    }
  ]
};

// Header Component
export const Header = ({ onSearch, onProfileClick, onAIConciergeClick }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchQuery);
    setSearchVisible(false);
  };

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-500 ${
      isScrolled ? 'bg-netflix-black' : 'bg-gradient-to-b from-black/80 to-transparent'
    }`}>
      <div className="flex items-center justify-between px-4 lg:px-12 py-4">
        {/* Logo */}
        <div className="flex items-center space-x-8">
          <h1 className="text-netflix-red text-2xl lg:text-3xl font-bold">NETFLIX</h1>
          <nav className="hidden lg:flex space-x-6">
            <a href="#" className="text-white hover:text-gray-300 transition-colors">Home</a>
            <a href="#" className="text-gray-300 hover:text-white transition-colors">TV Shows</a>
            <a href="#" className="text-gray-300 hover:text-white transition-colors">Movies</a>
            <a href="#" className="text-gray-300 hover:text-white transition-colors">New & Popular</a>
            <a href="#" className="text-gray-300 hover:text-white transition-colors">My List</a>
          </nav>
        </div>

        {/* Right side controls */}
        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="relative">
            {searchVisible ? (
              <form onSubmit={handleSearch} className="flex items-center">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search movies, shows..."
                  className="bg-black/70 border border-white/30 text-white px-4 py-2 pr-10 rounded focus:outline-none focus:border-white"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setSearchVisible(false)}
                  className="absolute right-2 text-white hover:text-gray-300"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </form>
            ) : (
              <button
                onClick={() => setSearchVisible(true)}
                className="text-white hover:text-gray-300 transition-colors"
              >
                <MagnifyingGlassIcon className="w-6 h-6" />
              </button>
            )}
          </div>

          {/* AI Concierge */}
          <button
            onClick={onAIConciergeClick}
            className="text-white hover:text-netflix-red transition-colors p-2 rounded-full hover:bg-white/10"
            title="AI Concierge"
          >
            <ChatBubbleLeftRightIcon className="w-6 h-6" />
          </button>

          {/* Notifications */}
          <button className="text-white hover:text-gray-300 transition-colors">
            <BellIcon className="w-6 h-6" />
          </button>

          {/* Profile */}
          <button onClick={onProfileClick} className="w-8 h-8 bg-netflix-red rounded flex items-center justify-center hover:bg-red-700 transition-colors">
            <UserIcon className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
    </header>
  );
};

// Hero Section Component
export const HeroSection = ({ featured, onPlay, onMoreInfo }) => {
  const [isMuted, setIsMuted] = useState(true);

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${featured.image})` }}
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-netflix-black via-transparent to-transparent" />

      {/* Content */}
      <div className="relative z-10 flex items-center h-full px-4 lg:px-12">
        <div className="max-w-2xl space-y-6 fade-in">
          <h1 className="text-4xl lg:text-6xl font-bold text-white leading-tight">
            {featured.title}
          </h1>
          
          <div className="flex items-center space-x-4 text-sm lg:text-base">
            <span className="bg-red-600 text-white px-2 py-1 text-xs font-semibold">
              {featured.rating}
            </span>
            <span className="text-gray-300">{featured.year}</span>
            <span className="text-gray-300">{featured.duration}</span>
          </div>

          <p className="text-lg lg:text-xl text-gray-200 leading-relaxed max-w-xl">
            {featured.description}
          </p>

          <div className="flex space-x-4">
            <button
              onClick={() => onPlay(featured)}
              className="flex items-center space-x-2 bg-white text-black px-8 py-3 rounded font-semibold hover:bg-gray-200 transition-colors netflix-glow"
            >
              <PlayIcon className="w-6 h-6" />
              <span>Play</span>
            </button>
            
            <button
              onClick={() => onMoreInfo(featured)}
              className="flex items-center space-x-2 bg-gray-600/70 text-white px-8 py-3 rounded font-semibold hover:bg-gray-600/50 transition-colors"
            >
              <InformationCircleIcon className="w-6 h-6" />
              <span>More Info</span>
            </button>
          </div>
        </div>
      </div>

      {/* Audio Control */}
      <button
        onClick={() => setIsMuted(!isMuted)}
        className="absolute bottom-24 right-12 bg-black/50 text-white p-3 rounded-full hover:bg-black/70 transition-colors"
      >
        {isMuted ? <SpeakerXMarkIcon className="w-6 h-6" /> : <SpeakerWaveIcon className="w-6 h-6" />}
      </button>
    </div>
  );
};

// Content Row Component
export const ContentRow = ({ title, content, onItemClick, onItemHover }) => {
  const scrollRef = React.useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="px-4 lg:px-12 mb-8">
      <h2 className="text-white text-xl lg:text-2xl font-semibold mb-4">{title}</h2>
      
      <div className="relative group">
        <div
          ref={scrollRef}
          className="flex space-x-2 overflow-x-scroll content-row pb-4"
        >
          {content.map((item, index) => (
            <ContentCard
              key={item.id}
              item={item}
              index={index}
              onClick={onItemClick}
              onHover={onItemHover}
            />
          ))}
        </div>
        
        {/* Scroll Buttons */}
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 bg-black/80 text-white p-2 rounded-r opacity-0 group-hover:opacity-100 transition-opacity z-10"
        >
          ❮
        </button>
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 bg-black/80 text-white p-2 rounded-l opacity-0 group-hover:opacity-100 transition-opacity z-10"
        >
          ❯
        </button>
      </div>
    </div>
  );
};

// Content Card Component
export const ContentCard = ({ item, index, onClick, onHover }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="relative flex-shrink-0 w-64 h-36 cursor-pointer content-card"
      onMouseEnter={() => {
        setIsHovered(true);
        onHover && onHover(item);
      }}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onClick(item)}
    >
      <img
        src={item.image}
        alt={item.title}
        className="w-full h-full object-cover rounded"
      />
      
      {/* Progress bar for continue watching */}
      {item.progress && (
        <div className="absolute bottom-0 left-0 right-0 bg-gray-800 h-1">
          <div 
            className="bg-netflix-red h-full transition-all duration-300"
            style={{ width: `${item.progress}%` }}
          />
        </div>
      )}

      {/* Hover Overlay */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 rounded flex flex-col justify-center items-center text-white p-4"
          >
            <h3 className="text-lg font-semibold text-center mb-4">{item.title}</h3>
            <div className="flex space-x-2">
              <button className="bg-white text-black p-2 rounded-full hover:bg-gray-200 transition-colors">
                <PlayIcon className="w-4 h-4" />
              </button>
              <button className="border-2 border-gray-500 text-white p-2 rounded-full hover:border-white transition-colors">
                <PlusIcon className="w-4 h-4" />
              </button>
              <button className="border-2 border-gray-500 text-white p-2 rounded-full hover:border-white transition-colors">
                <HandThumbUpIcon className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Video Modal Component
export const VideoModal = ({ isOpen, onClose, content }) => {
  if (!isOpen || !content) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 modal-backdrop flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          className="relative bg-netflix-black rounded-lg overflow-hidden max-w-4xl w-full max-h-[80vh]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>

          {/* Video Player */}
          <div className="relative aspect-video">
            <iframe
              src={`https://www.youtube.com/embed/${content.videoId}?autoplay=1&controls=1&rel=0`}
              title={content.title}
              className="w-full h-full"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>

          {/* Content Info */}
          <div className="p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-white mb-2">{content.title}</h2>
                <div className="flex items-center space-x-4 text-sm text-gray-400 mb-4">
                  <span className="bg-green-600 text-white px-2 py-1 text-xs font-semibold rounded">
                    98% Match
                  </span>
                  <span>{content.year || '2025'}</span>
                  <span className="border border-gray-500 px-2 py-1 text-xs">HD</span>
                </div>
                <p className="text-gray-300 text-base leading-relaxed">
                  {content.description || "Experience premium streaming content with stunning visuals and compelling storytelling that keeps you on the edge of your seat."}
                </p>
              </div>
              <div className="flex space-x-2 ml-4">
                <button className="border-2 border-gray-500 text-white p-2 rounded-full hover:border-white transition-colors">
                  <PlusIcon className="w-5 h-5" />
                </button>
                <button className="border-2 border-gray-500 text-white p-2 rounded-full hover:border-white transition-colors">
                  <HandThumbUpIcon className="w-5 h-5" />
                </button>
                <button className="border-2 border-gray-500 text-white p-2 rounded-full hover:border-white transition-colors">
                  <HandThumbDownIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// AI Concierge Component
export const AIConcierge = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      text: "Hello! I'm your Netflix AI Concierge. I can help you discover amazing content, create immersive experiences, and guide you through your entertainment journey. What are you in the mood for today?",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const aiResponses = [
    "Based on your viewing history, I recommend checking out the new thriller series that just dropped. Would you like me to set up an immersive behind-the-scenes experience?",
    "I can create a personalized watch party for you and your friends! Which genre are you interested in exploring together?",
    "How about we dive into a virtual reality experience related to your favorite sci-fi shows? I can transport you to those worlds!",
    "I notice you enjoy documentaries. Would you like me to curate a mini-game experience based on historical events from your favorite docs?",
    "Let me suggest some location-based content. Are you interested in exploring places from your favorite travel shows virtually?"
  ];

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      text: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage = {
        id: messages.length + 2,
        type: 'ai',
        text: aiResponses[Math.floor(Math.random() * aiResponses.length)],
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 modal-backdrop flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 50 }}
          className="chat-bubble rounded-xl max-w-md w-full max-h-[80vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-netflix-red to-red-700 rounded-full flex items-center justify-center">
                <ChatBubbleLeftRightIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold">AI Concierge</h3>
                <p className="text-gray-400 text-xs">Your entertainment guide</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-96">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs p-3 rounded-lg ${
                    message.type === 'user'
                      ? 'bg-netflix-red text-white'
                      : 'bg-gray-700 text-gray-100'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-700 text-gray-100 max-w-xs p-3 rounded-lg">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <form onSubmit={handleSendMessage} className="p-4 border-t border-white/10">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask me anything about movies, shows, or experiences..."
                className="flex-1 bg-gray-800 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-netflix-red"
              />
              <button
                type="submit"
                className="bg-netflix-red text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Send
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// Search Results Component
export const SearchResults = ({ isOpen, onClose, query, results }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-40 bg-netflix-black pt-20"
      >
        <div className="px-4 lg:px-12 py-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-white text-3xl font-bold">
              Search results for "{query}"
            </h1>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-300 transition-colors"
            >
              <XMarkIcon className="w-8 h-8" />
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {results.map((item) => (
              <div key={item.id} className="cursor-pointer group">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-40 object-cover rounded group-hover:scale-105 transition-transform"
                />
                <h3 className="text-white text-sm mt-2 group-hover:text-gray-300">
                  {item.title}
                </h3>
              </div>
            ))}
          </div>

          {results.length === 0 && (
            <div className="text-center py-16">
              <p className="text-gray-400 text-xl">No results found for "{query}"</p>
              <p className="text-gray-500 mt-2">Try different keywords or browse our categories</p>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

// Export mock data for use in App.js
export { mockContent };