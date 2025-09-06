const NirvanaLogo = ({ className = "w-10 h-10" }) => {
  return (
    <div className={`${className} flex items-center justify-center bg-gradient-to-br from-orange-500 to-orange-600 rounded-full shadow-lg`}>
      <svg 
        className="w-6 h-6" 
        viewBox="0 0 24 24" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Simplified lotus/mandala design */}
        <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="1.5" fill="none" opacity="0.8" />
        <circle cx="12" cy="12" r="6" stroke="white" strokeWidth="1" fill="none" opacity="0.6" />
        <circle cx="12" cy="12" r="2" fill="white" opacity="0.9" />
        
        {/* Petal-like elements */}
        <path d="M12 2 L14 6 L12 10 L10 6 Z" fill="white" opacity="0.7" />
        <path d="M22 12 L18 14 L14 12 L18 10 Z" fill="white" opacity="0.7" />
        <path d="M12 22 L10 18 L12 14 L14 18 Z" fill="white" opacity="0.7" />
        <path d="M2 12 L6 10 L10 12 L6 14 Z" fill="white" opacity="0.7" />
      </svg>
    </div>
  )
}

export default NirvanaLogo
