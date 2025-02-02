import React from "react";

export type AppContextType = {
  runtimes: number;
};

const AppContext = React.createContext<AppContextType>({
  runtimes: 0,
});

export default AppContext;
