import React, { Suspense } from "react";
import ReactDOM from "react-dom";
import "./assets/css/tailwind.output.css";
import App from "../src/App";
import { SidebarProvider } from "../src/context/SidebarContext";
import ThemedSuspense from "../src/components/ThemedSuspense";
import { Windmill } from "@windmill/react-ui";
import windmillTheme from "../src/windmillTheme";
import * as serviceWorker from '../src/serviceWorker';

ReactDOM.render(
  <SidebarProvider>
    <Suspense fallback={<ThemedSuspense />}>
      <Windmill>
        <App />
      </Windmill>
    </Suspense>
  </SidebarProvider>,
  document.getElementById("root")
);
serviceWorker.register();