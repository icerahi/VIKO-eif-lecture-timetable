import { useRef, useState } from "react";
import { createContext } from "react";

export const AppContext = createContext();

const DataProvider = ({ children }) => {
  const [test, setTest] = useState(null);
  // const API_URL = "https://overseas-vyky-icerahi-d9f7baf3.koyeb.app";
  const API_URL = "https://viko-eif-lecture-timetable.fly.dev";

  return (
    <AppContext.Provider value={{ API_URL }}>{children}</AppContext.Provider>
  );
};
export default DataProvider;
