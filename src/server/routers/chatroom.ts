import { prisma } from '~/server/prisma';
import { publicProcedure, router } from "../trpc"
import { unknown, z } from 'zod';
import type {Response,RoomEntryResponse } from '../../utils/util';
import { TRPCError } from '@trpc/server';

export const chatRouter = router({
    addRoom:publicProcedure
      .input(
        z.object({
            user:z.string(),
            roomName:z.string(),
        })
      )
      .mutation(async ({input}) =>{
        return prisma.room.create({
          data:{
            roomName:input.roomName,
            creator:input.user,
          },
        })

    }),
    getRoomList:publicProcedure
      .query(async () => {
        const roomList=await prisma.room.findMany();
        console.log(roomList);
        const rooms:RoomEntryResponse[]=[];
        for (const room of roomList) {
          const latestMessage = await prisma.message.findFirst({
            where: {
              roomId: room.roomId,
            },
            orderBy:{
              time:'desc',
            },
          })
          rooms.push({
            roomId:room.roomId,
            roomName:room.roomName,
            lastMessage:latestMessage,
          })

        }
        return rooms;
    }),
    deleteRoom:publicProcedure
    .input(
      z.object({
        user:z.string(),
        roomId:z.number(),
      })
    ).mutation(async ({input}) =>{
        const roomToDelete=await prisma.room.findUnique({
          where:{
            roomId:input.roomId,
          },
        })
        console.log(roomToDelete)
        if(roomToDelete.creator==input.user){
          await prisma.room.delete({
            where:{
              roomId:input.roomId,
            }
          })
          // const res:Response={
          //   message:'',
          //   code:0,
          //   data:null,
          // }
          // return res
        }
        else{
          throw new Error('you have no permission')
          // const res:Response={
          //   message:'you have no permission',
          //   code:-1,
          //   data:null,
          // }
          // return res
        }
    }),
    addMessage:publicProcedure
      .input(
        z.object({
          roomId:z.number(),
          content:z.string(),
          sender:z.string(),
      })
      )
      .mutation(async ({input}) =>{
        return prisma.message.create({
          data:{
            roomId:input.roomId,
            sender:input.sender,
            content:input.content,

          },
        })
    }),
    getMessageList:publicProcedure
      .input(
        z.object({
          roomId: z.number(),
        })
      ).query(async ({input}) =>{
        return prisma.message.findMany({
          where:{
            roomId:input.roomId,
          }
        })
    }),

})