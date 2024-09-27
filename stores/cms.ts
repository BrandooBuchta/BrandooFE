import { create } from "zustand";
import { toast } from "react-toastify";
import { Dispatch, SetStateAction } from "react";

import { api } from "@/utils/api";
import { ContentRootLight, Content } from "@/interfaces/content";

interface ContentState {
  contents: ContentRootLight[];

  fetchRootContentById: (contentId: string) => Promise<Content | undefined>;
  createRootContent: (userId: string) => Promise<void>;
  updateRootContent: (contentId: string, alias?: string) => Promise<void>;
  deleteRootContent: (contentId: string) => Promise<void>;
  fetchContentsByUserId: (userId: string) => Promise<void>;
  updateContent: (
    contentId: string,
    updatedContent: Partial<Content>,
  ) => Promise<void>;
  getContent: (
    contentId: string,
    setter: Dispatch<SetStateAction<Content | null>>,
  ) => Promise<void>;
  createProperty: (contentId: string, rootId: string) => Promise<void>;
  updatePropertyKey: (propertyId: string, key: string) => Promise<void>;
  deleteProperty: (contentId: string, propertyId: string) => Promise<void>;
  createListItem: (contentId: string) => Promise<void>;
  createListItemProperty: (
    contentId: string,
    idx: number,
    rootId: string,
  ) => Promise<void>;
  deleteItemFromListItemContent: (
    contentId: string,
    index: number,
  ) => Promise<void>;
  reorderListItem: (contentId: string, newOrder: number[]) => Promise<void>;
}

const useContentStore = create<ContentState>((set) => ({
  contents: [],
  fetchRootContentById: async (contentId) => {
    try {
      const { data } = await api.get<Content>(`contents/root/${contentId}`);

      return data;
    } catch (error) {
      toast.error(`Error fetching content: ${error}`);

      return undefined;
    }
  },

  createRootContent: async (userId) => {
    try {
      await api.post(`contents/root/${userId}`);
      toast.success("Root content created successfully");
    } catch (error) {
      toast.error(`Error creating root content: ${error}`);
    }
  },

  updateRootContent: async (contentId, alias) => {
    try {
      await api.put(`contents/root/${contentId}?alias=${alias}`);
      toast.success("Root content updated successfully");
    } catch (error) {
      toast.error(`Error updating root content: ${error}`);
    }
  },

  deleteRootContent: async (contentId) => {
    try {
      await api.delete(`contents/root/${contentId}`);
      toast.success("Root content deleted successfully");
    } catch (error) {
      toast.error(`Error deleting root content: ${error}`);
    }
  },

  fetchContentsByUserId: async (userId) => {
    try {
      const { data } = await api.get<ContentRootLight[]>(
        `contents/root/users/${userId}`,
      );

      set(() => ({
        contents: data,
      }));
    } catch (error) {
      toast.error(`Error fetching user contents: ${error}`);
    }
  },

  updateContent: async (contentId, updatedContent) => {
    try {
      const { data } = await api.put(`contents/${contentId}`, {
        ...updatedContent,
      });
    } catch (error) {
      toast.error(`Error fetching user contents: ${error}`);
    }
  },

  getContent: async (contentId, setter) => {
    try {
      const { data } = await api.get(`contents/${contentId}`);

      setter(data);
    } catch (error) {
      toast.error(`Error fetching user contents: ${error}`);
    }
  },

  createProperty: async (contentId, rootId) => {
    try {
      await api.post(`contents/property/${contentId}/${rootId}`);
    } catch (error) {
      toast.error(`Error fetching user contents: ${error}`);
    }
  },

  updatePropertyKey: async (propertyId, key) => {
    try {
      await api.put(`contents/property/${propertyId}?key=${key}`);
    } catch (error) {
      toast.error(`Error fetching user contents: ${error}`);
    }
  },

  deleteProperty: async (contentId, propertyId) => {
    try {
      await api.delete(`contents/${contentId}/property/${propertyId}`);
    } catch (error) {
      toast.error(`Error fetching user contents: ${error}`);
    }
  },

  createListItem: async (contentId) => {
    try {
      await api.post(`contents/list-item-content/${contentId}`);
    } catch (error) {
      toast.error(`Error fetching user contents: ${error}`);
    }
  },

  createListItemProperty: async (contentId, idx, rootId) => {
    try {
      await api.post(
        `contents/list-item-content/${contentId}/${idx}/${rootId}/property`,
      );
    } catch (error) {
      toast.error(`Error fetching user contents: ${error}`);
    }
  },

  deleteItemFromListItemContent: async (contentId, index) => {
    try {
      await api.delete(`contents/list-item-content/${contentId}/${index}`);
    } catch (error) {
      toast.error(`Error while deleting: ${error}`);
    }
  },

  reorderListItem: async (contentId, newOrder) => {
    try {
      await api.put(`contents/list-item-content/${contentId}/reorder`, {
        newOrder,
      });
    } catch (error) {
      toast.error(`Error reordering list item content: ${error}`);
    }
  },
}));

export default useContentStore;
