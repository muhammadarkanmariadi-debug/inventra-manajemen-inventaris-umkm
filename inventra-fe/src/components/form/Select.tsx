import React from "react";
import ReactSelect from "react-select";

interface Option {
  value: string;
  label: string;
}

interface SelectProps {
  options: Option[];
  placeholder?: string;
  onChange: (value: any) => void;
  className?: string;
  defaultValue?: any;
  value?: any;
  isSearchable?: boolean;
  isMulti?: boolean;
}

const Select: React.FC<SelectProps> = ({
  options,
  placeholder = "Select an option",
  onChange,
  className = "",
  defaultValue = "",
  value,
  isSearchable = false,
  isMulti = false,
}) => {
  // Manage the selected value
  const [selectedValue, setSelectedValue] = React.useState<any>(value ?? defaultValue);

  React.useEffect(() => {
    if (value !== undefined) {
      setSelectedValue(value);
    }
  }, [value]);

  const handleChange = (selectedOption: any) => {
    if (isMulti) {
      const val = selectedOption ? selectedOption.map((opt: any) => opt.value) : [];
      setSelectedValue(val);
      onChange(val);
    } else {
      const val = selectedOption ? selectedOption.value : "";
      setSelectedValue(val);
      onChange(val);
    }
  };

  const selectedOptionObj = isMulti
    ? options.filter((opt) => Array.isArray(selectedValue) && selectedValue.includes(opt.value))
    : options.find((opt) => opt.value === selectedValue) || null;

  return (
    <div className={`w-full ${className}`}>
      <ReactSelect
        options={options}
        placeholder={placeholder}
        value={selectedOptionObj}
        onChange={handleChange}
        isSearchable={isSearchable}
        isMulti={isMulti}
        unstyled
        classNames={{
          control: (state) =>
            `w-full bg-white dark:bg-gray-900 border rounded-lg px-4 min-h-[44px] text-sm shadow-theme-xs transition-colors ${
              state.isFocused
                ? "border-brand-300 ring-3 ring-brand-500/10 dark:border-brand-800"
                : "border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600"
            }`,
          menu: () =>
            "bg-white dark:bg-gray-800 mt-2 rounded-lg border border-gray-200 dark:border-gray-700 shadow-lg overflow-hidden py-1 z-50",
          option: (state) =>
            `px-4 py-2.5 text-sm cursor-pointer ${
              state.isSelected
                ? "bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300 font-medium"
                : state.isFocused
                ? "bg-gray-50 text-gray-900 dark:bg-gray-700/50 dark:text-gray-100"
                : "text-gray-700 dark:text-gray-300"
            }`,
          singleValue: () => "text-gray-800 dark:text-gray-100",
          placeholder: () => "text-gray-400 dark:text-gray-500",
          input: () => "text-gray-800 dark:text-gray-100 outline-none border-none",
          valueContainer: () => "flex gap-1 py-1",
          indicatorsContainer: () => "flex gap-1 items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300",
          indicatorSeparator: () => "hidden",
          multiValue: () => "bg-gray-100 dark:bg-gray-800 rounded-md flex items-center shadow-sm border border-gray-200 dark:border-gray-700 m-1",
          multiValueLabel: () => "text-xs px-2 py-1 text-gray-700 dark:text-gray-300 font-medium",
          multiValueRemove: () => "hover:bg-red-100 hover:text-red-800 text-gray-500 rounded-r-md px-1 py-1 cursor-pointer transition-colors",
        }}
        styles={{
          input: (base) => ({
            ...base,
            "input:focus": {
              boxShadow: "none",
            },
          }),
        }}
      />
    </div>
  );
};

export default Select;
