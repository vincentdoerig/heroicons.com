import '../css/main.css'
import Head from 'next/head'

function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Heroicons</title>
        <meta
          name="description"
          content="Beautiful hand-crafted SVG icons, by the makers of Tailwind CSS."
        />
      </Head>
      <Component {...pageProps} />
    </>
  )
}

export default App
