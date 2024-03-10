import styles from './ChatRoom.module.css'
import '../../components/RoomEntry/RoomEntry'
import {RoomEntry} from '~/components/RoomEntry/RoomEntry'
import {MessageItem} from '~/components/Message/Message'
import { useState,useRef} from 'react'
import { trpc } from '~/utils/trpc';
import { useRouter } from 'next/router';
import type {Response,RoomEntryResponse} from '../../utils/util';
import { TRPCError } from '@trpc/server';

//添加房间表单
function AddRoomModal({ isOpen,onClose, onSubmit,user,onAdd}) {
    const [name, setName] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        onSubmit(name);
        setName('');
    };

    if (!isOpen) {
        return null;
    }

    return (
        <div className={styles.modal}>
            <div className={styles.modal_content}>
            <button  className={styles.closeButton} onClick={onClose}>X</button>
                <form onSubmit={handleSubmit} className={styles.setRoomName}>
                    <input className={styles.setRoomNameInput} type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder='Input the Room Name'/>
                    <button className={styles.setRoomNameButton} type="submit" onClick={()=>onAdd(user,name)}>Add</button>
                </form>
                
            </div>
        </div>
    );
}
export default function ChatRoom(){
    //const res = trpc.chat.getMessageList.useQuery()
    // 获取userName
    // const location=useLocation()
    // const searchParams=new URLSearchParams(location.search)
    // const userName =searchParams.get('userName')
    const router =useRouter()
    const {userName} =router.query
    // 管理当前的roomId
    const [selectedRoomId, setSelectedRoomId] = useState<number>(-1)
    const handleRoomClick = (roomId:number) => {
        setSelectedRoomId(roomId);
    }
    // 获取 roomList
    // const {
    //     data:roomData,
    //     error:roomError,
    //     isLoading:roomIsLoading,
    // }
    // =useSWR<{rooms:RoomEntryResponse[]}>('/api/room/list', getFetcher,{
    //     refreshInterval:1000,
    // });
    const roomQuery =trpc.chat.getRoomList.useQuery(null,{refetchInterval:500})
    const roomData=roomQuery.data
    //获取 messageList
    // const {
    //     data:messageListData,
    //     error:messageListError,
    //     isLoading:messageListIsLoading,
    // } = useSWR<{messages:MessageResponse[]}>(
    //     () => {
    //         if(selectedRoomId==null) return false;
    //         return '/api/room/message/list?roomId='+selectedRoomId;
    //     },
    //     getFetcher,
    //     {
    //         refreshInterval:500,
    //     }
    // );
    const messageListQuery =trpc.chat.getMessageList.useQuery({roomId:selectedRoomId},{refetchInterval:500})
    const messageListData=messageListQuery.data
    //添加房间
    // const {
    //     trigger:addRoomTrigger,
    //     isMutating:addRoomIsMutating,
    // } = useSWRMutation<
    //     {roomId:number},
    //     null,
    //     string,
    //     {
    //         user:string;
    //         roomName:string;
    //     }
    // >("/api/room/add",postFetcher);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleAddRoom = () => {
        setIsModalOpen(false);
    };
    const mutation =trpc.chat.addRoom.useMutation()
    const handleAddRoomClick=(user:string,roomName:string)=>{
        mutation.mutate({user:user, roomName:roomName});
    }

    //管理当前输入框
    const [inputValue,setInputValue] =useState('')
    const handleInputValueChange = (event) =>{
        setInputValue(event.target.value);
        
    }
    //添加消息
    // const {
    //     trigger:addMessageTriger,
    //     isMutating:addMesssageIsMutating,
    // } = useSWRMutation<
    //     null,
    //     null,
    //     string,
    //     {
    //         roomId:number,
    //         content:string,
    //         sender:string,
    //     }
    // >("/api/message/add",postFetcher);
    const addMessageMutation =trpc.chat.addMessage.useMutation()
    const handleAddMessage=(
        roomId:number,
        content:string,
        sender:string, 
    )=>{
        addMessageMutation.mutate({roomId:roomId,content:content,sender:sender})
        setInputValue('')
        endOfMessagesRef.current.scrollTop = endOfMessagesRef.current.scrollHeight;
    }
    //删除房间
    // const {
    //     trigger:deleteRoomTrigger,
    //     isMutating:deleteRoomIsMutating,
    // } = useSWRMutation<
    //     null,
    //     null,
    //     string,
    //     {
    //         user:string;
    //         roomId:number;
    //     }
    // >('/api/room/delete',postFetcher);
    const deleteRoomMutation = trpc.chat.deleteRoom.useMutation()
    const handleDeleteRoom =async (user:string,roomId:number)=>{
        try{
            deleteRoomMutation.mutate({user:user,roomId:roomId})
        }
        catch (error){
            console.log(error.message)
        }
        // const data =deleteRoomMutation.data
        // if(data.code==-1){
        //     alert(data.message)
        // }
        // else if(data.code==0){
        //     alert("success")
        // }
    }
    //自动跳转
    const endOfMessagesRef = useRef(null);
    // useEffect(() => {
    //     endOfMessagesRef.current.scrollTop = endOfMessagesRef.current.scrollHeight;
    // }, [messageListData]);
    return (
        <div className={styles.ChatRoom}>
            <div className={styles.Navigation}>
                <div className={styles.NavigationBar}>
                    <div className={styles.userInfo}>
                        <div className={styles.userAvatar}>{userName?.substring(0,4)}</div>
                        <div className={styles.UserName}>Hello! {userName}</div>
                    </div>                 
                    <button className={styles.addRoomButton} onClick={()=>setIsModalOpen(true)}>Add</button>
                    <AddRoomModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleAddRoom} user={userName} onAdd={handleAddRoomClick}/>
                </div>
                <div className={styles.RoomEntryList} >
                    {roomData?
                    roomData.map(roomEntry => (
                        <RoomEntry
                            key={roomEntry.roomId}
                            roomId={roomEntry.roomId}
                            roomName={roomEntry.roomName}
                            lastMessage={roomEntry.lastMessage}
                            onClick={() => handleRoomClick(roomEntry.roomId)}
                            isSelected={selectedRoomId==roomEntry.roomId}
                            onDeleteRoom={handleDeleteRoom}
                            userName={userName}
                        />
                    )):null}
                </div>
            </div>
            <div className={styles.content}>
                <div className={styles.RoomInfo}>
                    {selectedRoomId>=0&&<div className={styles.groupAvatar}>{ (roomData?.find((element:RoomEntryResponse) => element.roomId==+selectedRoomId))?.roomName.substring(0,4)}</div>}
                    <div>{ (roomData?.find((element:RoomEntryResponse) => element.roomId==+selectedRoomId))?.roomName}</div>
                </div>
                <div className={styles.RoomMessages} ref={endOfMessagesRef}>
                    {messageListData?
                        messageListData.map(message => (
                            <MessageItem
                                key={message.messageId}
                                messageId={message.messageId}
                                roomId={message.roomId}
                                sender={message.sender}
                                content={message.content}
                                time={message.time}
                                fromUser={message.sender==userName}
                            />
                        )):null}
                </div>
                <div className={styles.input}>
                    <textarea className={styles.inputField} value={inputValue} onChange={handleInputValueChange}></textarea>
                    <button className={styles.sendButton} onClick={()=>handleAddMessage(selectedRoomId,inputValue,userName)}>Send</button>
                </div>
            </div>
        </div>
    )
}