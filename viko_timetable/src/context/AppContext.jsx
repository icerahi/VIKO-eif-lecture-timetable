import { useRef, useState } from "react";
import { createContext } from "react";

export const AppContext = createContext();

const DataProvider = ({ children }) => {
  const [test, setTest] = useState(null);

  return <AppContext.Provider value={{}}>{children}</AppContext.Provider>;
};
export default DataProvider;
