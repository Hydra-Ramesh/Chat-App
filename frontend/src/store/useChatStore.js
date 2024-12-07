import { create } from 'zustand';
import toast from 'react-hot-toast';
import { axiosInstance } from '../lib/axios.js';

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get('/messages/users');
      set({ users: res.data });
    } catch (e) {
      console.error('Failed to get users:', e);
      toast.error(e.response?.data?.message || 'An error occurred');
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });  // Correctly updating messages
    } catch (e) {
      console.error('Failed to get messages:', e);
      toast.error(e.response?.data?.message || 'An error occurred');
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get(); // Correctly getting messages
    try {
      const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
      set({ messages: [...messages, res.data] });  // Correctly updating the state with the new message
    } catch (e) {
      console.error('Failed to send message:', e);
      toast.error(e.response?.data?.message || 'An error occurred');
    }
  },

  setSelectedUser: (userId) => {
    set({ selectedUser: userId });
  },
}));
