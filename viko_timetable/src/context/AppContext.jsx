import { createContext, useState } from "react";

export const AppContext = createContext();

const DataProvider = ({ children }) => {
  const [test, setTest] = useState(null);
  const API_URL = "https://romantic-lorenza-zanjarwhite-5f028c50.koyeb.app";
  // const API_URL = "https://overseas-vyky-icerahi-d9f7baf3.koyeb.app";
  // const API_URL = "https://viko-schedule-app.fly.dev";
  // const API_URL = "http://localhost:3000";

  return (
    <AppContext.Provider value={{ API_URL }}>{children}</AppContext.Provider>
  );
};
export default DataProvider;
