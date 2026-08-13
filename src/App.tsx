import { useEffect, useState } from "react";
import TodoSetting from "./components/TodoSetting";
import { currentMonitor, getCurrentWindow, LogicalPosition, LogicalSize } from "@tauri-apps/api/window";
import Dashboard from "./components/Dashboard";
import Titlebar from "./components/Titlebar";
import { gamesStore, tasksStore } from "./utils/storage";

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

function App() {
  const [ registeredTasks, setRegisteredTasks ] = useState<StoreTask[]|null>(null);
  const [ registeredGames, setRegisteredGames ] = useState<StoreGame[]|null>(null);

  useEffect(() => {
    (async () => {
      await initWindow();
      const games: StoreGame[]|undefined = await gamesStore.get('games');
      const tasks: StoreTask[]|undefined = await tasksStore.get('tasks');
      if (games) {
        setRegisteredGames(games);
      }
      if (tasks) {
        setRegisteredTasks(tasks);
      }
    })();
  }, []);

  return (
    <main className="h-full overflow-hidden text-white">
      <div className="h-full grid grid-rows-[auto_1fr]">
        <Titlebar />
        <div className="bg-zinc-900">
          <Dashboard />
        </div>
      </div>
      <TodoSetting />
    </main>
  );
}

export default App;
