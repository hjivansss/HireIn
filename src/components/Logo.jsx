export default function Logo() {
  return (
    <div className="flex items-center gap-3">

      <svg
        className="h-10 w-10"
        viewBox="0 0 64 64"
        fill="none"
      >
        <rect
          x="4"
          y="4"
          width="56"
          height="56"
          rx="18"
          fill="#0F766E"
        />

        <rect
          x="18"
          y="16"
          width="6"
          height="32"
          rx="3"
          fill="white"
        />

        <rect
          x="40"
          y="16"
          width="6"
          height="32"
          rx="3"
          fill="white"
        />

        <path
          d="M24 39 L40 25"
          stroke="white"
          strokeWidth="6"
          strokeLinecap="round"
        />
      </svg>

    </div>
  );
}