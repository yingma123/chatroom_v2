/**
 * This file contains the root router of your tRPC-backend
 */
import { createCallerFactory, publicProcedure, router } from '../trpc';
import { chatRouter } from './chatroom';

export const appRouter = router({
  healthcheck: publicProcedure.query(() => 'yay!'),

 chat:chatRouter,
});

export const createCaller = createCallerFactory(appRouter);

export type AppRouter = typeof appRouter;
