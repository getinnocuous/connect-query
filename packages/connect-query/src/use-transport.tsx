// Copyright 2021-2022 Buf Technologies, Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import type { Transport } from "@bufbuild/connect-web";
import { createConnectTransport } from "@bufbuild/connect-web";
import type { FC, PropsWithChildren } from "react";
import { createContext, useContext } from "react";

const transportContext = createContext(
  createConnectTransport({
    // this will raise a TypeError: Failed to construct 'URL': Invalid URL
    // in upcoming versions of @bufbuild/connect-web as soon as the user
    // tries to run an RPC.
    // recommend to return a Transport that raised an error with a friendly explanatory message
    //
    // TODO, should this be initialized to null instead of a useless transport (where, I'm assuming that baseUrl being empty makes it useless)?
    baseUrl: "",
  })
);

/**
 * Use this helper to get the default transport that's currently attached to the React context for the calling component.
 */
export const useTransport = () => useContext(transportContext);

/**
 * `TransportProvider` is the main mechanism by which Connect-Query keeps track of the `Transport` used by your application.
 *
 * Broadly speaking, "transport" joins two concepts:
 *   1. The protocol of communication.  For this there are two options: the {@link https://connect.build/docs/protocol/ Connect Protocol}, or the {@link https://github.com/grpc/grpc/blob/master/doc/PROTOCOL-WEB.md gRPC-Web Protocol}.
 *   1. The protocol options.  The primary important piece of information here is the `baseUrl`, but there are also other potentially critical options like request credentials and binary wire format encoding options.
 *
 * With these two pieces of information in hand, the transport provides the critical mechanism by which your app can make network requests.
 *
 * To learn more about the two modes of transport, take a look at the npm package `@bufbuild/connect-web`.
 *
 * To get started with Connect-Query, simply import a transport (either `createConnectTransport` or `createGrpcWebTransport` from `@bufbuild/connect-web`) and pass it to the provider.
 *
 * @example
 * import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
 * import { TransportProvider } from "connect-query";
 *
 * const queryClient = new QueryClient();
 *
 * export const App() {
 *   const transport = createConnectTransport({
 *     baseUrl: "<your baseUrl here>",
 *   });
 *   return (
 *     <TransportProvider transport={transport}>
 *       <QueryClientProvider client={queryClient}>
 *          <YourApp />
 *       </QueryClientProvider>
 *     </TransportProvider>
 *   );
 * }
 */
export const TransportProvider: FC<
  PropsWithChildren<{
    transport: Transport;
  }>
> = ({ children, transport }) => (
  <transportContext.Provider value={transport}>
    {children}
  </transportContext.Provider>
);
