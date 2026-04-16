
import Image from "@/react-edu/adapters/image";
import Link from "@/react-edu/adapters/router";
import { motion } from "framer-motion";
import { cn } from "@/react-edu/lib/utils";

export interface CourseCardProps {
  id: string;
  title: string;
  description: string | null;
  thumbnailUrl: string | null;
  category: string | null;
  educatorName: string | null;
  videoCount: number;
}

export function CourseCard({
  id,
  title,
  description,
  thumbnailUrl,
  category,
  educatorName,
  videoCount,
}: CourseCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={cn(
        "group flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm",
        "transition-shadow duration-200 hover:shadow-md",
      )}
    >
      <Link href={`/courses/${id}`} className="flex flex-1 flex-col">
        <div className="relative aspect-video w-full overflow-hidden bg-secondary">
          {thumbnailUrl ? (
            <Image
              src={thumbnailUrl}
              alt={title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <svg
                className="h-12 w-12 text-muted-foreground/30"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.362a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z"
                />
              </svg>
            </div>
          )}

          {category ? (
            <span className="absolute left-3 top-3 rounded-full bg-primary/90 px-2.5 py-1 text-xs font-medium text-primary-foreground backdrop-blur-sm">
              {category}
            </span>
          ) : null}
        </div>

        <div className="flex flex-1 flex-col gap-2 p-4">
          <h3 className="line-clamp-2 font-heading text-base font-semibold leading-snug text-foreground">
            {title}
          </h3>

          {description ? (
            <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
              {description}
            </p>
          ) : null}

          <div className="mt-auto flex items-center justify-between pt-3">
            {educatorName ? (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <svg
                  className="h-3.5 w-3.5 shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <span className="truncate">{educatorName}</span>
              </div>
            ) : null}

            <span className="ml-auto rounded-full bg-accent px-2.5 py-1 text-xs font-medium text-accent-foreground">
              {videoCount === 1 ? "1 lesson" : `${videoCount} lessons`}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
