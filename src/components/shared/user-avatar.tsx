import Image from "next/image";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function UserAvatar({ src, name }: { src?: string; name: string }) {
  return (
    <Avatar className="h-9 w-9 rounded-xl border border-zinc-200 dark:border-zinc-800">
      {src ? (
        <Image
          src={src}
          alt={name}
          width={36}
          height={36}
          className="aspect-square object-cover"
        />
      ) : (
        <AvatarFallback className="bg-zinc-100 text-zinc-500 text-xs font-bold">
          {name
            .split(" ")
            .map((n) => n[0])
            .join("")}
        </AvatarFallback>
      )}
    </Avatar>
  );
}
