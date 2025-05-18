import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";
import { Provider } from "./ui/provider.tsx";

const queryClient = new QueryClient();
export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Pdf Management App</title>
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function Root() {
  return (
    <Provider>
      <QueryClientProvider client={queryClient}>
        <Outlet />
      </QueryClientProvider>
    </Provider>
  );
}
export function HydrateFallback() {
  return <div>Loading...</div>;
}
