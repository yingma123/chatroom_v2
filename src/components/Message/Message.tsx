import styles from './Message.module.css'
import {timestampToDateTime} from '../../utils/util'
export interface MessageProps{
    messageId:number;
    roomId:number;
    sender:string;
    content:string;
    time:number;
    fromUser:boolean;
}
export function MessageItem(props:MessageProps){
    if(props.content!=" "){
        if(!props.fromUser)
        return (
            <div className={styles.Message}>
                <div className={styles.SenderAvatar}>{props.sender.substring(0,4)}</div>
                <div className={styles.MessageInfo}>
                    <div className={styles.Sender}>{props.sender}</div>
                    <div className={styles.MessageCT}>
                        <div className={styles.MessageContent}>{props.content}</div>
                        <div className={styles.Sendtime}>{timestampToDateTime(props.time)}</div>
                    </div>
                </div>
            </div>
        )
        else 
        return (
            <div className={styles.fromUserMessage}>
                <div className={styles.fromUserSenderAvatar}>{props.sender.substring(0,4)}</div>
                <div className={styles.fromUserMessageInfo}>
                    <div className={styles.fromUserSender}>{props.sender}</div>
                    <div className={styles.fromUserMessageCT}>
                        <div className={styles.fromUserSendtime}>{timestampToDateTime(props.time)}</div>
                        <div className={styles.fromUserMessageContent}>{props.content}</div>
                    </div>
                </div>
    
            </div>
        )
    }

}