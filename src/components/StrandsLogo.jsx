export default function StrandsLogo({ size = 64 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M20 14 Q36 8 44 22 Q52 36 44 50"
        stroke="#7BB8E8"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="44" cy="50" r="4" fill="white" stroke="#121212" strokeWidth="1.5" />
      <path
        d="M44 50 Q52 36 44 22 Q36 8 20 14"
        stroke="#E8C547"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="20" cy="14" r="4" fill="white" stroke="#121212" strokeWidth="1.5" />
    </svg>
  );
}
