import { ref, Ref } from 'vue';

import { PromiseType, FnReturningPromise } from '@/utils/typings';

type ResultOfFnReturningPromise<T extends FnReturningPromise> = PromiseType<
  ReturnType<T>
> | null;

export const useAsyncFn = <T extends FnReturningPromise>(
  fn: T,
  initialData: ResultOfFnReturningPromise<T>
) => {
  const fnRef = ref<T>(fn);

  const isPending = ref(false);
  const isCompleted = ref(false);
  const isSuccessful = ref(false);
  const error = ref<Error | null>(null);
  const data = ref<ResultOfFnReturningPromise<T>>(
    initialData
  ) as Ref<ResultOfFnReturningPromise<T> | null>;

  const __lastPromise = ref<ReturnType<T>>();

  const request = async (...args: Parameters<T> | []) => {
    isPending.value = true;
    isCompleted.value = false;
    isSuccessful.value = false;
    error.value = null;

    const promise = (__lastPromise.value = fnRef.value(
      ...args
    ) as ReturnType<T>);

    try {
      const result = await promise;

      if (__lastPromise.value === promise) {
        isSuccessful.value = true;
        data.value = result;

        return result;
      }
    } catch (error) {
      if (__lastPromise.value === promise) {
        error.value = error;
        isSuccessful.value = false;
        console.error(error);
      }
    } finally {
      isPending.value = false;
      isCompleted.value = true;
    }
  };

  return {
    isPending,
    isCompleted,
    isSuccessful,
    error,
    data,
    request,
  };
};
