import React, { PropsWithChildren } from "react";
import { useEffect, useState } from "react";
import AppDataService from "@/services/AppDataService";
import AppContext, { AppContextType } from "./app-context";

const AppContextProvider = ({ children }: PropsWithChildren) => {
  const [runtimes, setRuntimes] = useState(0);

  useEffect(() => {
    const incrementRuntimes = async () => {
      const currentRuntimes = ((await AppDataService.readRuntimes()) ?? 0) + 1;

      await AppDataService.writeRuntimes(currentRuntimes);
      setRuntimes(currentRuntimes);
    };

    incrementRuntimes();
  }, []);

  const appContext: AppContextType = {
    runtimes: runtimes,
  };

  return <AppContext value={appContext}>{children}</AppContext>;
};

export default AppContextProvider;
