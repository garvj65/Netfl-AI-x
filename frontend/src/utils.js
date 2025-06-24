// Utility functions for Netflix clone

// TMDB API configuration
const TMDB_API_KEY = process.env.REACT_APP_TMDB_API_KEY || 'c8dea14dc917687ac631a52620e4f7ad';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

// Local storage keys
export const STORAGE_KEYS = {
  USER_PROFILES: 'netflix_user_profiles',
  ACTIVE_PROFILE: 'netflix_active_profile',
  MY_LIST: 'netflix_my_list',
  WATCH_HISTORY: 'netflix_watch_history',
  USER_PREFERENCES: 'netflix_user_preferences'
};

// TMDB API functions
export const tmdbAPI = {
  async fetchTrending() {
    try {
      const response = await fetch(`${TMDB_BASE_URL}/trending/all/day?api_key=${TMDB_API_KEY}`);
      const data = await response.json();
      return data.results.map(item => this.transformTMDBItem(item));
    } catch (error) {
      console.error('Error fetching trending:', error);
      return [];
    }
  },

  async fetchMovies(category = 'popular') {
    try {
      const response = await fetch(`${TMDB_BASE_URL}/movie/${category}?api_key=${TMDB_API_KEY}`);
      const data = await response.json();
      return data.results.map(item => this.transformTMDBItem(item));
    } catch (error) {
      console.error('Error fetching movies:', error);
      return [];
    }
  },

  async fetchTVShows(category = 'popular') {
    try {
      const response = await fetch(`${TMDB_BASE_URL}/tv/${category}?api_key=${TMDB_API_KEY}`);
      const data = await response.json();
      return data.results.map(item => this.transformTMDBItem(item));
    } catch (error) {
      console.error('Error fetching TV shows:', error);
      return [];
    }
  },

  async searchContent(query) {
    try {
      const response = await fetch(`${TMDB_BASE_URL}/search/multi?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}`);
      const data = await response.json();
      return data.results.map(item => this.transformTMDBItem(item));
    } catch (error) {
      console.error('Error searching content:', error);
      return [];
    }
  },

  async getContentDetails(id, type = 'movie') {
    try {
      const response = await fetch(`${TMDB_BASE_URL}/${type}/${id}?api_key=${TMDB_API_KEY}&append_to_response=videos,credits,similar`);
      const data = await response.json();
      return this.transformDetailedItem(data);
    } catch (error) {
      console.error('Error fetching content details:', error);
      return null;
    }
  },

  transformTMDBItem(item) {
    return {
      id: item.id,
      title: item.title || item.name,
      originalTitle: item.original_title || item.original_name,
      description: item.overview,
      image: item.poster_path ? `${TMDB_IMAGE_BASE_URL}${item.poster_path}` : null,
      backdropImage: item.backdrop_path ? `https://image.tmdb.org/t/p/w1280${item.backdrop_path}` : null,
      rating: item.vote_average,
      year: item.release_date ? new Date(item.release_date).getFullYear() : (item.first_air_date ? new Date(item.first_air_date).getFullYear() : 2025),
      mediaType: item.media_type || (item.title ? 'movie' : 'tv'),
      adult: item.adult,
      popularity: item.popularity,
      genreIds: item.genre_ids || []
    };
  },

  transformDetailedItem(item) {
    const trailer = item.videos?.results?.find(video => video.type === 'Trailer' && video.site === 'YouTube');
    return {
      ...this.transformTMDBItem(item),
      runtime: item.runtime || item.episode_run_time?.[0],
      genres: item.genres || [],
      cast: item.credits?.cast?.slice(0, 10) || [],
      crew: item.credits?.crew?.slice(0, 5) || [],
      similar: item.similar?.results?.slice(0, 12).map(i => this.transformTMDBItem(i)) || [],
      videoId: trailer?.key,
      videos: item.videos?.results || [],
      productionCompanies: item.production_companies || [],
      spokenLanguages: item.spoken_languages || [],
      status: item.status,
      tagline: item.tagline
    };
  }
};

