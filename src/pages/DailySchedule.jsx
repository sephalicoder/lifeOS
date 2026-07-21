import { useState, useEffect } from 'react'

function playAlarmChime() {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)()
    const osc = audioCtx.createOscillator()
    const gain = audioCtx.createGain()

    osc.type = 'sine'
    osc.frequency.setValueAtTime(587.33, audioCtx.currentTime)
    osc.frequency.setValueAtTime(880, audioCtx.currentTime + 0.15)

    gain.gain.setValueAtTime(0.3, audioCtx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.6)

    osc.connect(gain)
    gain.connect(audioCtx.destination)

    osc.start()
    osc.stop(audioCtx.currentTime + 0.6)
  } catch (err) {
    console.warn('Audio playback not supported:', err)
  }
}

function formatRelativeTime(isoString) {
  if (!isoString) return ''
  const now = new Date()
  const past = new Date(isoString)
  const diffInSecs = Math.floor((now - past) / 1000)

  if (diffInSecs < 60) return 'Just now'
  if (diffInSecs < 3600) return `${Math.floor(diffInSecs / 60)}m ago`
  if (diffInSecs < 86400) return `${Math.floor(diffInSecs / 3600)}h ago`
  return `${Math.floor(diffInSecs / 86400)}d ago`
}

export default function DailySchedule({ store }) {
  const [task, setTask] = useState('')
  const [time, setTime] = useState('09:00')
  const [estimatedHours, setEstimatedHours] = useState(2)
  const [pillar, setPillar] = useState('career')
  const [enableAlarm, setEnableAlarm] = useState(false)
  const [subtasks, setSubtasks] = useState([])
  const [newSubtask, setNewSubtask] = useState('')
  const [actualHoursInput, setActualHoursInput] = useState({})
  const [selectedTaskHistory, setSelectedTaskHistory] = useState(null)

  const schedule = store?.data?.schedule || []
  const activityLog = store?.data?.activityLog || []

  // Check alarm times every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date()
      const currentTimeStr = `${String(now.getHours()).padStart(2, '0')}:${String(
        now.getMinutes()
      ).padStart(2, '0')}`

      schedule.forEach((item) => {
        if (item.time === currentTimeStr && item.enableAlarm && !item.done && !item._alarmFired) {
          playAlarmChime()
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(`⏰ Task Alarm: ${item.task}`, {
              body: `Time block reached (${item.time}) - Est: ${item.estimatedHours}h`
            })
          }

          const updated = schedule.map((t) =>
            (t.id || t._id) === (item.id || item._id) ? { ...t, _alarmFired: true } : t
          )
          store.updatePillar('schedule', updated, `Alarm triggered: "${item.task}"`, {
            taskId: item.id || item._id,
            action: 'ALARM'
          })
        }
      })
    }, 10000)

    return () => clearInterval(interval)
  }, [schedule, store])

  const handleAddSubtask = (e) => {
    e.preventDefault()
    if (!newSubtask.trim()) return
    setSubtasks([...subtasks, { text: newSubtask.trim(), done: false }])
    setNewSubtask('')
  }

  const handleToggleSubtask = (item, subtaskIdx) => {
    const taskId = item.id || item._id
    const updated = schedule.map((t) => {
      if ((t.id || t._id) === taskId && t.subtasks) {
        const newSub = [...t.subtasks]
        newSub[subtaskIdx].done = !newSub[subtaskIdx].done
        return { ...t, subtasks: newSub }
      }
      return t
    })

    const st = item.subtasks[subtaskIdx]
    const status = !st.done ? 'Checked' : 'Unchecked'
    store.updatePillar('schedule', updated, `${status} subtask "${st.text}" in "${item.task}"`, {
      taskId,
      action: 'SUBTASK_TOGGLE'
    })
  }

  const handleAddTask = (e) => {
    e.preventDefault()
    if (!task.trim()) return

    const taskId = Date.now().toString()
    const newTask = {
      id: taskId,
      task: task.trim(),
      time,
      pillar,
      estimatedHours: Number(estimatedHours) || 1,
      actualHours: null,
      enableAlarm,
      subtasks,
      done: false,
      createdAt: new Date().toISOString()
    }

    const updated = [...schedule, newTask].sort((a, b) => a.time.localeCompare(b.time))
    store.updatePillar(
      'schedule',
      updated,
      `Created task "${task.trim()}" (${estimatedHours}h est. @ ${time})`,
      { taskId, action: 'TASK_CREATE', pillar }
    )

    setTask('')
    setSubtasks([])
    setEnableAlarm(false)
  }

  const handleCompleteTask = (item) => {
    const targetId = item.id || item._id
    const actual = Number(actualHoursInput[targetId] || item.estimatedHours)

    const updated = schedule.map((t) => {
      if ((t.id || t._id) === targetId) {
        return {
          ...t,
          done: true,
          actualHours: actual,
          completedAt: new Date().toISOString()
        }
      }
      return t
    })

    const delay = actual - item.estimatedHours
    const delayMsg = delay > 0 ? `(+${delay}h delay)` : `(On time)`
    store.updatePillar(
      'schedule',
      updated,
      `Completed task "${item.task}" in ${actual}h ${delayMsg}`,
      { taskId: targetId, action: 'TASK_COMPLETE', pillar: item.pillar }
    )
  }

  const handleDeleteTask = (item) => {
    const targetId = item.id || item._id
    const updated = schedule.filter((t) => (t.id || t._id) !== targetId)
    store.updatePillar('schedule', updated, `Deleted task "${item.task}"`, {
      taskId: targetId,
      action: 'TASK_DELETE'
    })
  }

  // Filter global activity log for task-specific events
  const getTaskHistory = (taskId) => {
    return activityLog.filter(
      (log) => log.taskId === taskId || (log.message && log.message.includes(taskId))
    )
  }

  const totalEstHours = schedule.reduce((acc, curr) => acc + (curr.estimatedHours || 0), 0)
  const totalActualHours = schedule
    .filter((t) => t.done)
    .reduce((acc, curr) => acc + (curr.actualHours || curr.estimatedHours || 0), 0)

  return (
    <div className="animate-fade-in space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Daily Schedule & Task History</h1>
          <p className="text-txt-3 text-sm">Detailed timeline & audit logs for every scheduled task.</p>
        </div>

        <div className="flex gap-3 shrink-0">
          <div className="bg-bg-2 border border-gray-800 px-4 py-2 rounded-xl text-right">
            <p className="text-[10px] uppercase font-mono text-txt-3">Planned Est.</p>
            <p className="text-sm font-bold text-blue-400 font-mono">{totalEstHours} hrs</p>
          </div>
          <div className="bg-bg-2 border border-gray-800 px-4 py-2 rounded-xl text-right">
            <p className="text-[10px] uppercase font-mono text-txt-3">Actual Spent</p>
            <p className={`text-sm font-bold font-mono ${totalActualHours > totalEstHours ? 'text-red-400' : 'text-emerald-400'}`}>
              {totalActualHours} hrs
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleAddTask} className="bg-bg-2 p-5 rounded-xl border border-gray-800 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="sm:col-span-2 bg-bg-1 border border-gray-700 px-3 py-2 rounded-lg text-white text-sm font-mono"
            required
          />
          <input
            type="text"
            placeholder="What are you working on?"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            className="sm:col-span-5 bg-bg-1 border border-gray-700 px-4 py-2 rounded-lg text-white focus:outline-none focus:border-blue-500 text-sm"
            required
          />
          <select
            value={pillar}
            onChange={(e) => setPillar(e.target.value)}
            className="sm:col-span-3 bg-bg-1 border border-gray-700 px-3 py-2 rounded-lg text-white text-sm capitalize"
          >
            <option value="career">Career</option>
            <option value="health">Health</option>
            <option value="relationships">Relationships</option>
            <option value="money">Money</option>
          </select>
          <div className="sm:col-span-2 flex items-center gap-1.5 bg-bg-1 border border-gray-700 px-3 py-2 rounded-lg">
            <span className="text-[11px] text-txt-3 shrink-0">Est:</span>
            <input
              type="number"
              step="0.5"
              min="0.5"
              value={estimatedHours}
              onChange={(e) => setEstimatedHours(e.target.value)}
              className="w-full bg-transparent text-white text-sm font-mono focus:outline-none"
            />
            <span className="text-xs text-txt-3">h</span>
          </div>
        </div>

        {/* Subtask Input */}
        <div className="space-y-2 pt-1">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Add checklist subtask..."
              value={newSubtask}
              onChange={(e) => setNewSubtask(e.target.value)}
              className="flex-1 bg-bg-1 border border-gray-700 px-3 py-1.5 rounded-lg text-white text-xs"
            />
            <button
              type="button"
              onClick={handleAddSubtask}
              className="bg-gray-800 hover:bg-gray-700 text-white text-xs px-3 py-1.5 rounded-lg border border-gray-700"
            >
              + Add Subtask
            </button>
          </div>

          {subtasks.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {subtasks.map((st, idx) => (
                <span key={idx} className="text-xs bg-bg-1 px-2.5 py-1 rounded border border-gray-800 text-txt-2">
                  ✓ {st.text}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-2">
          <label className="flex items-center gap-2 cursor-pointer text-xs text-txt-2 select-none">
            <input
              type="checkbox"
              checked={enableAlarm}
              onChange={(e) => setEnableAlarm(e.target.checked)}
              className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
            />
            🔔 Enable Alarm
          </label>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg text-sm transition"
          >
            Add Task
          </button>
        </div>
      </form>

      {/* Main Grid: Schedule List + Task Timeline Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Task List */}
        <div className="lg:col-span-2 space-y-3">
          <p className="card-label">SCHEDULED TIME BLOCKS</p>

          {schedule.length === 0 ? (
            <div className="bg-bg-2 border border-gray-800 rounded-xl p-8 text-center text-txt-3 text-sm">
              No tasks added today.
            </div>
          ) : (
            schedule.map((item) => {
              const taskId = item.id || item._id
              const delay = (item.actualHours || 0) - item.estimatedHours

              return (
                <div
                  key={taskId}
                  className={`bg-bg-2 border border-gray-800 p-4 rounded-xl space-y-3 transition ${
                    item.done ? 'opacity-70 bg-bg-2/60' : ''
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs text-accent bg-bg-1 px-2.5 py-1 rounded border border-gray-800 shrink-0">
                        {item.time}
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-medium ${item.done ? 'line-through text-txt-3' : 'text-white'}`}>
                            {item.task}
                          </span>
                          <span className="text-[9px] uppercase font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                            {item.pillar}
                          </span>
                        </div>
                        <p className="text-xs text-txt-3 mt-0.5 font-mono">
                          Est: {item.estimatedHours}h
                          {item.done && (
                            <>
                              {' '}| Act: <span className="text-white">{item.actualHours}h</span>
                              {delay > 0 ? (
                                <span className="text-red-400 font-semibold ml-1.5">(+{delay}h delay)</span>
                              ) : (
                                <span className="text-emerald-400 font-semibold ml-1.5">(On time)</span>
                              )}
                            </>
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {!item.done && (
                        <>
                          <input
                            type="number"
                            step="0.5"
                            placeholder="Actual hrs"
                            onChange={(e) =>
                              setActualHoursInput({ ...actualHoursInput, [taskId]: e.target.value })
                            }
                            className="w-20 bg-bg-1 border border-gray-700 px-2 py-1 rounded text-xs text-white font-mono"
                          />
                          <button
                            onClick={() => handleCompleteTask(item)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-3 py-1.5 rounded-lg font-medium"
                          >
                            Complete
                          </button>
                        </>
                      )}

                      {/* View Individual Task History Button */}
                      <button
                        onClick={() => setSelectedTaskHistory(item)}
                        className="text-xs text-blue-400 hover:underline bg-blue-500/10 px-2.5 py-1 rounded border border-blue-500/20"
                      >
                        📜 Timeline
                      </button>

                      <button
                        onClick={() => handleDeleteTask(item)}
                        className="text-red-400 hover:text-red-300 text-xs px-1"
                      >
                        ✕
                      </button>
                    </div>
                  </div>

                  {/* Sub-Checklist Display */}
                  {item.subtasks && item.subtasks.length > 0 && (
                    <div className="pl-11 space-y-1.5 pt-1 border-t border-gray-800/60">
                      {item.subtasks.map((st, idx) => (
                        <label key={idx} className="flex items-center gap-2 text-xs text-txt-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={st.done || false}
                            onChange={() => handleToggleSubtask(item, idx)}
                            className="w-3.5 h-3.5 rounded accent-blue-600"
                          />
                          <span className={st.done ? 'line-through text-txt-3' : ''}>{st.text}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              )
            })
          )}
        </div>

        {/* Individual Task Timeline Panel */}
        <div className="card space-y-4 h-fit">
          <div className="flex justify-between items-center border-b border-gray-800 pb-3">
            <div>
              <p className="card-label mb-0">TASK EVENT LOG & HISTORY</p>
              <p className="text-xs text-txt-3">
                {selectedTaskHistory
                  ? `History for "${selectedTaskHistory.task}"`
                  : 'Select a task timeline'}
              </p>
            </div>
            {selectedTaskHistory && (
              <button
                onClick={() => setSelectedTaskHistory(null)}
                className="text-xs text-txt-3 hover:text-white"
              >
                Clear
              </button>
            )}
          </div>

          <div className="space-y-3 max-h-[450px] overflow-y-auto pr-1">
            {selectedTaskHistory ? (
              getTaskHistory(selectedTaskHistory.id || selectedTaskHistory._id).length === 0 ? (
                <p className="text-xs text-txt-3 italic py-4 text-center">
                  No explicit history entries logged for this task yet.
                </p>
              ) : (
                getTaskHistory(selectedTaskHistory.id || selectedTaskHistory._id).map((log, idx) => (
                  <div key={idx} className="border-l-2 border-blue-500 pl-3 py-1 space-y-0.5">
                    <p className="text-xs text-white font-medium">{log.message}</p>
                    <p className="text-[10px] text-txt-3 font-mono">
                      {formatRelativeTime(log.timestamp)}
                    </p>
                  </div>
                ))
              )
            ) : (
              <div className="space-y-3">
                <p className="text-xs text-txt-3 mb-2">Global Recent Task Updates:</p>
                {activityLog.slice(0, 10).map((log, idx) => (
                  <div key={idx} className="border-l-2 border-gray-700 pl-3 py-1 space-y-0.5">
                    <p className="text-xs text-txt-2">{log.message}</p>
                    <p className="text-[10px] text-txt-3 font-mono">
                      {formatRelativeTime(log.timestamp)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}