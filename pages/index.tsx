import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Github Repository Explorer</title>
        <meta name="description" content="Github Repository Explorer" />
      </Head>

      <main>
        <p>Main Content</p>
      </main>

      <footer>
        <p>Footer Content</p>
      </footer>
    </div>
  )
}
