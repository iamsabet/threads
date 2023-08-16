"use client";
const Spinner = ({ color }: { color?: string }) => {
  const colorX = `${!color && "text-primary-500"} `;
  return (
    <div
      className={`animate-spin inline-block w-8 h-8 mx-2 border-[3px] border-current border-t-transparent rounded-full ${colorX}`}
      role="status"
      aria-label="loading"
      style={{
        color: color,
      }}
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default Spinner;
