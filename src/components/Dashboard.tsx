import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import GameSelector from "./GameSelector";
import { faCheck, faPlus, faXmark } from "@fortawesome/free-solid-svg-icons";
import { useId, useState } from "react";
import TodoSetting from "./TodoSetting";
import { randomString } from "../utils/string";
import { tasksStore } from "../utils/storage";

function TaskItem({task, setRegTasks}: {task: StoreTask, setRegTasks?: React.Dispatch<React.SetStateAction<StoreTask[] | null>>}) {
  const id = useId();

  function removeTask() {
    setRegTasks?.(prev => {
      const newPrev = prev?.filter((v) => v.id !== task.id) ;
      tasksStore.set('tasks', newPrev);
      return newPrev || null;
    })
  }

  return (
    <div className="px-2 py-1 rounded-md bg-zinc-800 select-none">
      <div className="flex items-center gap-2">
        <label htmlFor={id} className="group">
          <input type="checkbox" className="hidden" id={id} />
          <div className="flex items-center justify-center w-4 h-4 rounded-sm cursor-pointer bg-zinc-600 group-has-[input:checked]:bg-zinc-500">
            <div className="hidden group-has-[input:checked]:flex"><FontAwesomeIcon icon={faCheck} className="text-xs" /></div>
          </div>
        </label>
        <div>{task.label}</div>
        <div className="flex items-center flex-1 justify-end">
          <div className="flex items-center cursor-pointer text-[0.65rem]" onClick={removeTask}>
            <FontAwesomeIcon icon={faXmark} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Dashboard({regGames, regTasks, setRegGames, setRegTasks}: {regGames?: StoreGame[], regTasks?: StoreTask[], setRegGames?: React.Dispatch<React.SetStateAction<StoreGame[] | null>>, setRegTasks?: React.Dispatch<React.SetStateAction<StoreTask[] | null>>}) {
  const [ currentGameData, setCurrentGameData ] = useState<StoreGame|null>(null);
  const [ todoSettingIsOpen, setTodoSettingIsOpen ] = useState<boolean>(false);

  function addNewTask(label: string, resetTime: string, resetTimeStatus: { time: number, week?: string, day?: number}, priority: string) {
    if (!currentGameData) return;
    setRegTasks?.(prev => {
      const newPrev = prev ? [...prev] : [];
      newPrev.push({
        id: randomString(8),
        gameId: currentGameData.id,
        label,
      })
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
              return v.gameId === currentGameData?.id && <TaskItem key={i} task={v} setRegTasks={setRegTasks} />
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