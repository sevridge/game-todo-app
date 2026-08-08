import { useEffect } from "react";
import TodoSetting from "./components/TodoSetting";
import { currentMonitor, getCurrentWindow, LogicalPosition, LogicalSize } from "@tauri-apps/api/window";

function App() {
  useEffect(() => {
    (async () => {
      const monitor = await currentMonitor();
      const window = await getCurrentWindow();
      const windowInner = await window.innerSize();
      const monWidth = monitor?.workArea.size.width || 1920;
      const monHeight = monitor?.workArea.size.height || 1080;
      const winWidth =  windowInner.width;
      const winHeight = windowInner.height;
      window.setSize(new LogicalSize(winWidth, monHeight));
      const posX = monWidth - winWidth;
      window.setPosition(new LogicalPosition(posX, 0));
    })();
  }, []);

  return (
    <main className="h-full">
      <TodoSetting />
    </main>
  );
}

export default App;
