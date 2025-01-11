export const CreditOption = ({ credits, price, isSelected, onSelect }) => (
    <div 
      className={`bg-white rounded-lg shadow-md p-6 flex flex-col items-center space-y-3 transition-all duration-200
        ${isSelected ? 'ring-2 ring-purple-600 shadow-lg scale-105' : 'hover:shadow-lg'}`}
    >
      <div className="text-2xl font-bold">{credits}</div>
      <div className="text-gray-600">Credits</div>
      <button 
        onClick={() => onSelect({ credits, price })}
        className={`transition-colors px-6 py-2 rounded-md w-full
          ${isSelected 
            ? 'bg-purple-700 hover:bg-purple-800 text-white' 
            : 'bg-purple-600 hover:bg-purple-700 text-white'}`}
      >
        {isSelected ? 'Selected' : 'Select'}
      </button>
      <div className="text-gray-900">${price}</div>
    </div>
  );
  