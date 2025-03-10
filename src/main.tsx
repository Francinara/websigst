import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { toast } from "react-toastify";

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (Error) => toast.error(Error.message),
  }),
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
);
