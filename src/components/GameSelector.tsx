import { faTrashCan } from "@fortawesome/free-regular-svg-icons";
import { faCaretDown, faCaretRight, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react"

export default function GameSelector({gameTasksData}: {gameTasksData?: any}) {
  const [ isOpen, setIsOpen ] = useState<boolean>(false);
  const [ currentTaskData, setCurrentTaskData ] = useState<any>(null);

  useEffect(() => {
    if (!gameTasksData?.[0]) return;
    setCurrentTaskData(gameTasksData[0]);
  }, [])

  return (
      <div className="w-full flex justify-center text-sm select-none">
        <div className="relative flex flex-col items-center">
          <div className="flex items-center justify-center px-2 py-1 border-b border-white" onClick={() => setIsOpen(prev => !prev)}>
            <div>{currentTaskData?.title || 'ゲーム'}</div>
            {isOpen ? <FontAwesomeIcon icon={faCaretDown} /> : <FontAwesomeIcon icon={faCaretRight} />}
          </div>
          {isOpen && (
            <div className="absolute top-full rounded-md overflow-hidden bg-zinc-700 whitespace-nowrap">
              <div className="px-2 py-1 text-xs text-zinc-400">ゲーム</div>
              {gameTasksData?.[0] && gameTasksData.map((v: any) => {
                return (
                  <div className="px-2 py-1 cursor-pointer bg-zinc-500" data-value="nte">{v?.title}</div>
                )
              })}
              <div className="px-2 py-1">
                <div className="bg-zinc-500 w-full h-px"></div>
              </div>
              <div className="px-2 py-1 cursor-pointer flex items-center gap-1">
                <FontAwesomeIcon icon={faPlus} />
                <div>新規追加</div>
              </div>
              {currentTaskData?.title && (
              <div className="px-2 py-1 cursor-pointer text-red-200 flex items-center gap-1">
                <FontAwesomeIcon icon={faTrashCan} />
                <div>{currentTaskData.title} を削除</div>
              </div>
              )}
            </div>
          )}
        </div>
      </div>
  )
}