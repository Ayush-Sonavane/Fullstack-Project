import { useState } from 'react';
import { HiStar } from 'react-icons/hi';

/**
 * Interactive star rating component.
 * Props:
 *  - value: current rating (1-5)
 *  - onChange: callback when rating changes (null = read-only)
 *  - size: 'sm' | 'md' | 'lg'
 */
const StarRating = ({ value = 0, onChange, size = 'md' }) => {
  const [hoverValue, setHoverValue] = useState(0);

  const isInteractive = !!onChange;

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-7 h-7',
  };

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => {
        const isFilled = star <= (hoverValue || value);
        return (
          <button
            key={star}
            type="button"
            disabled={!isInteractive}
            onClick={() => isInteractive && onChange(star)}
            onMouseEnter={() => isInteractive && setHoverValue(star)}
            onMouseLeave={() => isInteractive && setHoverValue(0)}
            className={`
              ${isInteractive ? 'cursor-pointer hover:scale-115 active:scale-95' : 'cursor-default'}
              transition-transform duration-200 bg-transparent border-0 p-0 flex items-center justify-center outline-none
            `}
          >
            <HiStar
              className={`
                ${sizeClasses[size]}
                transition-colors duration-200
                ${isFilled 
                  ? 'text-star-filled drop-shadow-[0_1px_3px_rgba(251,191,36,0.3)]' 
                  : 'text-star-empty'
                }
              `}
            />
          </button>
        );
      })}
      {value > 0 && (
        <span className="ml-2 text-sm font-bold text-surface-600 font-display">
          {typeof value === 'number' ? (value.toFixed ? Number(value).toFixed(1) : value) : value}
        </span>
      )}
    </div>
  );
};

export default StarRating;
