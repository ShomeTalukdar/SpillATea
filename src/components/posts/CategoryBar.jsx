import React from 'react';

const CATEGORIES = [
  'All',
  'Confessions',
  'College Life',
  'Academics',
  'Relationships',
  'Rants',
  'Memes and Fun',
  'Advice'
];

export default function CategoryBar({ selectedCategory, onSelectCategory }) {
  return (
    <div className="w-full overflow-x-auto scrollbar-none py-1 flex items-center gap-2 select-none border-b border-[#2A2A2F] pb-3 mb-4">
      {CATEGORIES.map((cat) => {
        const isSelected = selectedCategory.toLowerCase() === cat.toLowerCase();
        return (
          <button
            key={cat}
            onClick={() => onSelectCategory(cat === 'All' ? 'all' : cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 transition-smooth cursor-pointer ${
              isSelected
                ? 'bg-[#1C1C20] text-[#F0F0F2] border border-[#F07845]'
                : 'bg-[#151518] text-[#A0A0A8] border border-[#2A2A2F] hover:text-[#F0F0F2] hover:border-[#3A3A42]'
            }`}
          >
            {cat}
          </button>
        );
      })}
    </div>
  );
}
