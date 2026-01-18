import { registerOTel } from "@vercel/otel";

export function register() {
  registerOTel({ serviceName: "metabolic-debugger-2" });
}
