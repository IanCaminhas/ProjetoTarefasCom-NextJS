import Head from 'next/head'
import styles from './styles.module.css'
import { GetServerSideProps } from 'next'
import {db} from '../../services/firebaseConnection'
import {doc, collection, getDoc,query, where} from 'firebase/firestore'

export default function Task() {
    return (
        <diV className={styles.container}>
            <Head>
                <title>Detalhes da tarefa</title>
            </Head>

            <main className={styles.main}>
                <h1>Tarefas</h1>

            </main>
        </diV>
    )
}

/* Revisão: tudo isso aqui é carregado no lado do servidor.
Passamos primeiro no servidor, pega-se o id. Depois é passado para o componente.
O id até aparece no terminal onde dei npm run dev
*/
export const getServerSideProps: GetServerSideProps = async ({params}) =>{
    //id da tarefa para ser buscada no BD
    const id = params?.id as string;
    //console.log(id)

    const docRef = doc(db, "tarefas", id)

    const snapshot = await getDoc(docRef)

    /*Se ele não encontrar os dados do id, vou mandar lá pra home(/)
        Isso serve quando o usário digitar na barra url do navegador, por exemplo.
    */
    if(snapshot.data()===undefined) {
        return {
            redirect: {
                destination: "/",
                permanent: false,
            }
        }
    }
    //Se a tarefa não for pública... Ou seja, se o for public == false. Não quero abrir uma tarefa que não for pública
    //Vou mandar para o home(/) tbm
    if(!snapshot.data()?.public) {
        return {
            redirect: {
                destination: "/",
                permanent: false,
            }
        }
    }

    /*  
    {
             tarefa: 'Apredendo a jogar games',
             public: true,
             created: Timestamp { seconds: 1693257171, nanoseconds: 821000000 },
             user: 'caminhasian@gmail.com'
        }
        console.log(snapshot.data())
    */

    //Preciso mandar os dados para o componente formatados
    const milliseconds = snapshot.data()?.created?.seconds * 10007
    const task = {
        tarefa: snapshot.data()?.tarefa,
        public: snapshot.data()?.public,
        created: new Date().toLocaleDateString(),
        user: snapshot.data()?.user,
        taskId: id,
    }
    /* 
    Dados formatados
        {
            tarefa: 'Apredendo a jogar games',
            public: true,
            created: '16/09/2023',
            user: 'caminhasian@gmail.com',
            taskId: 'AUSp0DkLZwiGRcBNVfGR'
        }
          console.log(task)
    */
  
    
    return {
        props:{}
    }

}