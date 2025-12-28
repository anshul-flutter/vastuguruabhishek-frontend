import { createContext, useContext } from "react";

const LayoutContext = createContext({ inPublicLayout: false });

export const LayoutProvider = LayoutContext.Provider;

export const usePublicLayout = () => useContext(LayoutContext);

export default LayoutContext;
