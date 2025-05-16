import type { SVGProps } from "react";
import { Bot } from "lucide-react";

export function AppLogo(props: SVGProps<SVGSVGElement>) {
  return <Bot className="h-6 w-6 text-primary" {...props} />;
}
