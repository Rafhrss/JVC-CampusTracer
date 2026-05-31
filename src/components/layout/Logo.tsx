

export const CampusTracerIcon = ({ className = "w-6 h-6 text-white" }: { className?: string }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      {/* Topi Toga */}
      <path d="M12 4L2 9l10 5 10-5-10-5z" />
      <path d="M6 11v5c0 2.2 2.7 4 6 4s6-1.8 6-4v-5" />
      {/* Gagang Kaca Pembesar menyatu dengan tali toga */}
      <circle cx="18" cy="18" r="3" />
      <line x1="20.1" y1="20.1" x2="22" y2="22" />
    </svg>
  );
};

export default CampusTracerIcon;