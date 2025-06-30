// import React from "react";

// export default function SelectField({
//   value,
//   setValue,
//   options = [],
//   placeholder = "Select an option",
//   required = false,
//   disabled = false,
//   theme = "default", // "default", "admin", "dark"
// }) {
//   const getThemeClasses = () => {
//     switch (theme) {
//       case "admin":
//         return {
//           select:
//             "w-full px-4 py-4 bg-white/5 border border-white/20 rounded-xl text-white focus:outline-none focus:border-red-400/60 focus:bg-white/10 transition-all duration-300 appearance-none",
//           option: "bg-slate-800 text-white",
//         };
//       case "dark":
//         return {
//           select:
//             "w-full px-4 py-4 bg-gray-800/50 border border-gray-600/50 rounded-xl text-white focus:outline-none focus:border-blue-400/60 focus:bg-gray-800/70 transition-all duration-300 appearance-none",
//           option: "bg-gray-800 text-white",
//         };
//       default:
//         return {
//           select:
//             "w-full px-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-white/40 focus:bg-white/15 transition-all duration-300 appearance-none",
//           option: "bg-slate-800 text-white",
//         };
//     }
//   };

//   const classes = getThemeClasses();

//   return (
//     <div className="relative">
//       <select
//         value={value}
//         onChange={(e) => setValue(e.target.value)}
//         className={classes.select}
//         required={required}
//         disabled={disabled}
//       >
//         <option value="" className={classes.option}>
//           {placeholder}
//         </option>
//         {options.map((option) => (
//           <option
//             key={option.value}
//             value={option.value}
//             className={classes.option}
//           >
//             {option.label}
//           </option>
//         ))}
//       </select>

//       {/* Custom dropdown arrow */}
//       <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
//         <svg
//           className="w-5 h-5 text-white/60"
//           fill="none"
//           stroke="currentColor"
//           viewBox="0 0 24 24"
//         >
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             strokeWidth={2}
//             d="M19 9l-7 7-7-7"
//           />
//         </svg>
//       </div>
//     </div>
//   );
// }



// SelectField.jsx
export default function SelectField({
  value,
  setValue,
  options = [],
  placeholder = "Select an option",
  required = false,
  disabled = false,
  theme = "default",
}) {
  const getThemeClasses = () => {
    switch (theme) {
      case "admin":
        return {
          select:
            "w-full h-13 px-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/70 focus:outline-none focus:border-red-400 focus:bg-white/20 transition-all duration-300 appearance-none",
          option: "bg-slate-800 text-white",
        };
      case "dark":
        return {
          select:
            "w-full h-13 px-4 py-4 bg-gray-800/50 border border-gray-600/50 rounded-xl text-white focus:outline-none focus:border-blue-400 focus:bg-gray-800/70 transition-all duration-300 appearance-none",
          option: "bg-gray-800 text-white",
        };
      default:
        return {
          select:
            "w-full h-13 py-2 px-4 bg-white/10 border border-white/30 rounded-xl text-white placeholder-white/70 focus:outline-none focus:border-blue-400 focus:bg-white/20 transition-all duration-300 appearance-none",
          option: "bg-slate-800 text-white",
        };
    }
  };

  const classes = getThemeClasses();

  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className={classes.select}
        required={required}
        disabled={disabled}
      >
        <option value="" disabled className={classes.option}>
          {placeholder}
        </option>
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            className={classes.option}
          >
            {option.label}
          </option>
        ))}
      </select>

      {/* Dropdown arrow */}
      <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
        <svg
          className="w-5 h-5 text-white/70"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
    </div>
  );
}
