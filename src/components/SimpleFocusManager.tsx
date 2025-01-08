import React, { useState, useEffect, KeyboardEvent, ChangeEvent } from 'react';
import { Play, Pause, RotateCcw, CheckCircle, Circle, Plus, List, Timer, ChevronDown, ChevronRight } from 'lucide-react';

// 定义任务类型接口
interface Task {
  id: string;
  text: string;
  timestamp: string;
  completed: boolean;
}

const TomatoIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 21.5C16.6944 21.5 20.5 17.6944 20.5 13C20.5 8.30558 16.6944 4.5 12 4.5C7.30558 4.5 3.5 8.30558 3.5 13C3.5 17.6944 7.30558 21.5 12 21.5Z" fill="#ff6b6b"/>
    <path d="M12 7C13.1046 7 14 6.10457 14 5C14 3.89543 13.1046 3 12 3C10.8954 3 10 3.89543 10 5C10 6.10457 10.8954 7 12 7Z" fill="#4cd963"/>
  </svg>
);

const SimpleFocusManager: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState<number>(25 * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [currentTask, setCurrentTask] = useState<string>('');
  const [completedSessions, setCompletedSessions] = useState<number>(0);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [dailyGoal] = useState<number>(10);
  const [currentTaskId, setCurrentTaskId] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState<boolean>(false);
  const [showPreviousDays, setShowPreviousDays] = useState<boolean>(false);

  // 示例历史数据
  const previousTasks: Task[] = [
    { id: '1', text: '写产品文档', timestamp: '09:30:00', completed: true },
    { id: '2', text: '团队会议', timestamp: '14:20:00', completed: true },
  ];

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    let timer: number | undefined;
    if (isRunning && timeLeft > 0) {
      timer = window.setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsRunning(false);
            setCompletedSessions(prev => prev + 1);
            setTasks(prev => prev.map(task => 
              task.id === currentTaskId 
                ? { ...task, completed: true }
                : task
            ));
            setCurrentTaskId(null);
            return 25 * 60;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRunning, currentTaskId]);

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const submitTaskAndStart = () => {
    if (!currentTask.trim()) {
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
      return;
    }

    if (completedSessions >= dailyGoal) {
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
      return;
    }

    const newTaskId = Date.now().toString();
    setTasks(prev => [...prev, {
      id: newTaskId,
      text: currentTask,
      timestamp: new Date().toLocaleTimeString(),
      completed: false
    }]);
    setCurrentTaskId(newTaskId);
    setCurrentTask('');
    setIsRunning(true);
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      submitTaskAndStart();
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCurrentTask(e.target.value);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(25 * 60);
  };

  return (
    <div className="w-96 p-6 space-y-6 bg-white rounded-xl shadow-lg">
      {showAlert && (
        <div className="p-4 mb-4 text-red-700 bg-red-100 rounded-lg">
          {!currentTask.trim() 
            ? "请先填写当前任务"
            : "今日番茄数已达上限，请注意休息"}
        </div>
      )}

      <div className="text-center space-y-4">
        <div className="text-6xl font-mono font-bold text-red-500">
          {formatTime(timeLeft)}
        </div>
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={currentTask}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder="输入当前专注的任务..."
          className="flex-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-red-500"
          disabled={isRunning}
        />
        <button 
          onClick={submitTaskAndStart}
          disabled={isRunning}
          className="p-2 bg-red-500 hover:bg-red-600 text-white rounded disabled:opacity-50"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      <div className="flex justify-center gap-2">
        <button 
          onClick={toggleTimer}
          className="p-2 bg-red-500 hover:bg-red-600 text-white rounded"
        >
          {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>
        <button 
          onClick={resetTimer}
          className="p-2 border border-gray-300 hover:bg-gray-100 rounded"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {currentTaskId && (
        <div className="border-l-4 border-l-red-500 bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Timer className="w-4 h-4 text-red-500 animate-pulse" />
              <span className="text-gray-700 font-medium">
                {tasks.find(task => task.id === currentTaskId)?.text}
              </span>
            </div>
            {isRunning ? (
              <span className="text-xs text-red-500">专注中</span>
            ) : (
              <span className="text-xs text-gray-500">已暂停</span>
            )}
          </div>
        </div>
      )}

      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-600">今日完成</span>
          <span className="text-gray-600">{completedSessions}/{dailyGoal} 个番茄</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: dailyGoal }).map((_, i) => (
            i < completedSessions ? 
              <CheckCircle key={i} className="w-5 h-5 text-red-500" /> :
              <Circle key={i} className="w-5 h-5 text-gray-300" />
          ))}
        </div>
      </div>

      {completedSessions > 0 && completedSessions % 4 === 0 && (
        <div className="text-sm text-blue-600 text-center">
          建议休息一下 (15-20分钟) ☕️
        </div>
      )}

      <button 
        onClick={() => setShowHistory(!showHistory)}
        className="w-full p-2 border border-gray-300 rounded flex items-center justify-center gap-2 hover:bg-gray-50"
      >
        <List className="w-4 h-4" />
        查看任务历史
      </button>

      {showHistory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-lg w-full m-4 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">任务历史</h2>
              <button 
                onClick={() => setShowHistory(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-medium text-gray-700">今日已完成</h3>
                <div className="space-y-2">
                  {tasks.filter(task => task.completed).map((task) => (
                    <div key={task.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <div className="flex items-center gap-2">
                        <span>{task.text}</span>
                        <TomatoIcon />
                      </div>
                      <span className="text-sm text-gray-500">{task.timestamp}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <div 
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => setShowPreviousDays(!showPreviousDays)}
                >
                  <h3 className="font-medium text-gray-700">历史任务</h3>
                  {showPreviousDays ? 
                    <ChevronDown className="w-4 h-4 text-gray-500" /> : 
                    <ChevronRight className="w-4 h-4 text-gray-500" />
                  }
                </div>
                {showPreviousDays && (
                  <div className="space-y-2">
                    {previousTasks.map((task) => (
                      <div key={task.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <div className="flex items-center gap-2">
                          <span>{task.text}</span>
                          <TomatoIcon />
                        </div>
                        <span className="text-sm text-gray-500">{task.timestamp}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SimpleFocusManager;