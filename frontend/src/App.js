import React, { useState, useEffect } from 'react';
import './App.css';
import {
  Header,
  HeroSection,
  ContentRow,
  VideoModal,
  AIConcierge,
  SearchResults,
  mockContent
} from './components';

function App() {
  const [selectedContent, setSelectedContent] = useState(null);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [showAIConcierge, setShowAIConcierge] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // Handle content item click
  const handleContentClick = (content) => {
    setSelectedContent(content);
    setShowVideoModal(true);
  };

  // Handle more info click
  const handleMoreInfo = (content) => {
    setSelectedContent(content);
    setShowVideoModal(true);
  };

  // Handle play click
  const handlePlay = (content) => {
    setSelectedContent(content);
    setShowVideoModal(true);
  };

  // Handle search
  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim()) {
      // Mock search results - in real app this would be API call
      const allContent = [
        ...mockContent.trending,
        ...mockContent.myList,
        ...mockContent.continueWatching
      ];
      const results = allContent.filter(item =>
        item.title.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(results);
      setShowSearch(true);
    }
  };

  // Handle content hover (for future enhancements)
  const handleContentHover = (content) => {
    // Could be used for preview functionality
    console.log('Hovering over:', content.title);
  };

  // Loading screen
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-netflix-black">
        <div className="text-center">
          <div className="text-6xl font-bold text-netflix-red mb-4 animate-pulse">
            NETFLIX
          </div>
          <div className="flex space-x-2 justify-center">
            <div className="w-3 h-3 bg-netflix-red rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-netflix-red rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-3 h-3 bg-netflix-red rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="App bg-netflix-black min-h-screen">
      {/* Header */}
      <Header
        onSearch={handleSearch}
        onProfileClick={() => console.log('Profile clicked')}
        onAIConciergeClick={() => setShowAIConcierge(true)}
      />

      {/* Main Content */}
      {!showSearch && (
        <>
          {/* Hero Section */}
          <HeroSection
            featured={mockContent.featured}
            onPlay={handlePlay}
            onMoreInfo={handleMoreInfo}
          />

          {/* Content Rows */}
          <main className="relative z-10 -mt-32">
            <ContentRow
              title="Trending Now"
              content={mockContent.trending}
              onItemClick={handleContentClick}
              onItemHover={handleContentHover}
            />

            <ContentRow
              title="My List"
              content={mockContent.myList}
              onItemClick={handleContentClick}
              onItemHover={handleContentHover}
            />

            <ContentRow
              title="Continue Watching"
              content={mockContent.continueWatching}
              onItemClick={handleContentClick}
              onItemHover={handleContentHover}
            />

            <ContentRow
              title="Popular on Netflix"
              content={[...mockContent.trending].reverse()}
              onItemClick={handleContentClick}
              onItemHover={handleContentHover}
            />

            <ContentRow
              title="New Releases"
              content={mockContent.trending.slice(2)}
              onItemClick={handleContentClick}
              onItemHover={handleContentHover}
            />

            <ContentRow
              title="Because you watched Squid Game"
              content={[...mockContent.trending, ...mockContent.myList]}
              onItemClick={handleContentClick}
              onItemHover={handleContentHover}
            />
          </main>

          {/* Footer */}
          <footer className="bg-netflix-black text-gray-400 px-4 lg:px-12 py-16 mt-16">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
                <div className="space-y-3">
                  <a href="#" className="block hover:text-white transition-colors">Audio Description</a>
                  <a href="#" className="block hover:text-white transition-colors">Help Center</a>
                  <a href="#" className="block hover:text-white transition-colors">Gift Cards</a>
                  <a href="#" className="block hover:text-white transition-colors">Media Center</a>
                </div>
                <div className="space-y-3">
                  <a href="#" className="block hover:text-white transition-colors">Investor Relations</a>
                  <a href="#" className="block hover:text-white transition-colors">Jobs</a>
                  <a href="#" className="block hover:text-white transition-colors">Terms of Use</a>
                  <a href="#" className="block hover:text-white transition-colors">Privacy</a>
                </div>
                <div className="space-y-3">
                  <a href="#" className="block hover:text-white transition-colors">Legal Notices</a>
                  <a href="#" className="block hover:text-white transition-colors">Cookie Preferences</a>
                  <a href="#" className="block hover:text-white transition-colors">Corporate Information</a>
                  <a href="#" className="block hover:text-white transition-colors">Contact Us</a>
                </div>
                <div className="space-y-3">
                  <a href="#" className="block hover:text-white transition-colors">Speed Test</a>
                  <a href="#" className="block hover:text-white transition-colors">Only on Netflix</a>
                  <a href="#" className="block hover:text-white transition-colors">AI Concierge</a>
                  <a href="#" className="block hover:text-white transition-colors">VR Experiences</a>
                </div>
              </div>
              
              <div className="border-t border-gray-600 pt-8">
                <p className="text-sm">&copy; 2025 Netflix Clone. This is a demo application showcasing modern web development.</p>
                <p className="text-xs mt-2 text-gray-500">
                  Built with React, TailwindCSS, and powered by AI concierge technology.
                </p>
              </div>
            </div>
          </footer>
        </>
      )}

      {/* Search Results */}
      <SearchResults
        isOpen={showSearch}
        onClose={() => setShowSearch(false)}
        query={searchQuery}
        results={searchResults}
      />

      {/* Video Modal */}
      <VideoModal
        isOpen={showVideoModal}
        onClose={() => setShowVideoModal(false)}
        content={selectedContent}
      />

      {/* AI Concierge */}
      <AIConcierge
        isOpen={showAIConcierge}
        onClose={() => setShowAIConcierge(false)}
      />
    </div>
  );
}

export default App;