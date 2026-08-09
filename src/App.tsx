import { useEffect, useState } from "react";
import TodoSetting from "./components/TodoSetting";
import { currentMonitor, getCurrentWindow, LogicalPosition, LogicalSize } from "@tauri-apps/api/window";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRotateRight, faThumbtack, faThumbtackSlash, faWindowMinimize, faX } from "@fortawesome/free-solid-svg-icons";
import Dashboard from "./components/Dashboard";

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
  const [ iconHover, setIconHover ] = useState<{x: number, y: number, title: string}|null>(null);

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

  function _onIconHover(visible: boolean, e?: React.MouseEvent<SVGSVGElement, MouseEvent>, title?: string) {
    if (visible) {
      if (!e || !title) return;
      const target = e.currentTarget.getBoundingClientRect();
      setIconHover({x: target.x, y: target.y + target.height, title: title});
    } else {
      setIconHover(null);
    }
  }

  return (
    <main className="h-full overflow-hidden text-white">
      <div className="h-full grid grid-rows-[auto_1fr]">
        <div className="flex items-center bg-zinc-800 relative"data-tauri-drag-region>
          <div className="flex-1"></div>
          <div className="flex items-center text-sm">
            <FontAwesomeIcon className="cursor-pointer p-2 hover:bg-white/20" icon={faArrowRotateRight} onClick={initWindow} onMouseEnter={(e) => _onIconHover(true, e, '初期位置にリセット')} onMouseLeave={() => setIconHover(null)} />
            <FontAwesomeIcon className="cursor-pointer p-2 hover:bg-white/20" icon={isAlwaysOnTop ? faThumbtack : faThumbtackSlash} onClick={windowAlwaysOnTop} onMouseEnter={(e) => _onIconHover(true, e, '常に最前面切り替え')} onMouseLeave={() => setIconHover(null)} />
            <FontAwesomeIcon className="cursor-pointer p-2 hover:bg-white/20" icon={faWindowMinimize} onClick={windowMinimize} onMouseEnter={(e) => _onIconHover(true, e, '最小化')} onMouseLeave={() => setIconHover(null)} />
            <FontAwesomeIcon className="cursor-pointer p-2 hover:bg-red-500" icon={faX} onClick={windowClose} onMouseEnter={(e) => _onIconHover(true, e, '閉じる')} onMouseLeave={() => setIconHover(null)} />
          </div>
          {iconHover && (
            // これが画面外に出た場合逆方向を基準にする
            <div className="absolute pointer-events-none text-xs whitespace-nowrap" style={{left: iconHover.x, top: iconHover.y}}>{iconHover.title}</div>
          )}
        </div>
        <div className="bg-zinc-900">
          <Dashboard />
        </div>
      </div>
      <TodoSetting />
    </main>
  );
}

export default App;
