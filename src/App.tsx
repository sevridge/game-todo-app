import { useEffect, useState } from "react";
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
  const winWidth =  350; // windowInner.width;
  const winHeight = windowInner.height;
  window.setSize(new LogicalSize(winWidth, monHeight));
  const posX = monWidth - winWidth;
  window.setPosition(new LogicalPosition(posX, 0));
}

async function isTaskReset(task: StoreTask, tasksLastUpdate?: LastUpdateData) {
  const currentTaskLastUpdate = tasksLastUpdate?.[task.id];
  if (!currentTaskLastUpdate) return false;
  const now = new Date();
  const resetTime = new Date(now);
  resetTime.setHours(task.resetTimeStatus.time, 0, 0, 0);
  const lastUpdate = new Date(currentTaskLastUpdate);
  if (task.resetTime === 'daily') {
    if (now < resetTime) {
      resetTime.setDate(resetTime.getDate() - 1);
    }
  } else if (task.resetTime === 'weekly') {
    const targetDay = task.resetTimeStatus.week || 0;
    const currentDay = now.getDay();

    let diff = currentDay - targetDay;
    if (diff < 0) {
      diff += 7;
    }

    resetTime.setDate(now.getDate() - diff);
  } else if (task.resetTime === 'monthly') {
    const targetDay = task.resetTimeStatus.day || 1;
    resetTime.setDate(targetDay);

    if (now < resetTime) {
      resetTime.setMonth(resetTime.getMonth() - 1);
    }
    // TODO: 日付指定がその日が存在しない日だった場合にどうするか
  } else if (task.resetTime === 'every-week') {
    const first = new Date(now.getFullYear(), now.getMonth(), 1); // 月初を取得
    const firstDay = first.getDay(); // 月初曜日を取得
    const targetDay = task.resetTimeStatus.week || 0; // 設定されている指定曜日を取得

    let diff = targetDay - firstDay; // 月初から何日後が指定された曜日か
    if (diff < 0) {
      diff += 7;
    }

    resetTime.setDate(first.getDate() + diff); // リセット日を月初の指定曜日にする
    // 今日の前の指定曜日を取得
    let diffPrevious = resetTime.getDay() - targetDay; // 今日から何日前がリセット曜日になるか
    if (diffPrevious < 0) {
      diffPrevious += 7;
    }
    resetTime.setDate(resetTime.getDate() + diffPrevious); // 今日から一番最新のリセット曜日
    // リセット曜日が基準日から偶数日になっているか
    const diffTime = resetTime.getTime() - first.getTime();
    const diffDay = diffTime / (1000 * 60 * 60 * 24); // 0, 7, 14, 21 ...
    const diffWeek = diffDay / 7; // 0, 1, 0, 1 ...
    // diffWeekが1だった場合は1週間前の日を取得する
    if (diffWeek === 1) {
      resetTime.setDate(resetTime.getDate() - 7); // 1週間前が別の月の可能性がないわけでもない
    }
  }

  if (lastUpdate <  resetTime) {
    return true;
  }
  return false;
}

function App() {
  const [ registeredTasks, setRegisteredTasks ] = useState<StoreTask[]|null>(null);
  const [ registeredGames, setRegisteredGames ] = useState<StoreGame[]|null>(null);
  const [ lastUpdates, setLastUpdates ] = useState<LastUpdateData|null>(null);

  useEffect(() => {
    (async () => {
      await initWindow();
      const games: StoreGame[]|undefined = await gamesStore.get('games');
      const tasks: StoreTask[]|undefined = await tasksStore.get('tasks');
      const lastUpdates: LastUpdateData|undefined = await tasksStore.get('lastUpdate')
      if (games) {
        setRegisteredGames(games);
      }
      if (tasks) {
        const newTasks: StoreTask[] = await Promise.all(tasks.map(async (_task) => {
          const task = {..._task};
          const isReset = await isTaskReset(task, lastUpdates);
          if (isReset) {
            task.checked = false;
            setLastUpdates(prev => {
              const newPrev = { ...prev};
              newPrev[task.id] = new Date().getTime();
              tasksStore.set('lastUpdate', newPrev);
              return newPrev;
            })
          }

          return task;
        }))
        setRegisteredTasks(newTasks);
      }
      if (lastUpdates) {
        setLastUpdates(lastUpdates);
      }
    })();
  }, []);

  return (
    <main className="h-full overflow-hidden text-white">
      <div className="h-full grid grid-rows-[auto_1fr]">
        <Titlebar />
        <div className="bg-zinc-900 relative min-w-0">
          <Dashboard regGames={registeredGames ? registeredGames : undefined} regTasks={registeredTasks ? registeredTasks : undefined} setRegGames={setRegisteredGames} setRegTasks={setRegisteredTasks} lastUpdates={lastUpdates ? lastUpdates : undefined} setLastUpdates={setLastUpdates} />
        </div>
      </div>
    </main>
  );
}

export default App;
