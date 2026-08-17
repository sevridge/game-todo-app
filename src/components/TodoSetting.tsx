import { ChangeEvent, useRef, useState } from "react";

export default function TodoSetting({gameTitle, label, setTodoSettingIsOpen, addNewTask}: {gameTitle?: string, label?: string, setTodoSettingIsOpen?: React.Dispatch<React.SetStateAction<boolean>>, addNewTask: (label: string, resetTime: string, resetTimeStatus: { time: number, week?: string, day?: number}, priority: string) => void}) {
  const [ resetTimeStatus, setResetTimeStatus ] = useState<string|null>(null);
  const labelRef = useRef<HTMLInputElement>(null);
  const resetTimeRef = useRef<HTMLSelectElement>(null);
  const resetTimeTimeRef = useRef<HTMLInputElement>(null);
  const resetTimeWeekRef = useRef<HTMLSelectElement>(null);
  const resetTimeDayRef = useRef<HTMLInputElement>(null);
  const priorityRef = useRef<HTMLSelectElement>(null);

  function resetTimeOnChange(e: ChangeEvent<HTMLSelectElement>) {
    const type = e.target.value;
    setResetTimeStatus(type);
  }

  function saveTaskInput() {
    const label = labelRef.current?.value;
    const resetTime = resetTimeRef.current?.value;
    const resetTimeTime = resetTimeTimeRef.current?.value;
    const resetTimeWeek = resetTimeWeekRef.current?.value;
    const resetTimeDay = resetTimeDayRef.current?.value;
    const priority = priorityRef.current?.value;
    if (!label || !resetTime || !priority || !resetTimeTime) return;
    if ((resetTimeStatus === 'weekly' || resetTimeStatus === 'every-week') && !resetTimeWeek) return;
    if (resetTimeStatus === 'monthly' && !resetTimeDay) return;
    addNewTask(label, resetTime, {time: Number(resetTimeTime), week: resetTimeWeek, day: resetTimeDay ? (Number(resetTimeDay)) : undefined}, priority);
  }

  return (
    <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center backdrop-blur-xs z-100">
      <div className="p-3 rounded-md text-white bg-zinc-700 flex flex-col items-center">
        <div className="text-xl">{gameTitle || 'ゲーム未選択'}</div>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <div className="whitespace-nowrap">Label: </div>
            <input ref={labelRef} className="outline-none px-2 py-1 rounded-md w-full bg-white/10" type="text" value={label} />
          </div>
          <div className="flex items-center gap-2">
            <div className="whitespace-nowrap">更新頻度: </div>
            <select ref={resetTimeRef} className="outline-none px-2 py-1 rounded-md bg-white/10" onChange={resetTimeOnChange}>
              <option className="bg-zinc-600" value="none">タスクの更新頻度を選択...</option>
              <option className="bg-zinc-600" value="daily">毎日</option>
              <option className="bg-zinc-600" value="weekly">毎週</option>
              <option className="bg-zinc-600" value="monthly">毎月</option>
              <option className="bg-zinc-600" value="every-week">隔週</option>
            </select>
          </div>
          {(resetTimeStatus && resetTimeStatus !== 'none') && (
            <div className="flex flex-col text-xs items-center gap-2 pl-3">
              <div className="text-sm">更新頻度詳細</div>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <input ref={resetTimeTimeRef} className="outline-none px-2 py-1 rounded-md bg-white/10" type="number" min="0" max="23" defaultValue="5" />
                  <div>時</div>
                </div>
                {(resetTimeStatus === 'weekly' || resetTimeStatus === 'every-week') && (
                  <div className="flex items-center gap-2">
                    <select ref={resetTimeWeekRef} className="outline-none px-2 py-1 rounded-md bg-white/10" defaultValue="1">
                      <option className="bg-zinc-600" value="0">日曜日</option>
                      <option className="bg-zinc-600" value="1">月曜日</option>
                      <option className="bg-zinc-600" value="2">火曜日</option>
                      <option className="bg-zinc-600" value="3">水曜日</option>
                      <option className="bg-zinc-600" value="4">木曜日</option>
                      <option className="bg-zinc-600" value="5">金曜日</option>
                      <option className="bg-zinc-600" value="6">土曜日</option>
                    </select>
                  </div>
                )}
                {resetTimeStatus === 'monthly' && (
                  <div className="flex items-center gap-2">
                    <input ref={resetTimeDayRef} className="outline-none px-2 py-1 rounded-md bg-white/10" type="number" min="1" max="31" defaultValue="1" />
                    <div>日</div>
                  </div>
                )}
              </div>
            </div>
          )}
          <div className="flex items-center gap-2">
            <div className="whitespace-nowrap">優先度: </div>
            <select ref={priorityRef} className="outline-none px-2 py-1 rounded-md bg-white/10">
              <option className="bg-zinc-600" value="high">高い</option>
              <option className="bg-zinc-600" value="medium">標準</option>
              <option className="bg-zinc-600" value="low">低い</option>
            </select>
          </div>
          <button className="p-1 rounded-md cursor-pointer bg-white/10" onClick={saveTaskInput}>保存</button>
          <button className="p-1 rounded-md cursor-pointer text-sm bg-red-500/50" onClick={() => setTodoSettingIsOpen?.(false)}>キャンセル</button>
        </div>
      </div>
    </div>
  )
}