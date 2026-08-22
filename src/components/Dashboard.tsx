import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import GameSelector from "./GameSelector";
import { faAnglesDown, faAnglesUp, faCheck, faMinus, faPlus, faXmark } from "@fortawesome/free-solid-svg-icons";
import { useId, useState } from "react";
import TodoSetting from "./TodoSetting";
import { randomString } from "../utils/string";
import { tasksStore } from "../utils/storage";

function TaskItemTiming({resetTime}: {resetTime: string}) {
  return (
    <div className="text-[10px] shrink-0">
      {resetTime === 'daily' && <div className="px-1 rounded-full text-red-200 bg-red-500/30">毎日</div>}
      {resetTime === 'weekly' && <div className="px-1 rounded-full text-blue-200 bg-blue-500/30">毎週</div>}
      {resetTime === 'monthly' && <div className="px-1 rounded-full text-green-200 bg-green-500/30">毎月</div>}
      {resetTime === 'every-week' && <div className="px-1 rounded-full text-purple-200 bg-purple-500/30">隔週</div>}
    </div>
  )
}

function TaskPriority({priority}: {priority: string}) {
  return (
    <div className="h-5 aspect-square text-xs rounded-full overflow-hidden shrink-0">
      {priority === 'high' && <div className="flex items-center justify-center h-full w-full text-blue-200 bg-blue-500/30"><FontAwesomeIcon icon={faAnglesUp} /></div>}
      {priority === 'medium' && <div className="flex items-center justify-center h-full w-full text-green-200 bg-green-500/30"><FontAwesomeIcon icon={faMinus} /></div>}
      {priority === 'low' && <div className="flex items-center justify-center h-full w-full text-yellow-200 bg-yellow-500/30"><FontAwesomeIcon icon={faAnglesDown} /></div>}
    </div>
  )
}

function TaskItem({task, setRegTasks, lastUpdate, setLastUpdates}: {task: StoreTask, setRegTasks?: React.Dispatch<React.SetStateAction<StoreTask[] | null>>, lastUpdate?: number, setLastUpdates?: React.Dispatch<React.SetStateAction<LastUpdateData | null>>}) {
  const id = useId();

  function removeTask() {
    setRegTasks?.(prev => {
      const newPrev = prev?.filter((v) => v.id !== task.id) ;
      tasksStore.set('tasks', newPrev);
      return newPrev || null;
    })
  }

  function checkTask(taskId: string) {
    setRegTasks?.(prev => {
      const newPrev = prev?.map((v) => v.id === taskId ? {...v, checked: !v.checked} : v) || null;
      tasksStore.set('tasks', newPrev);
      return newPrev;
    })
    setLastUpdates?.(prev => {
      const newPrev = { ...prev};
      newPrev[taskId] = new Date().getTime();
      tasksStore.set('lastUpdate', newPrev);
      return newPrev;
    })
  }

  return (
    <div className="px-2 py-1 rounded-md bg-zinc-800 select-none">
      <div className="flex items-center gap-2 relative">
        <label htmlFor={id} className="group shrink">
          <input type="checkbox" className="hidden" id={id} checked={task.checked || false} onChange={() => checkTask(task.id)} />
          <div className="flex items-center justify-center w-4 h-4 rounded-sm cursor-pointer bg-zinc-600 group-has-[input:checked]:bg-zinc-500">
            <div className="hidden group-has-[input:checked]:flex"><FontAwesomeIcon icon={faCheck} className="text-xs" /></div>
          </div>
        </label>
        <TaskPriority priority={task.priority} />
        <div className="min-w-0 overflow-hidden text-ellipsis">{task.label}</div>
        <TaskItemTiming resetTime={task.resetTime} />
        <div className="flex flex-1 items-end justify-end">
          <div className="flex items-center cursor-pointer text-[0.65rem]" onClick={removeTask}>
            <FontAwesomeIcon icon={faXmark} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Dashboard({regGames, regTasks, setRegGames, setRegTasks, lastUpdates, setLastUpdates}: {regGames?: StoreGame[], regTasks?: StoreTask[], setRegGames?: React.Dispatch<React.SetStateAction<StoreGame[] | null>>, setRegTasks?: React.Dispatch<React.SetStateAction<StoreTask[] | null>>, lastUpdates?: LastUpdateData, setLastUpdates?: React.Dispatch<React.SetStateAction<LastUpdateData | null>>}) {
  const [ currentGameData, setCurrentGameData ] = useState<StoreGame|null>(null);
  const [ todoSettingIsOpen, setTodoSettingIsOpen ] = useState<boolean>(false);

  function addNewTask(label: string, resetTime: string, resetTimeStatus: { time: number, week?: number, day?: number}, priority: string) {
    if (!currentGameData) return;
    const newTask = {
      id: randomString(8),
      gameId: currentGameData.id,
      label,
      resetTime,
      resetTimeStatus,
      priority
    }
    setRegTasks?.(prev => {
      const newPrev = prev ? [...prev] : [];
      newPrev.push(newTask)
      tasksStore.set('tasks', newPrev);
      return newPrev;
    })
    setTodoSettingIsOpen(false);
  }

  return (
    <>
      <GameSelector regGames={regGames} setRegGames={setRegGames} currentGameData={currentGameData || undefined} setCurrentGameData={setCurrentGameData} />
      <div className="p-3">
        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-2">
            {regTasks?.map((v, i) => {
              return v.gameId === currentGameData?.id && <TaskItem key={i} task={v} setRegTasks={setRegTasks} lastUpdate={lastUpdates?.[v.id]} setLastUpdates={setLastUpdates} />
            })}
          </div>
          {currentGameData && <button className="flex items-center outline-none gap-1 border border-dashed px-2 py-1 rounded-md cursor-pointer" onClick={() => setTodoSettingIsOpen(true)}>
            <FontAwesomeIcon icon={faPlus} />
            <div>タスクを追加</div>
          </button>}
        </div>
      </div>
      {todoSettingIsOpen && <TodoSetting setTodoSettingIsOpen={setTodoSettingIsOpen} addNewTask={addNewTask} />}
    </>
  )
}