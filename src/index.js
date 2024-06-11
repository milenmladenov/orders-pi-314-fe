import React, { Suspense } from "react";
import ReactDOM from "react-dom";
import "./assets/css/tailwind.output.css";
import App from "./App";
import { SidebarProvider } from "./context/SidebarContext";
import ThemedSuspense from "./components/ThemedSuspense";
import { Windmill } from "@windmill/react-ui";
import * as serviceWorker from './serviceWorker';
import { CacheBuster } from 'react-cache-buster';


ReactDOM.render(
  <SidebarProvider>
    <Suspense fallback={<ThemedSuspense />}>
      <Windmill>
        <CacheBuster>
          <App />
        </CacheBuster>

      </Windmill>

    </Suspense>
  </SidebarProvider>,
  document.getElementById("root")
);
serviceWorker.register();