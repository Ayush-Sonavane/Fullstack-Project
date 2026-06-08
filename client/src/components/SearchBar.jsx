import { HiOutlineSearch } from 'react-icons/hi';

/**
 * Search/filter bar with optional additional filter inputs.
 */
const SearchBar = ({ value, onChange, placeholder = 'Search...', children }) => {
  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-6">
      <div className="relative flex-1">
        <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-500" />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="input-field pl-10"
        />
      </div>
      {children}
    </div>
  );
};

export default SearchBar;
