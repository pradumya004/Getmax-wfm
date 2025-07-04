// frontend/src/components/dashboard/StatCard.jsx

// import React, { useEffect, useRef } from 'react';
// import { motion, animate } from 'framer-motion';
// import { toast } from 'react-hot-toast';

// // ✅ Make sure this path is correct in your project
// import {
//   Card,
//   CardHeader,
//   CardTitle,
//   CardContent
// } from '../../components/ui/card'; // update path if needed

// function Counter({ from = 0, to, isPercentage = false, isCurrency = false }) {
//   const ref = useRef();

//   useEffect(() => {
//     const controls = animate(from, to, {
//       duration: 1.5,
//       onUpdate(value) {
//         if (ref.current) {
//           if (isPercentage) {
//             ref.current.textContent = value.toFixed(1);
//           } else if (isCurrency) {
//             ref.current.textContent = Math.round(value).toLocaleString('en-IN');
//           } else {
//             ref.current.textContent = Math.round(value).toLocaleString();
//           }
//         }
//       },
//     });
//     return () => controls.stop();
//   }, [from, to, isPercentage, isCurrency]);

//   return <span ref={ref} />;
// }

// const StatCard = ({
//   title,
//   value,
//   icon: Icon,
//   weeklyTrend,
//   isPercentage = false,
//   isCurrency = false
// }) => {
//   const handleDrillDown = () => {
//     toast.error(`🚧 Drilling into "${title}" not implemented yet.`);
//   };

//   return (
//     <motion.div
//       whileHover={{
//         scale: 1.02,
//         y: -4,
//         transition: { duration: 0.2 },
//       }}
//       whileTap={{ scale: 0.98 }}
//     >
//       <Card
//         className="
//           relative overflow-hidden cursor-pointer
//           bg-white/5 backdrop-blur-xl border border-white/10
//           hover:bg-white/10 hover:border-white/20
//           shadow-xl hover:shadow-2xl
//           transition-all duration-300 ease-out
//           group
//         "
//         onClick={handleDrillDown}
//       >
//         {/* Background effects */}
//         <div className="absolute inset-0 bg-gradient-to-br from-blue-400/10 via-purple-400/10 to-indigo-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
//         <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-indigo-400/20 rounded-lg blur-sm opacity-0 group-hover:opacity-50 transition-opacity duration-300 -z-10" />

//         <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 relative z-10">
//           <CardTitle className="text-sm font-medium text-white/80 group-hover:text-white transition-colors duration-200">
//             {title}
//           </CardTitle>

//           {/* ✅ Safe icon rendering */}
//           {typeof Icon === 'function' && (
//             <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 group-hover:from-blue-400/30 group-hover:to-purple-400/30 transition-all duration-200">
//               <Icon className="h-5 w-5 text-blue-300 group-hover:text-blue-200 transition-colors duration-200" />
//             </div>
//           )}
//         </CardHeader>

//         <CardContent className="relative z-10">
//           <div className="text-3xl font-bold text-white mb-2 group-hover:text-blue-100 transition-colors duration-200">
//             {isCurrency && (
//               <span className="text-blue-300 group-hover:text-blue-200 transition-colors duration-200">₹</span>
//             )}
//             <Counter to={value} isPercentage={isPercentage} isCurrency={isCurrency} />
//             {isPercentage && (
//               <span className="text-blue-300 group-hover:text-blue-200 transition-colors duration-200">%</span>
//             )}
//           </div>
//           <p className="text-xs text-white/60 group-hover:text-white/80 transition-colors duration-200">
//             {weeklyTrend}
//           </p>
//         </CardContent>

//         {/* Shine effect */}
//         <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out" />
//       </Card>
//     </motion.div>
//   );
// };

// export default StatCard;


import React from 'react'

const StatCard = () => {
  return (
    <div>StatCard</div>
  )
}

export default StatCard