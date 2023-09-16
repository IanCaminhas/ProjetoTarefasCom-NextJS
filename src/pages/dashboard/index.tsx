import { GetServerSideProps } from 'next'
import { ChangeEvent, FormEvent, useState, useEffect } from 'react';
import styles from './styles.module.css'
import Head from 'next/head'
import { getSession } from "next-auth/react";
import {Textarea} from '../../components/textarea';
import {FiShare2 } from 'react-icons/fi'
import {FaTrash} from 'react-icons/fa'
import {db} from '../../services/firebaseConnection';
import {
    addDoc, 
    collection,
    query,
    orderBy,
    where,
    onSnapshot,
    doc,
    deleteDoc
} from 'firebase/firestore';
import Link from 'next/link'

interface HomeProps {
    user: {
        email: string;
    }
}

interface TaskProps {
    id: string;
    created: Date;
    public: boolean;
    tarefa: string;
    user: string;
}

export default function Dashboard({ user }: HomeProps) {
    const [input, setInput] = useState("");
    //estado que controla se a tarefa é pública ou não... Marquei é true, se não marquei é false
    //Como ele começa desmarcado, o valor inicial do estado é false
    const [publicTask, setPublicTask] = useState(false);
    const [tasks, setTasks] = useState<TaskProps[]>([])

    useEffect(() => {
        //Estou buscando todas as tarefas onde o "user" for igual ao user?.email. Ou seja, as minhas tarefas
        async function loadTarefas() {  
            const tarefasRef = collection(db, "tarefas")
            const q = query(
                tarefasRef,
                orderBy("created", "desc"),
                where("user", "==", user?.email)
            )

            onSnapshot(q, (snapshot) => {
                let lista = [] as TaskProps[];

                snapshot.forEach((doc) => {
                    lista.push({
                        id: doc.id,
                        tarefa: doc.data().tarefa,
                        created: doc.data().created,
                        user: doc.data().user,
                        public: doc.data().public,
                    })
                })

                setTasks(lista)
            })
        }

        loadTarefas();
    }, [user?.email])

    function handleChangePublic(event: ChangeEvent<HTMLInputElement>) {
        /*para ver a tarefa está publica ou não
        //console.log(event.target.checked) */
        setPublicTask(event.target.checked)
    }

   async function handleRegisterTask(event: FormEvent) {
        //Para não dar o reload na página... Estou evitando o comportamento padrão
        event.preventDefault();
        //estou barrando o usuario para não cadastrar um input vazio
        if(input === '') return;

        //alert("TESTE");
        try {
            await addDoc(collection(db, "tarefas"), {
                tarefa: input,
                created: new Date(),
                user: user?.email,
                public: publicTask //essa tarefa está publica ?
            })
            //Quando cadastrar, limpar os campos
            setInput("")
            setPublicTask(false)
        }catch(err) {
            console.log(err)
        }
    }

    async function handleShare(id: string) {
        //console.log(id)
        await navigator.clipboard.writeText(
            `${process.env.NEXT_PUBLIC_URL}/task/${id}`
        )
        alert("URL copiada co sucesso!")
    }

    async function handleDeleteTask(id: string) {
        const docRef = doc(db, "tarefas", id)
        await deleteDoc(docRef)
    }


    /*Essa é uma solução que poderia ser usada: quando o user carregar o componente na tela, fazemos um 
    useEffect(()), chamar o hook do useSession e verificar se
    tem usuário logado...
    A solução econtrada foi com getServerSideProps 
    */

    /*
        Head é para alterar o title da aba
    */

        /*
            onChange={(event:ChangeEvent<HTMLTextAreaElement>) => setInput(event.target.value)}/> é para pegar
            o que o user digitou. Para compilar, devo informar que é do tipo HTMLTextAreaElement... Coloquei o 
            publicTask dentro de checked para determinar se está marcado ou não...
        */

            /*
                Se eu quiser deixar o checkbox sempre marcado, faço checked={true}... fazendo assim, 
                nem consigo desmarcar 
            */
        /*
            Se item.public for true, renderizo o trecho de código
             {item.public && (
                            <div className={styles.tagContainer}>
                            <label className={styles.tag}>PUBLICO</label>
                            <button className={styles.sharedButton}> 
                                <FiShare2
                                    size={22}
                                    color="#3183ff"
                                />
                            </button>
                        </div>
                         )}
            
            Se o a tarefa for pública(item.public), envolve ela num Link. Esse Link vai mostrar os detalhes da tarefa
            Se não, mostra a tarefa sem o link... Quando clicar, o mouse não vai ser alterado
             {item.public ? (
                                <Link href={`/task/${item.id}`}>
                                     <p>{item.tarefa}</p>
                                </Link>
                            ): (
                                <p>{item.tarefa}</p>
                            )}
        */

    return (
        <div className={styles.container}>
            <Head>
                <title>Meu painel de tarefas</title>
            </Head>

            <main className={styles.main}>
                <section className={styles.content}>
                    <div className={styles.contentForm}>
                        <h1 className={styles.title}>Qual sua tarefa ?</h1>
                        <form onSubmit={handleRegisterTask}>
                            <Textarea placeholder="Digite qual sua tarefa..."
                             value={input}
                             onChange={(event:ChangeEvent<HTMLTextAreaElement>) => setInput(event.target.value)}/>
                            <div className={styles.checkboxArea}>
                                <input 
                                    type="checkbox"
                                    className={styles.checkbox}
                                    checked={publicTask}
                                    onChange={handleChangePublic}
                                    
                                />
                                <label>Deixar tarefa pública</label>
                            </div>

                            <button className={styles.button} type="submit">
                                Registrar
                            </button>
                        </form>
                    </div>
                </section>

                <section className={styles.taskContainer}>
                    <h1>Minhas tarefas</h1>
                    {tasks.map((item) => (
                         <article key={item.id} className={styles.task}>
                         {item.public && (
                            <div className={styles.tagContainer}>
                            <label className={styles.tag}>PUBLICO</label>
                            <button className={styles.sharedButton} onClick={()=>handleShare(item.id)}> 
                                <FiShare2
                                    size={22}
                                    color="#3183ff"
                                />
                            </button>
                        </div>
                         )}
                         <div className={styles.taskContent}>
                            {item.public ? (
                                <Link href={`/task/${item.id}`}>
                                     <p>{item.tarefa}</p>
                                </Link>
                            ): (
                                <p>{item.tarefa}</p>
                            )}
                             <button className={styles.trashButton} onClick={() => handleDeleteTask(item.id)}>
                                 <FaTrash size={24} color="#ea3140" />
                             </button>
                         </div>
                     </article>
                    ))}
                </section>
            </main>
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
    //Quando a sessao for finalizada, quero apenas o e-mail.
    //Esse e-mail vai ser recebido em export default function Dashboard({ user }: HomeProps) 
    return {
        props:{
            user: {
                email: session?.user?.email
            }
        },
    }
}