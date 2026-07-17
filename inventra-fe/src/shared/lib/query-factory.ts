import { useQuery, useMutation, useQueryClient, UseQueryOptions, UseQueryResult, UseMutationResult } from '@tanstack/react-query';
import { z } from 'zod';
import { axiosInstance } from './axios';

export function createResourceHooks<TSchema extends z.ZodTypeAny>(config: {
  resource: string;             // ex: 'inventory'
  schema: TSchema;              // zod schema untuk 1 item
  baseUrl: string;              // ex: '/api/products'
}) {
  type Item = z.infer<TSchema>;
  type List = Item[];

  const listSchema = z.array(config.schema);
  const keys = {
    all: [config.resource] as const,
    list: (filters?: Record<string, unknown>) => [config.resource, 'list', filters] as const,
    detail: (id: string | number) => [config.resource, 'detail', id] as const,
  };

  function useList(
    filters?: Record<string, unknown>,
    options?: Omit<UseQueryOptions<List, Error>, 'queryKey' | 'queryFn'>
  ): UseQueryResult<List, Error> {
    return useQuery<List, Error>({
      queryKey: keys.list(filters),
      queryFn: async () => {
        const { data } = await axiosInstance.get(config.baseUrl, { params: filters });
        const rawList = Array.isArray(data?.data?.data)
          ? data.data.data
          : Array.isArray(data?.data)
          ? data.data
          : Array.isArray(data)
          ? data
          : [];
        return listSchema.parse(rawList);
      },
      ...options,
    });
  }

  function useDetail(
    id: string | number,
    options?: Omit<UseQueryOptions<Item, Error>, 'queryKey' | 'queryFn'>
  ): UseQueryResult<Item, Error> {
    return useQuery<Item, Error>({
      queryKey: keys.detail(id),
      queryFn: async () => {
        const { data } = await axiosInstance.get(`${config.baseUrl}/${id}`);
        const rawItem = data?.data ?? data;
        return config.schema.parse(rawItem);
      },
      enabled: !!id && (options?.enabled ?? true),
      ...options,
    });
  }

  function useCreate(): UseMutationResult<Item, Error, Item> {
    const qc = useQueryClient();
    return useMutation<Item, Error, Item>({
      mutationFn: async (payload: Item) => {
        const { data } = await axiosInstance.post(config.baseUrl, payload);
        const rawItem = data?.data ?? data;
        return config.schema.parse(rawItem);
      },
      onSuccess: () => qc.invalidateQueries({ queryKey: keys.all }),
    });
  }

  function useUpdate(): UseMutationResult<Item, Error, { id: string | number; payload: Partial<Item> }> {
    const qc = useQueryClient();
    return useMutation<Item, Error, { id: string | number; payload: Partial<Item> }>({
      mutationFn: async ({ id, payload }) => {
        const { data } = await axiosInstance.put(`${config.baseUrl}/${id}`, payload);
        const rawItem = data?.data ?? data;
        return config.schema.parse(rawItem);
      },
      onSuccess: (_data, variables) => {
        qc.invalidateQueries({ queryKey: keys.all });
        qc.invalidateQueries({ queryKey: keys.detail(variables.id) });
      },
    });
  }

  function useRemove(): UseMutationResult<string | number, Error, string | number> {
    const qc = useQueryClient();
    return useMutation<string | number, Error, string | number>({
      mutationFn: async (id: string | number) => {
        await axiosInstance.delete(`${config.baseUrl}/${id}`);
        return id;
      },
      onSuccess: () => qc.invalidateQueries({ queryKey: keys.all }),
    });
  }

  return { keys, useList, useDetail, useCreate, useUpdate, useRemove };
}
