import { GetServerSideProps } from 'next'
import styles from './styles.module.css'
import Head from 'next/head'
import { getSession } from "next-auth/react";

export default function Dashboard() {

    /*Essa é uma solução que poderia ser usada: quando o user carregar o componente na tela, fazemos um 
    useEffect(()), chamar o hook do useSession e verificar se
    tem usuário logado...
    A solução econtrada foi com getServerSideProps 
    */

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
/*Esse getServerSideProps é executado no lado servidor. Vai mostrar 
no terminal esse console.log("BUSCANDO PELO SERVER SIDE")).
Antes de montar a interface, já foi passado no servidor
Conseguimos usar algo melhor que o useEffect().
Aqui olho se tem usuário logado ou não
*/
export const getServerSideProps: GetServerSideProps = async ({req}) => {
    //console.log("BUSCANDO PELO SERVER SIDE")
    //Estou esperando a ter a sessão. Vai ter ou não ? Essa session vai ser retornada da proppriedade getServerSession
    const session = await getSession({req})
    //console.log(session)
    if(!session?.user) {
        //Se não tem usuário, vamos redirecionar para a home(no caso é o /)
        return{
            redirect: {
                destination: '/',
                permanent: false,
            }
        }
    }
    return {
        props:{},
    }
}