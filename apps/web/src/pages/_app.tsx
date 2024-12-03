import "@maybank/styles/globals.scss";
import React from "react";
import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import {store} from "@maybank/store";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  );
}
