import Head from 'next/head'
import styles from '../styles/Home.module.scss'
import Link from 'next/link';

// const CONTENT_API_KEY = 'affcd28fbfd6fd27e00f670308';
// const BLOG_URL = 'https://bikashkatwal.ghost.io/'

const {BLOG_URL, CONTENT_API_KEY} = process.env

export const getStaticProps = async ({params}) => {
    const posts = await getPosts();
    return {
        props: {posts},
        revalidate:10
    }
}

async function getPosts() {
    const res = await fetch(`${BLOG_URL}/ghost/api/v3/content/posts/?key=${CONTENT_API_KEY}&fields=title,slug,custom_excerpt`)
        .then((res) => res.json());
    // console.log("RESPONSE", res);
    const posts = res.posts;
    return posts;
}

function Home(props) {
    const {posts} = props;
    return (
        <div className={styles.container}>
            <ul>
                {posts.map((post) => <li key={post.slug}><Link href={`/post/${post.slug}`}><a>{post.title}</a></Link>
                </li>)}
            </ul>
        </div>
    )
}

export default Home;
