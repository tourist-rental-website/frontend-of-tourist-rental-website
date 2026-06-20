// components/SearchBar.jsx
import { Search } from "lucide-react";

const SearchBar = ({ value, onChange, placeholder = "Search..." }) => {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px" }}>
      <Search size={18} />
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={{
          width: "300px",
          padding: "10px",
          borderRadius: "6px",
          border: "1px solid #ccc",
        }}
      />
    </div>
  );
};

export default SearchBar;