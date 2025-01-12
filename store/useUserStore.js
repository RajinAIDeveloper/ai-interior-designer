import { create } from 'zustand';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const log = (message, data = '') => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${message}`, data);
};

// Toast control to prevent duplicate messages
const toastControl = {
  lastToast: null,
  lastToastTime: 0,
  showToast: (message, type = 'error') => {
    const now = Date.now();
    // Prevent duplicate toasts within 2 seconds
    if (toastControl.lastToast === message && now - toastControl.lastToastTime < 2000) {
      return;
    }
    toastControl.lastToast = message;
    toastControl.lastToastTime = now;
    
    if (type === 'error') {
      toast.error(message);
    } else if (type === 'success') {
      toast.success(message);
    }
  }
};

const useUserStore = create((set, get) => ({
  userDetail: null,
  isLoading: false,
  error: null,
  lastVerified: null,
  isVerifying: false, // New flag to prevent concurrent verifications

  verifyUser: async (user) => {
    // Get current state
    const state = get();
    
    // Prevent concurrent verifications
    if (state.isVerifying) {
      log('🔄 Verification already in progress, skipping');
      return;
    }

    log('Starting user verification for:', {
      fullName: user?.fullName,
      email: user?.emailAddresses?.[0]?.emailAddress
    });

    // Validate user data
    if (!user?.emailAddresses?.[0]?.emailAddress || !user?.fullName) {
      const error = 'Invalid user data provided';
      log('❌ Validation failed:', { error });
      set({ error });
      toast.error(error);
      return;
    }

    // Prevent multiple rapid verifications
    const now = Date.now();
    if (state.lastVerified && (now - state.lastVerified < 1000)) {
      log('🔄 Skipping verification - too soon');
      return;
    }

    set({ isLoading: true, error: null, isVerifying: true });
    log('Setting loading state...');

    try {
      // Prepare user data
      const userData = {
        user: {
          name: user.fullName,
          email: user.emailAddresses[0].emailAddress,
          imageUrl: user.imageUrl || user.profileImageUrl,
        }
      };
      log('📝 Prepared user data:', userData);

      // Try to fetch existing user first
      try {
        log('🔍 Checking if user exists...');
        const verifyResponse = await axios.post('/api/verify-user', userData);
        
        if (verifyResponse.data?.result) {
          log('✅ Existing user found:', verifyResponse.data.result);
          set({
            userDetail: verifyResponse.data.result,
            isLoading: false,
            error: null,
            lastVerified: now,
            isVerifying: false
          });
          return;
        }
      } catch (verifyError) {
        // Only proceed to create if we get a 404
        if (verifyError.response?.status !== 404) {
          throw verifyError;
        }
        
        log('User not found, proceeding to creation');
      }

      // Attempt to create new user
      log('👤 Creating new user...');
      const createResponse = await axios.post('/api/add-user-to-db', userData);

      // Handle potential race condition where user was created between verify and create
      if (createResponse.response?.status === 409) {
        log('User already exists, retrying verification...');
        const retryResponse = await axios.post('/api/verify-user', userData);
        
        if (retryResponse.data?.result) {
          set({
            userDetail: retryResponse.data.result,
            isLoading: false,
            error: null,
            lastVerified: now,
            isVerifying: false
          });
          return;
        }
        throw new Error('Failed to retrieve existing user');
      }

      if (!createResponse.data?.result) {
        throw new Error('Failed to create user account');
      }

      log('✅ New user created successfully');
      set({
        userDetail: createResponse.data.result,
        isLoading: false,
        error: null,
        lastVerified: now,
        isVerifying: false
      });
      toast.success('Account created successfully!');

    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message || 'Failed to manage user';
      log('❌ Error in user management:', {
        message: errorMessage,
        response: error.response?.data,
        status: error.response?.status
      });
      
      set({
        error: errorMessage,
        isLoading: false,
        userDetail: null,
        isVerifying: false
      });
      
      toast.error(errorMessage);
    }
  },

  getCredits: () => {
    const credits = get().userDetail?.credits ?? 0;
    log('📊 Getting credits:', credits);
    return credits;
  },

  hasEnoughCredits: () => {
    const hasEnough = (get().userDetail?.credits ?? 0) > 0;
    log('💳 Checking credits:', { 
      current: get().userDetail?.credits,
      hasEnough 
    });
    return hasEnough;
  },

  updateCredits: async () => {
    const state = get();
    
    // User validation
    if (!state.userDetail?.id) {
      const error = 'User not logged in';
      log('❌ Cannot update credits:', error);
      toastControl.showToast('Please log in to update credits', 'error');
      return false;
    }

    // Credit validation
    if (state.userDetail.credits < 1) {
      const error = 'Insufficient credits';
      log('❌ Cannot update credits:', error);
      toastControl.showToast(error, 'error');
      return false;
    }

    try {
      const response = await axios.post('/api/deduct-credits', {
        userId: state.userDetail.id,
        currentCredits: state.userDetail.credits
      });

      if (!response.data?.success) {
        throw new Error(response.data?.error || 'Failed to update credits');
      }

      // Update local state with the value returned from the server
      set(state => ({
        userDetail: {
          ...state.userDetail,
          credits: response.data.updatedCredits
        }
      }));

      log('✅ Credits updated successfully:', response.data.updatedCredits);
      return true;

    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message || 'Failed to update credits';
      log('❌ Error updating credits:', errorMessage);
      toastControl.showToast(errorMessage, 'error');
      return false;
    }
  },

  
  
  clearUser: () => {
    log('🧹 Clearing user state');
    set({
      userDetail: null,
      error: null,
      isLoading: false,
      lastVerified: null,
      isVerifying: false
    });
    log('User state cleared');
  }
}));

// Development logging
if (process.env.NODE_ENV === 'development') {
  useUserStore.subscribe((state) => {
    log('🔄 Store state updated:', {
      userDetail: state.userDetail ? {
        id: state.userDetail.id,
        email: state.userDetail.email,
        credits: state.userDetail.credits,
        name: state.userDetail.name
      } : null,
      isLoading: state.isLoading,
      error: state.error,
      isVerifying: state.isVerifying
    });
  });
}

export default useUserStore;