import { faTrashCan } from "@fortawesome/free-regular-svg-icons";
import { faCaretDown, faCaretRight, faCheck, faPlus, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef, useState } from "react"
import { randomString } from "../utils/string";

export default function GameSelector({regGames, setRegGames}: {regGames?: StoreGame[], setRegGames?: React.Dispatch<React.SetStateAction<StoreGame[] | null>>}) {
  const [ isOpen, setIsOpen ] = useState<boolean>(false);
  const [ currentTaskData, setCurrentTaskData ] = useState<any>(null);
  const [ inputGameIsOpen, setInputGameIsOpen ] = useState<boolean>(false);

  useEffect(() => {
    if (!regGames?.[0]) return;
    setCurrentTaskData(regGames[0]);
  }, [])

  useEffect(() => {
    if (!regGames?.[0]) return;
    setCurrentTaskData(regGames[regGames.length - 1]);
  }, [regGames])

  function InputGame() {
    const inputGameRef = useRef<HTMLInputElement|null>(null);
    const [ isMissingValue, setIsMissingValue ] = useState<boolean>(false);

    function confirmInputValue() {
      const value = inputGameRef.current?.value;
      if (!value) {
        setIsMissingValue(true);
        return;
      }
      setIsMissingValue(true);
      setInputGameIsOpen(false);

      setRegGames?.(prev => {
        const newPrev = prev ? [...prev] : [];
        newPrev.push({
          id: randomString(8),
          title: value
        })

        // TODO: Storeに保存する

        return newPrev;
      })
    }

    return (
      <div className="absolute w-full h-full top-0 left-0 flex items-center justify-center backdrop-blur-xs">
        <div className="p-2 rounded-md bg-zinc-700">
          <input ref={inputGameRef} type="text" className="outline-none p-1 w-60 bg-zinc-600" />
          {isMissingValue && <div className="text-center text-xs text-red-400">空欄以外の文字を入力してください</div>}
          <div className="w-full flex justify-end pt-2 gap-2">
            <button className="flex items-center justify-center p-1 aspect-square rounded-full cursor-pointer bg-red-400/50" onClick={() => setInputGameIsOpen(false)}>
              <FontAwesomeIcon icon={faXmark} className="text-xs" />
            </button>
            <button className="flex items-center justify-center p-1 aspect-square rounded-full cursor-pointer bg-green-400/50" onClick={confirmInputValue}>
              <FontAwesomeIcon icon={faCheck} className="text-xs" />
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="w-full flex justify-center text-sm select-none">
        <div className="relative flex flex-col items-center">
          <div className="flex items-center justify-center px-2 py-1 border-b border-white" onClick={() => setIsOpen(prev => !prev)}>
            <div>{currentTaskData?.title || 'ゲーム'}</div>
            {isOpen ? <FontAwesomeIcon icon={faCaretDown} /> : <FontAwesomeIcon icon={faCaretRight} />}
          </div>
          {isOpen && (
            <div className="absolute top-full rounded-md overflow-hidden bg-zinc-700 whitespace-nowrap">
              <div className="px-2 py-1 text-xs text-zinc-400">ゲーム</div>
              {regGames?.[0] && regGames.map((v) => {
                return (
                  <div key={v.id} className="px-2 py-1 cursor-pointer" data-value={v.id}>{v.title}</div>
                )
              })}
              <div className="px-2 py-1">
                <div className="bg-zinc-500 w-full h-px"></div>
              </div>
              <div className="px-2 py-1 cursor-pointer flex items-center gap-1" onClick={() => {setInputGameIsOpen(true); setIsOpen(false);}}>
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
      {inputGameIsOpen && <InputGame />}
    </>
  )
}