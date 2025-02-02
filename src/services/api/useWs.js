import { useContext } from "react";
import { WSContext } from './WSprovider';  // Ensure the correct import path

export const useWs = () => {
  const wsContext = useContext(WSContext);

  if (!wsContext) {
    throw new Error("useWs must be used within a WSProvider");
  }

  return wsContext;
};
