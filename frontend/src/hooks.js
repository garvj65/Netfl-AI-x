import { useState, useEffect, useCallback, useRef } from 'react';
import { tmdbAPI, profileManager, watchlistManager, historyManager, ratingManager, utils } from './utils';

// Custom hook for managing user profiles
export const useProfiles = () => {
  const [profiles, setProfiles] = useState([]);
  const [activeProfile, setActiveProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfiles = () => {
      const profilesData = profileManager.getProfiles();
      const activeProfileData = profileManager.getActiveProfile();
      setProfiles(profilesData);
      setActiveProfile(activeProfileData);
      setLoading(false);
    };

    loadProfiles();
  }, []);

  const switchProfile = useCallback((profileId) => {
    profileManager.setActiveProfile(profileId);
    const newActiveProfile = profileManager.getActiveProfile();
    setActiveProfile(newActiveProfile);
  }, []);

  const createProfile = useCallback((profileData) => {
    const newProfile = profileManager.createProfile(profileData);
    setProfiles(profileManager.getProfiles());
    return newProfile;
  }, []);

  const updateProfile = useCallback((profileId, updates) => {
    const updatedProfile = profileManager.updateProfile(profileId, updates);
    setProfiles(profileManager.getProfiles());
    if (activeProfile && activeProfile.id === profileId) {
      setActiveProfile(updatedProfile);
    }
    return updatedProfile;
  }, [activeProfile]);

  const deleteProfile = useCallback((profileId) => {
    profileManager.deleteProfile(profileId);
    setProfiles(profileManager.getProfiles());
    const newActiveProfile = profileManager.getActiveProfile();
    setActiveProfile(newActiveProfile);
  }, []);

  return {
    profiles,
    activeProfile,
    loading,
    switchProfile,
    createProfile,
    updateProfile,
    deleteProfile
  };
};

// Custom hook for content management
export const useContent = () => {
  const [content, setContent] = useState({
    trending: [],
    movies: [],
    tvShows: [],
    featured: null
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadContent = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [trending, movies, tvShows] = await Promise.all([
        tmdbAPI.fetchTrending(),
        tmdbAPI.fetchMovies('popular'),
        tmdbAPI.fetchTVShows('popular')
      ]);

      // Select featured content from trending
      const featured = trending[0] || null;
      if (featured) {
        // Get detailed info for featured content
        const detailedFeatured = await tmdbAPI.getContentDetails(featured.id, featured.mediaType);
        featured.description = detailedFeatured?.description || featured.description;
        featured.videoId = detailedFeatured?.videoId;
        featured.cast = detailedFeatured?.cast || [];
        featured.genres = detailedFeatured?.genres || [];
      }

      setContent({
        trending,
        movies,
        tvShows,
        featured
      });
    } catch (err) {
      console.error('Error loading content:', err);
      setError('Failed to load content. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadContent();
  }, [loadContent]);

  const refreshContent = useCallback(() => {
    loadContent();
  }, [loadContent]);

  return {
    content,
    loading,
    error,
    refreshContent
  };
};

// Custom hook for watchlist management
export const useWatchlist = (profileId) => {
  const [myList, setMyList] = useState([]);
  const [continueWatching, setContinueWatching] = useState([]);

  useEffect(() => {
    if (profileId) {
      const list = watchlistManager.getMyList(profileId);
      const continuing = historyManager.getContinueWatching(profileId);
      setMyList(list);
      setContinueWatching(continuing);
    }
  }, [profileId]);

  const addToMyList = useCallback((content) => {
    if (profileId) {
      watchlistManager.addToMyList(profileId, content);
      setMyList(watchlistManager.getMyList(profileId));
    }
  }, [profileId]);

  const removeFromMyList = useCallback((contentId) => {
    if (profileId) {
      watchlistManager.removeFromMyList(profileId, contentId);
      setMyList(watchlistManager.getMyList(profileId));
    }
  }, [profileId]);

  const isInMyList = useCallback((contentId) => {
    return profileId ? watchlistManager.isInMyList(profileId, contentId) : false;
  }, [profileId]);

  const addToHistory = useCallback((content, progress = 0) => {
    if (profileId) {
      historyManager.addToHistory(profileId, content, progress);
      setContinueWatching(historyManager.getContinueWatching(profileId));
    }
  }, [profileId]);

  return {
    myList,
    continueWatching,
    addToMyList,
    removeFromMyList,
    isInMyList,
    addToHistory
  };
};

// Custom hook for content search
export const useSearch = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const debouncedSearch = useCallback(
    utils.debounce(async (query) => {
      if (!query.trim()) {
        setSearchResults([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const results = await tmdbAPI.searchContent(query);
        setSearchResults(results);
      } catch (err) {
        console.error('Search error:', err);
        setError('Search failed. Please try again.');
        setSearchResults([]);
      } finally {
        setLoading(false);
      }
    }, 300),
    []
  );

  const search = useCallback((query) => {
    setSearchQuery(query);
    debouncedSearch(query);
  }, [debouncedSearch]);

  const clearSearch = useCallback(() => {
    setSearchQuery('');
    setSearchResults([]);
    setError(null);
  }, []);

  return {
    searchResults,
    searchQuery,
    loading,
    error,
    search,
    clearSearch
  };
};

// Custom hook for content rating
export const useRating = (profileId) => {
  const [ratings, setRatings] = useState({});

  useEffect(() => {
    if (profileId) {
      const userRatings = ratingManager.getRatings(profileId);
      setRatings(userRatings);
    }
  }, [profileId]);

  const setRating = useCallback((contentId, rating) => {
    if (profileId) {
      ratingManager.setRating(profileId, contentId, rating);
      const updatedRatings = ratingManager.getRatings(profileId);
      setRatings(updatedRatings);
    }
  }, [profileId]);

  const getRating = useCallback((contentId) => {
    return ratings[contentId]?.rating || null;
  }, [ratings]);

  return {
    setRating,
    getRating
  };
};

// Custom hook for keyboard navigation
export const useKeyboardNavigation = (onClose, onAction) => {
  useEffect(() => {
    const handleKeyDown = (event) => {
      switch (event.key) {
        case 'Escape':
          if (onClose) onClose();
          break;
        case 'Enter':
          if (onAction) onAction();
          break;
        case 'ArrowLeft':
        case 'ArrowRight':
        case 'ArrowUp':
        case 'ArrowDown':
          // Handle arrow key navigation
          event.preventDefault();
          break;
        default:
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onAction]);
};

// Custom hook for intersection observer (lazy loading)
export const useIntersectionObserver = (callback, options = {}) => {
  const targetRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(callback, {
      threshold: 0.1,
      rootMargin: '50px',
      ...options
    });

    const current = targetRef.current;
    if (current) {
      observer.observe(current);
    }

    return () => {
      if (current) {
        observer.unobserve(current);
      }
    };
  }, [callback, options]);

  return targetRef;
};

// Custom hook for local storage
export const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = useCallback((value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  const removeValue = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
};