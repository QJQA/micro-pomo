import './App.css';
import SimpleFocusManager from './components/SimpleFocusManager';

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 flex flex-col items-center p-4">
      <h1 className="text-2xl font-bold text-gray-500 mb-8 mt-4">Micro-Pomo</h1>
      <SimpleFocusManager />
    </div>
  );
}