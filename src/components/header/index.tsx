import {useSession, signIn, signOut} from 'next-auth/react'
import styles from './styles.module.css'
import Link from 'next/link'

export function Header() {
    //status -> Dá para saber se o usuário tá logado, está carregando, se tem as informações do usuário, etc.
    const {data: session, status} = useSession()

    /*      Se o status for loading, deixa um fragment. Nesse exemplo, não quis colocar nada. Poderia 
            ter um componnete indicando que está carregando.
            Se tiver uma session(pode ser os dados do user ou null), coloco o botão com o nome do usuário. Se clicar
            em cima, faz o logout.
            Se eu não tiver sessão, quero fazer o login

           {status === 'loading' ? (
                    <></>
                ): session ? (
                    <button className={styles.loginButton} onClick={() => signOut()}>
                        Olá {session?.user?.name}
                    </button>
                ):(
                    <button className={styles.loginButton} onClick={() => signIn("google")}></button>
                )}

                Se tiver um usuário, mostra o link para acessar o meu painel. Se não satisfazer, o link 
                não é exibido
                {
                    session?.user && (
                        <Link href="/dashboard" className={styles.link}>
                        Meu Painel
                    </Link>
                    )
                   }
    */
    return (
        <header className={styles.header}>
            <section className={styles.content}>
                <nav className={styles.nav}>
                    <Link href="/">
                        <h1 className={styles.logo}>
                            Tarefas<span>+</span>
                        </h1>
                    </Link>
                   {
                    session?.user && (
                        <Link href="/dashboard" className={styles.link}>
                        Meu Painel
                    </Link>
                    )
                   }
                </nav>
                {status === 'loading' ? (
                    <></>
                ): session ? (
                    <button className={styles.loginButton} onClick={() => signOut()}>
                        Olá {session?.user?.name}
                    </button>
                ):(
                    <button className={styles.loginButton} onClick={() => signIn("google")}>
                        Acessar
                    </button>
                )}
            </section>
        </header>
    )
}