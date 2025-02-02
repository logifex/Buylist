import { ListMutationKeys } from "@/constants/QueryKeys";
import {
  updateListDefaultMutationFn,
  updateListDefaultOnError,
} from "@/hooks/api/lists/useUpdateList";
import {
  createProductDefaultMutationFn,
  createProductDefaultOnError,
} from "@/hooks/api/products/useCreateProduct";
import {
  deleteProductDefaultMutationFn,
  deleteProductDefaultOnError,
} from "@/hooks/api/products/useDeleteProduct";
import {
  updateProductDefaultMutationFn,
  updateProductDefaultOnError,
} from "@/hooks/api/products/useUpdateProduct";
import { ApiError } from "@/models/Error";
import {
  MutationCache,
  onlineManager,
  QueryCache,
  QueryClient,
} from "@tanstack/react-query";
import Toast from "react-native-toast-message";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import AsyncStorage from "@react-native-async-storage/async-storage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { gcTime: Infinity, staleTime: Infinity, retry: 0 },
  },
  mutationCache: new MutationCache(),
  queryCache: new QueryCache({
    onError: (err) => {
      if ((err as ApiError).status === 404) {
        return;
      }
      console.log(err);
      Toast.show({
        type: "base",
        text1: "שגיאה בהתחברות לשרת, נסו שוב מאוחר יותר",
        visibilityTime: 1000 * 6,
      });
    },
  }),
});

queryClient.setMutationDefaults(ListMutationKeys.productCreate(), {
  mutationFn: createProductDefaultMutationFn,
  onError: createProductDefaultOnError(queryClient),
});
queryClient.setMutationDefaults(ListMutationKeys.productUpdate(), {
  mutationFn: updateProductDefaultMutationFn,
  onError: updateProductDefaultOnError,
});
queryClient.setMutationDefaults(ListMutationKeys.productDelete(), {
  mutationFn: deleteProductDefaultMutationFn,
  onError: deleteProductDefaultOnError,
});
queryClient.setMutationDefaults(ListMutationKeys.update(), {
  mutationFn: updateListDefaultMutationFn,
  onError: updateListDefaultOnError,
});

onlineManager.setOnline(false);

export const persister = createAsyncStoragePersister({
  storage: AsyncStorage,
});

export default queryClient;