// User profile management
export const profileManager = {
  getProfiles() {
    const profiles = localStorage.getItem(STORAGE_KEYS.USER_PROFILES);
    return profiles ? JSON.parse(profiles) : this.getDefaultProfiles();
  },

  getDefaultProfiles() {
    return [
      {
        id: 1,
        name: 'You',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde',
        isKid: false,
        preferences: {
          genres: [],
          languages: ['en'],
          maturityRating: 'all'
        }
      },
      {
        id: 2,
        name: 'Kids',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80',
        isKid: true,
        preferences: {
          genres: ['animation', 'family'],
          languages: ['en'],
          maturityRating: 'kids'
        }
      }
    ];
  },

  saveProfiles(profiles) {
    localStorage.setItem(STORAGE_KEYS.USER_PROFILES, JSON.stringify(profiles));
  },

  getActiveProfile() {
    const activeId = localStorage.getItem(STORAGE_KEYS.ACTIVE_PROFILE);
    const profiles = this.getProfiles();
    return profiles.find(p => p.id === parseInt(activeId)) || profiles[0];
  },

  setActiveProfile(profileId) {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_PROFILE, profileId.toString());
  },

  createProfile(profileData) {
    const profiles = this.getProfiles();
    const newProfile = {
      id: Date.now(),
      ...profileData,
      preferences: {
        genres: [],
        languages: ['en'],
        maturityRating: profileData.isKid ? 'kids' : 'all',
        ...profileData.preferences
      }
    };
    profiles.push(newProfile);
    this.saveProfiles(profiles);
    return newProfile;
  },

  updateProfile(profileId, updates) {
    const profiles = this.getProfiles();
    const index = profiles.findIndex(p => p.id === profileId);
    if (index !== -1) {
      profiles[index] = { ...profiles[index], ...updates };
      this.saveProfiles(profiles);
      return profiles[index];
    }
    return null;
  },

  deleteProfile(profileId) {
    const profiles = this.getProfiles();
    const filtered = profiles.filter(p => p.id !== profileId);
    this.saveProfiles(filtered);
    
    // If deleting active profile, switch to first available
    const activeProfile = this.getActiveProfile();
    if (activeProfile.id === profileId && filtered.length > 0) {
      this.setActiveProfile(filtered[0].id);
    }
  }
};

// Watchlist management
export const watchlistManager = {
  getMyList(profileId) {
    const myList = localStorage.getItem(`${STORAGE_KEYS.MY_LIST}_${profileId}`);
    return myList ? JSON.parse(myList) : [];
  },

  addToMyList(profileId, content) {
    const myList = this.getMyList(profileId);
    if (!myList.find(item => item.id === content.id)) {
      myList.push({ ...content, addedAt: new Date().toISOString() });
      localStorage.setItem(`${STORAGE_KEYS.MY_LIST}_${profileId}`, JSON.stringify(myList));
    }
  },

  removeFromMyList(profileId, contentId) {
    const myList = this.getMyList(profileId);
    const filtered = myList.filter(item => item.id !== contentId);
    localStorage.setItem(`${STORAGE_KEYS.MY_LIST}_${profileId}`, JSON.stringify(filtered));
  },

  isInMyList(profileId, contentId) {
    const myList = this.getMyList(profileId);
    return myList.some(item => item.id === contentId);
  }
};

// Watch history management
export const historyManager = {
  getWatchHistory(profileId) {
    const history = localStorage.getItem(`${STORAGE_KEYS.WATCH_HISTORY}_${profileId}`);
    return history ? JSON.parse(history) : [];
  },

  addToHistory(profileId, content, progress = 0) {
    const history = this.getWatchHistory(profileId);
    const existingIndex = history.findIndex(item => item.id === content.id);
    
    const historyItem = {
      ...content,
      watchedAt: new Date().toISOString(),
      progress: progress
    };

    if (existingIndex !== -1) {
      history[existingIndex] = historyItem;
    } else {
      history.unshift(historyItem);
    }

    // Keep only last 50 items
    if (history.length > 50) {
      history.splice(50);
    }

    localStorage.setItem(`${STORAGE_KEYS.WATCH_HISTORY}_${profileId}`, JSON.stringify(history));
  },

  getContinueWatching(profileId) {
    const history = this.getWatchHistory(profileId);
    return history.filter(item => item.progress > 5 && item.progress < 95).slice(0, 20);
  }
};

// Content rating and preferences
export const ratingManager = {
  getRatings(profileId) {
    const ratings = localStorage.getItem(`netflix_ratings_${profileId}`);
    return ratings ? JSON.parse(ratings) : {};
  },

  setRating(profileId, contentId, rating) {
    const ratings = this.getRatings(profileId);
    ratings[contentId] = {
      rating: rating, // 'up', 'down', or null
      ratedAt: new Date().toISOString()
    };
    localStorage.setItem(`netflix_ratings_${profileId}`, JSON.stringify(ratings));
  },

  getRating(profileId, contentId) {
    const ratings = this.getRatings(profileId);
    return ratings[contentId]?.rating || null;
  }
};

// Utility functions
export const utils = {
  formatDuration(minutes) {
    if (!minutes) return '';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  },

  formatYear(dateString) {
    if (!dateString) return '';
    return new Date(dateString).getFullYear();
  },

  getMaturityRating(voteAverage, adult) {
    if (adult) return 'R';
    if (voteAverage >= 8) return 'PG-13';
    if (voteAverage >= 6) return 'PG';
    return 'G';
  },

  truncateText(text, maxLength = 150) {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
  },

  debounce(func, delay) {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(null, args), delay);
    };
  },

  generateRandomId() {
    return Math.random().toString(36).substr(2, 9);
  },

  formatViewTime(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minutes ago`;
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
      const days = Math.floor(diffInMinutes / 1440);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    }
  }
};