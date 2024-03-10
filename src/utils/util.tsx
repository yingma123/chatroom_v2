export interface Response<T=any>{
  code:number,
  message:string,
  data:T,
}
export interface  Message{
  messageId:number;
  roomId:number;
  sender:string;
  content:string;
  time:number;
}
export interface RoomEntryResponse{
  roomId:number;
  roomName:string;
  lastMessage: Message|null;
}


export function timestampToDateTime(timestamp:number|undefined) {
  if(timestamp==null) return ' '
  // 创建一个新的 Date 对象
  const date = new Date(timestamp);

  // 使用 toLocaleString 方法将日期和时间转换为字符串
  const dateTime = date.toLocaleString();

  return dateTime;
}