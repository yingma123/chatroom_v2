import type { AppType, AppProps } from 'next/app';
import { NextPage } from 'next';
import Index from './index'
import ChatRoom from './ChatRoom/[userName]'
import './ChatRoom/ChatRoom.module.css'
import './SetName/SetName.module.css'
import '../components/RoomEntry/RoomEntry.module.css'
import '../components/Message/Message.module.css'
import { trpc } from '~/utils/trpc';
import'../styles/globals.css'
import { Router } from 'next/router';
import Link from 'next/link';
const MyApp = (({Component,pageProps}) => {
  return (
    <Component {...pageProps}></Component>
  )
}) as AppType;

export default trpc.withTRPC(MyApp);
