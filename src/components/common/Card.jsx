function Card({ children, className = '', padding = true, hover = false }) {
  const baseStyles = 'bg-white rounded-lg shadow';
  const paddingStyles = padding ? 'p-6' : '';
  const hoverStyles = hover ? 'hover:shadow-lg transition-shadow' : '';
  
  return (
    <div className={`${baseStyles} ${paddingStyles} ${hoverStyles} ${className}`}>
      {children}
    </div>
  );
}

export default Card;
