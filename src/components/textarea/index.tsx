import { HTMLProps } from "react";
import styles from "./styles.module.css"

/*
    {...rest}: HTMLProps<HTMLTextAreaElement> agora posso aceitar 
    elementos do tipo HTML 
*/
export function Textarea({...rest}: HTMLProps<HTMLTextAreaElement>){
    return <textarea className={styles.textarea} {...rest}></textarea>;
}