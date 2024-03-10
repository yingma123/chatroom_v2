import styles from './SetName/SetName.module.css'
import { useState } from 'react';
import Link from 'next/link';
export function Index(){
    const [inputValue, setInputValue] = useState('');
    return(
        <div className={styles.SetName}>
            <input type="text" autoComplete="off" name="text" className={styles.setNameInput} placeholder="Input your name" onChange={e => setInputValue(e.target.value)}></input>
            <Link className={styles.setNameButton} href={'ChatRoom/'+inputValue}>Set</Link>
        </div>
    )
}
export default Index