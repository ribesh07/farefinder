import { cn } from "@/lib/utils";
import { CheckCircle2, AlertCircle, Info } from "lucide-react";

type AdminAlertProps = {
  type?: "success" | "error" | "info";
  message: string;
  className?: string;
};

const styles = {
  success: "border-green-200 bg-green-50 text-green-800 dark:border-green-900 dark:bg-green-950 dark:text-green-200",
  error: "border-red-200 bg-red-50 text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200",
  info: "border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-200",
};

const icons = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
};

export function AdminAlert({
  type = "info",
  message,
  className,
}: AdminAlertProps) {
  const Icon = icons[type];

  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-lg border px-4 py-3 text-sm",
        styles[type],
        className
      )}
    >
      <Icon className="mt-0.5 h-4 w-4 shrink-0" />
      <p>{message}</p>
    </div>
  );
}
