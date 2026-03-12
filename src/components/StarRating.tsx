"use client";

interface Props {
  value: number;
  onChange?: (v: number) => void;
  readonly?: boolean;
  size?: "sm" | "md" | "lg";
}

export default function StarRating({
  value,
  onChange,
  readonly = false,
  size = "md",
}: Props) {
  const sizes = { sm: "text-lg", md: "text-2xl", lg: "text-3xl" };

  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <button
          key={s}
          type="button"
          disabled={readonly}
          onClick={() => !readonly && onChange?.(s)}
          className={`${sizes[size]} leading-none transition-transform
            ${!readonly ? "hover:scale-125 cursor-pointer" : "cursor-default"}`}
        >
          <span className={s <= value ? "text-yellow-400" : "text-gray-300"}>
            ★
          </span>
        </button>
      ))}
    </div>
  );
}
