// import React from "react";

// export default function InputField({
//   type = "text",
//   value,
//   setValue,
//   placeholder,
//   icon: Icon,
//   required = false,
//   disabled = false,
//   theme = "default", // "default", "admin", "dark"
// }) {
//   const getThemeClasses = () => {
//     switch (theme) {
//       case "admin":
//         return {
//           container: "relative",
//           input:
//             "w-full px-4 py-4 pl-12 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:border-red-400/60 focus:bg-white/10 transition-all duration-300",
//           icon: "absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60",
//         };
//       case "dark":
//         return {
//           container: "relative",
//           input:
//             "w-full px-4 py-4 pl-12 bg-gray-800/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-400/60 focus:bg-gray-800/70 transition-all duration-300",
//           icon: "absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400",
//         };
//       default:
//         return {
//           container: "relative",
//           input:
//             "w-full px-4 py-4 pl-12 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:border-white/40 focus:bg-white/15 transition-all duration-300",
//           icon: "absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60",
//         };
//     }
//   };

//   const classes = getThemeClasses();

//   return (
//     <div className={classes.container}>
//       {Icon && <Icon className={classes.icon} />}
//       <input
//         type={type}
//         value={value}
//         onChange={(e) => setValue(e.target.value)}
//         className={classes.input}
//         placeholder={placeholder}
//         required={required}
//         disabled={disabled}
//       />
//     </div>
//   );
// }



// InputField.jsx
export default function InputField({
  type = "text",
  value,
  setValue,
  placeholder,
  icon: Icon,
  required = false,
  disabled = false,
  theme = "default",
}) {
  const getThemeClasses = () => {
    switch (theme) {
      case "admin":
        return {
          container: "relative",
          input:
            "w-full h-13 px-4 py-4 pl-12 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/70 focus:outline-none focus:border-red-400 focus:bg-white/20 transition-all duration-300",
          icon: "absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/70",
        };
      case "dark":
        return {
          container: "relative",
          input:
            "w-full h-13 px-4 py-4 pl-12 bg-gray-800/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:bg-gray-800/70 transition-all duration-300",
          icon: "absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400",
        };
      default:
        return {
          container: "relative",
          input:
            "w-full h-13 px-4 py-4 pl-12 bg-white/10 border border-white/30 rounded-xl text-white placeholder-white/70 focus:outline-none focus:border-blue-400 focus:bg-white/20 transition-all duration-300",
          icon: "absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/70",
        };
    }
  };

  const classes = getThemeClasses();

  return (
    <div className={classes.container}>
      {Icon && <Icon className={classes.icon} />}
      <input
        type={type}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className={classes.input}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
      />
    </div>
  );
}
