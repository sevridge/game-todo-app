import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import GameSelector from "./GameSelector";
import { faCheck, faPlus } from "@fortawesome/free-solid-svg-icons";
import { useId } from "react";

function TaskItem({task}: {task: StoreTask}) {
  const id = useId();
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
      </div>
    </div>
  )
}

export default function Dashboard({regGames, regTasks}: {regGames?: StoreGame[], regTasks?: StoreTask[]}) {
  return (
    <>
      <GameSelector regGames={regGames} />
      <div className="p-3">
        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-2">
            {regTasks?.map((v, i) => {
              return <TaskItem key={i} task={v} />
            })}
          </div>
          <button className="flex items-center outline-none gap-1 border border-dashed px-2 py-1 rounded-md cursor-pointer">
            <FontAwesomeIcon icon={faPlus} />
            <div>タスクを追加</div>
          </button>
        </div>
      </div>
    </>
  )
}