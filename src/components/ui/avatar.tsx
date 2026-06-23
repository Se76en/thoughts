interface AvatarProps {
  src?: string;
  alt?: string;
  size?: "sm" | "md" | "lg";
}

const sizes = {
  sm: "h-10 w-10",
  md: "h-20 w-20",
  lg: "h-32 w-32",
};

export function Avatar({ src, alt = "Avatar", size = "md" }: AvatarProps) {
  if (src) {
    return (
      <div className={`${sizes[size]} overflow-hidden rounded-full ring-2 ring-accent/20 ring-offset-2 ring-offset-background`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} className="h-full w-full object-cover" />
      </div>
    );
  }

  return (
    <div
      className={`${sizes[size]} flex items-center justify-center rounded-full bg-gradient-to-br from-accent/20 to-accent/5 ring-2 ring-accent/20 ring-offset-2 ring-offset-background`}
    >
      <span className="text-2xl font-semibold text-accent">?</span>
    </div>
  );
}
