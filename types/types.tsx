export type Navigation = {
    navigate: (scene: string, data?: { [key: string]: any }) => void;
  };