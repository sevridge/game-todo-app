import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import GameSelector from "./GameSelector";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

export default function Dashboard({regGames, regTasks}: {regGames?: StoreGame[], regTasks?: StoreTask[]}) {
  return (
    <>
      <GameSelector regGames={regGames} />
      <div className="p-3">
        <div className="flex flex-col gap-2">
          <button className="flex items-center outline-none gap-1 border border-dashed p-2 rounded-md cursor-pointer">
            <FontAwesomeIcon icon={faPlus} />
            <div>タスクを追加</div>
          </button>
        </div>
      </div>
    </>
  )
}