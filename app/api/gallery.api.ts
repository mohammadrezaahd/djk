import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import {
  getGallery,
  uploadFile,
  updateFile,
  deleteFile,
  getImagesByIds,
  getImage,
} from "../services/gallery.service";
import type {
  GalleryResponse,
  UpdateFileData,
  GetGalleryOptions,
} from "../types/interfaces/gallery.interface";

// Hook to fetch gallery with pagination and search
export const useGallery = (options: GetGalleryOptions) => {
  return useQuery<GalleryResponse, Error>({
    queryKey: ["gallery", options],
    queryFn: () => getGallery(options),
  });
};

export const useImages = (options: GetGalleryOptions) => {
  return useQuery<GalleryResponse, Error>({
    queryKey: ["gallery", options],
    queryFn: () => getGallery(options),
  });
};

// Hook to fetch a single image by ID
export const useImage = (id: number) => {
    return useQuery({
        queryKey: ["image", id],
        queryFn: () => getImage(id),
        enabled: !!id,
    });
};


// Hook to fetch selected images by their IDs
export const useSelectedImages = (imageIds: number[]) => {
  return useQuery({
    queryKey: ["selectedImages", imageIds],
    queryFn: () => getImagesByIds(imageIds),
    enabled: imageIds.length > 0, // Only run the query if there are image IDs
  });
};

// Hook for file uploads
export const useUploadFile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (file: File) => uploadFile(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gallery"] });
    },
  });
};

export const useAddImage = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (vars: { data: UpdateFileData, file: File }) => uploadFile(vars.file, vars.data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["gallery"] });
        },
    });
};

// Hook for updating file data
export const useUpdateFile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: UpdateFileData;
    }) => updateFile(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["gallery"] });
      queryClient.invalidateQueries({ queryKey: ["image", variables.id] }); // If you have a query for a single image
    },
  });
};

export const useEditImage = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (vars: { id: number, data: UpdateFileData }) => updateFile(vars.id, vars.data),
        onSuccess: (data, vars) => {
            queryClient.invalidateQueries({ queryKey: ["gallery"] });
            queryClient.invalidateQueries({ queryKey: ["image", vars.id] });
        },
    });
};

// Hook for deleting a file
export const useDeleteFile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteFile(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gallery"] });
    },
  });
};

export const useRemoveImage = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => deleteFile(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["gallery"] });
        },
    });
};