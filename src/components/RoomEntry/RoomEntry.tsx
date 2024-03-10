
import styles from './RoomEntry.module.css'
import {timestampToDateTime} from '~/utils/util'
import type {Message} from '../../utils/util';

export interface RoomEntryProps{
    roomId:number;
    roomName:string;
    lastMessage: Message|null;
    onClick:(roomId:number)=>void;
    isSelected:boolean;
    onDeleteRoom:(user:string,roomId:number)=>void;
    userName:string;
}
export function RoomEntry(props:RoomEntryProps){
    return(
        <div className={props.isSelected ? styles.RoomEntryselected : styles.RoomEntry} onClick={()=>props.onClick(props.roomId) } >
            <div className={styles.GroupAvatar}>{props.roomName.substring(0,1)}</div>
            <div className={styles.RoomEntryInfo}>
                <div className={styles.RoomName}>{props.roomName}</div>
                <div className={styles.LastMessage}>{props.lastMessage?(props.lastMessage?.sender+':'+props.lastMessage?.content):'  '}</div>
            </div>
            <div className={styles.LastMessageTime}>{timestampToDateTime(props.lastMessage?.time)}</div>
            <button className={styles.deleteButton} onClick={()=>props.onDeleteRoom(props.userName,props.roomId)}>Delete</button>
        </div>
    )
}