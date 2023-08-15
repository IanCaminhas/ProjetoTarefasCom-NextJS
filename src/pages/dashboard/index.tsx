import styles from './styles.module.css'
import Head from 'next/head'

export default function Dashboard() {
/*
    Head é para alterar o title da aba
*/
    return (
        <div className={styles.container}>
            <Head>
                <title>Meu painel de tarefas</title>
            </Head>

            <h1>Página painel</h1>
        </div>
    )
}