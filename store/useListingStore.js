// useListingStore.js
import { create } from 'zustand';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const useListingStore = create((set) => ({
  listings: [],
  isLoading: false,
  error: null,

  fetchListings: async (email) => {
    if (!email) return;

    set({ isLoading: true });

    try {
      const response = await axios.get('/api/rooms', {
        params: { email },
        headers: { 'Accept': 'application/json' },
        cache: 'no-store'
      });
      
      set({
        listings: response.data,
        isLoading: false,
        error: null
      });
    } catch (error) {
      const message = error.response?.data?.error || 'Failed to fetch listings';
      set({
        error: message,
        isLoading: false
      });
      toast.error(message);
    }
  },

  addListing: async (listingData) => {
    try {
      const response = await axios.post('/api/rooms', listingData);
      set(state => ({
        listings: [...state.listings, response.data]
      }));
      toast.success('Room created successfully!');
      return response.data;
    } catch (error) {
      toast.error('Failed to add room');
      return null;
    }
  },

  updateListing: async (id, listingData) => {
    try {
      const response = await axios.put(`/api/rooms/${id}`, listingData);
      set(state => ({
        listings: state.listings.map(listing => 
          (listing._id === id || listing.id === id) ? response.data : listing
        )
      }));
      toast.success('Room updated successfully!');
      return response.data;
    } catch (error) {
      toast.error('Failed to update room');
      return null;
    }
  },

  deleteListing: async (id) => {
    try {
      await axios.delete(`/api/rooms/${id}`);
      set(state => ({
        listings: state.listings.filter(listing => 
          listing._id !== id && listing.id !== id
        )
      }));
      toast.success('Room deleted successfully!');
      return true;
    } catch (error) {
      toast.error('Failed to delete room');
      return false;
    }
  }
}));

export default useListingStore;