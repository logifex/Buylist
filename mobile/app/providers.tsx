import React, { PropsWithChildren, useEffect } from "react";
import { AppState, AppStateStatus, StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import ThemeProvider from "@/store/ThemeProvider";
import AuthProvider from "@/store/AuthProvider";
import ListsProvider from "@/store/ListsProvider";
import Toast from "react-native-toast-message";
import toastConfig from "@/config/toast-config";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "@/components/Fallbacks/ErrorFallback";
import AppContextProvider from "@/store/AppContextProvider";
import { onlineManager, focusManager } from "@tanstack/react-query";
import { useNetInfo } from "@react-native-community/netinfo";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import shouldDehydrateMutation from "@/utils/shouldDehydrateMutation";
import queryClient, { persister } from "@/config/queryClient";
import { SafeAreaProvider } from "react-native-safe-area-context";

const Providers = ({ children }: PropsWithChildren) => {
  const { isInternetReachable } = useNetInfo();

  useEffect(() => {
    const status = !!isInternetReachable;
    onlineManager.setOnline(status);
  }, [isInternetReachable]);

  function onAppStateChange(status: AppStateStatus) {
    focusManager.setFocused(status === "active");
  }

  useEffect(() => {
    const subscription = AppState.addEventListener("change", onAppStateChange);

    return () => subscription.remove();
  }, []);

  return (
    <PersistQueryClientProvider
      persistOptions={{
        persister: persister,
        maxAge: Infinity,
        dehydrateOptions: {
          shouldDehydrateQuery(query) {
            return !!query.meta?.persist;
          },
          shouldDehydrateMutation: (mutation) =>
            shouldDehydrateMutation(queryClient, mutation),
        },
      }}
      client={queryClient}
      onSuccess={() => {
        queryClient.resumePausedMutations();
      }}
    >
      <AppContextProvider>
        <AuthProvider>
          <ListsProvider>
            <ThemeProvider>
              <GestureHandlerRootView style={styles.fullSpace}>
                <BottomSheetModalProvider>
                  <SafeAreaProvider>
                    <ErrorBoundary FallbackComponent={ErrorFallback}>
                      {children}
                    </ErrorBoundary>
                  </SafeAreaProvider>
                </BottomSheetModalProvider>
                <Toast config={toastConfig} />
              </GestureHandlerRootView>
            </ThemeProvider>
          </ListsProvider>
        </AuthProvider>
      </AppContextProvider>
    </PersistQueryClientProvider>
  );
};

const styles = StyleSheet.create({
  fullSpace: {
    flex: 1,
  },
});

export default Providers;
