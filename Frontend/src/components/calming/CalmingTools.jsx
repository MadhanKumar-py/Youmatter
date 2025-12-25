import { useNavigate } from 'react-router-dom';
import Button from '../Button';

function CalmingTools() {
  const navigate = useNavigate();

  const tools = [
    {
      title: 'Breathing Exercise',
      description: 'Guided 4-2-6 breathing with animated circle',
      icon: '🫁',
      path: '/calming/breathing',
      color: 'bg-blue-50 border-blue-200'
    },
    {
      title: 'Ambient Sounds',
      description: 'Rain and nature sounds to help you relax',
      icon: '🌧️',
      path: '/calming/ambient',
      color: 'bg-green-50 border-green-200'
    },
    {
      title: 'Grounding Exercise',
      description: '5-4-3-2-1 sensory awareness technique',
      icon: '🧘',
      path: '/calming/grounding',
      color: 'bg-purple-50 border-purple-200'
    }
  ];

  return (
    <div className="min-h-screen bg-green-50/30 py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-semibold text-darkGreen text-center mb-4">
          Calming Tools
        </h1>
        <p className="text-center text-gray-600 mb-10">
          Choose a tool to help you find calm and clarity
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tools.map((tool) => (
            <div
              key={tool.path}
              className={`${tool.color} border-2 rounded-xl p-6 cursor-pointer hover:shadow-lg transition-all`}
              onClick={() => navigate(tool.path)}
            >
              <div className="text-5xl mb-4 text-center">{tool.icon}</div>
              <h2 className="text-xl font-semibold text-darkGreen mb-2 text-center">
                {tool.title}
              </h2>
              <p className="text-sm text-gray-600 text-center mb-4">
                {tool.description}
              </p>
              <Button
                text="Start →"
                class="w-full py-2 bg-darkGreen text-white rounded-lg hover:bg-neutralGray"
                click={() => navigate(tool.path)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CalmingTools;
