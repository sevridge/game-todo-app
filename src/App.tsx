import { useEffect, useState } from "react";
import TodoSetting from "./components/TodoSetting";
import { currentMonitor, getCurrentWindow, LogicalPosition, LogicalSize } from "@tauri-apps/api/window";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRotateRight, faThumbtack, faThumbtackSlash, faWindowMinimize, faX } from "@fortawesome/free-solid-svg-icons";

async function initWindow() {
  const monitor = await currentMonitor();
  const window = await getCurrentWindow();
  const windowInner = await window.innerSize();
  const monWidth = monitor?.workArea.size.width || 1920;
  const monHeight = monitor?.workArea.size.height || 1080;
  const winWidth =  500; // windowInner.width;
  const winHeight = windowInner.height;
  window.setSize(new LogicalSize(winWidth, monHeight));
  const posX = monWidth - winWidth;
  window.setPosition(new LogicalPosition(posX, 0));
}

async function windowMinimize() {
  const window = await getCurrentWindow();
  window.minimize();
}

async function windowClose() {
  const window = await getCurrentWindow();
  window.close();
}

function App() {
  const [ isAlwaysOnTop, setIsAlwaysOnTop ] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      await initWindow();
    })();
  }, []);

  async function windowAlwaysOnTop() {
    const window = await getCurrentWindow();
    const alwaysOnTop = await window.isAlwaysOnTop();
    if (alwaysOnTop) {
      window.setAlwaysOnTop(false);
      setIsAlwaysOnTop(false);
    } else {
      window.setAlwaysOnTop(true);
      setIsAlwaysOnTop(true);
    }
  }

  return (
    <main className="h-full text-white">
      <div className="h-full grid grid-rows-[auto_1fr]">
        <div className="flex items-center bg-zinc-800"data-tauri-drag-region>
          <div className="flex-1"></div>
          <div className="flex items-center text-sm">
            <FontAwesomeIcon className="cursor-pointer p-2 hover:bg-white/20" icon={faArrowRotateRight} onClick={initWindow} />
            <FontAwesomeIcon className="cursor-pointer p-2 hover:bg-white/20" icon={isAlwaysOnTop ? faThumbtack : faThumbtackSlash} onClick={windowAlwaysOnTop} />
            <FontAwesomeIcon className="cursor-pointer p-2 hover:bg-white/20" icon={faWindowMinimize} onClick={windowMinimize} />
            <FontAwesomeIcon className="cursor-pointer p-2 hover:bg-red-500" icon={faX} onClick={windowClose} />
          </div>
        </div>
        <div className="bg-zinc-900">

        </div>
      </div>
      <TodoSetting />
    </main>
  );
}

export default App;
