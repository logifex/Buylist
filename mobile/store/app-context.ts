import React from "react";

export interface AppContextType {
  runtimes: number;
}

const AppContext = React.createContext<AppContextType>({
  runtimes: 0,
});

export default AppContext;
