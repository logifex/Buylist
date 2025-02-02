import {
  defaultShouldDehydrateMutation,
  Mutation,
  MutationCache,
  QueryClient,
} from "@tanstack/react-query";
import { ListMutationKeys } from "@/constants/QueryKeys";
import { DeleteProductVariables } from "@/hooks/api/products/useDeleteProduct";
import { UpdateProductVariables } from "@/hooks/api/products/useUpdateProduct";
import {
  CreateProductContext,
  CreateProductVariables,
} from "@/hooks/api/products/useCreateProduct";
import { UpdateListVariables } from "@/hooks/api/lists/useUpdateList";

const shouldDehydrateMutation = (
  queryClient: QueryClient,
  mutation: Mutation,
) => {
  if (!defaultShouldDehydrateMutation(mutation)) {
    return false;
  }

  const { mutationKey } = mutation.options;

  if (
    !mutationKey ||
    mutationKey.length < 2 ||
    mutationKey[0] !== ListMutationKeys.all[0]
  ) {
    return true;
  }

  const mutationCache = queryClient.getMutationCache();

  if (mutationKey[1] === ListMutationKeys.productDelete()[1]) {
    return handleProductDelete(mutationCache, mutation);
  } else if (mutationKey[1] === ListMutationKeys.productUpdate()[1]) {
    return handleProductUpdate(mutationCache, mutation);
  } else if (mutationKey[1] === ListMutationKeys.update()[1]) {
    return handleListUpdate(mutationCache, mutation);
  }

  return true;
};

const handleProductDelete = (
  mutationCache: MutationCache,
  mutation: Mutation,
) => {
  const variables = mutation.state.variables as DeleteProductVariables;
  const productUpdateMutations = mutationCache.findAll({
    mutationKey: ListMutationKeys.productUpdate(),
    status: "pending",
  });
  const irrelevantUpdateMutations = productUpdateMutations.filter(
    (m) =>
      (m.state.variables as UpdateProductVariables).product.id ===
      variables.productId,
  );

  for (const m of irrelevantUpdateMutations) {
    mutationCache.remove(m);
  }

  const productCreateMutations = mutationCache.findAll({
    mutationKey: ListMutationKeys.productCreate(),
    status: "pending",
  });
  const irrelevantCreateMutation = productCreateMutations.find(
    (m) =>
      (m.state.context as CreateProductContext)?.tempId === variables.productId,
  );

  if (irrelevantCreateMutation) {
    mutationCache.remove(irrelevantCreateMutation);
    mutationCache.remove(mutation);
    return false;
  }

  return true;
};

const handleProductUpdate = (
  mutationCache: MutationCache,
  mutation: Mutation,
) => {
  const variables = mutation.state.variables as UpdateProductVariables;
  const productCreateMutations = mutationCache.findAll({
    mutationKey: ListMutationKeys.productCreate(),
    status: "pending",
  });
  const createMutation = productCreateMutations.find(
    (m) =>
      (m.state.context as CreateProductContext)?.tempId ===
      variables.product.id,
  );

  if (createMutation) {
    const createVariables = createMutation.state
      .variables as CreateProductVariables;
    createVariables.product = {
      ...createVariables.product,
      ...variables.product,
    };
    mutationCache.remove(mutation);
    return false;
  }

  const productUpdateMutations = mutationCache.findAll({
    mutationKey: ListMutationKeys.productUpdate(),
    status: "pending",
  });
  const irrelevantUpdateMutations = productUpdateMutations.filter(
    (m) =>
      m.state.submittedAt < mutation.state.submittedAt &&
      (m.state.variables as UpdateProductVariables).product.id ===
        variables.product.id,
  );

  for (const m of irrelevantUpdateMutations) {
    mutationCache.remove(m);
  }

  return true;
};

const handleListUpdate = (mutationCache: MutationCache, mutation: Mutation) => {
  const listUpdateMutations = mutationCache.findAll({
    mutationKey: ListMutationKeys.update(),
    status: "pending",
  });
  const irrelevantUpdateMutations = listUpdateMutations.filter(
    (m) =>
      m.state.submittedAt < mutation.state.submittedAt &&
      (m.state.variables as UpdateListVariables).listId ===
        (mutation.state.variables as UpdateListVariables).listId,
  );

  for (const m of irrelevantUpdateMutations) {
    mutationCache.remove(m);
  }

  return true;
};

export default shouldDehydrateMutation;
