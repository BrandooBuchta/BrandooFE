import { create } from "zustand";
import { toast } from "react-toastify";
import axios from "axios";

interface FileState {
  uploadFile: (file: File) => Promise<string>;
  deleteFile: (fileName: string) => Promise<string>;
}

const useFileStore = create<FileState>(() => ({
  uploadFile: async (file) => {
    const formData = new FormData();

    formData.append("file", file);

    try {
      const response = await axios.post<string>(
        "http://localhost:8000/api/upload-file",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      return response.data;
    } catch (error) {
      toast.error(`${error}`);

      return "File upload failed";
    }
  },
  deleteFile: async (fileName) => {
    try {
      const response = await axios.delete<string>(
        `http://localhost:8000/api/delete-file/${fileName}`,
      );

      return response.data;
    } catch (error) {
      toast.error(`${error}`);

      return "File deletion failed";
    }
  },
}));

export default useFileStore;
