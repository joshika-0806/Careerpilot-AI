import { categories } from "../data/categories";

/**
 * JobRoleDropDown — Styled job role selector.
 * Props: { value, onChange, disabled }
 */
function JobRoleDropDown({ value, onChange, disabled = false }) {
  return (
    <div className="form-group">
      <label className="form-label" htmlFor="job-role-select">
        🎯 Target Job Role
      </label>
      <select
        id="job-role-select"
        className="select-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
      >
        <option value="">— Select your target role —</option>
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>
    </div>
  );
}

export default JobRoleDropDown;
