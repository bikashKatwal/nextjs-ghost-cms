import Link from 'next/link';
import React, {useState} from 'react';
import {useRouter} from 'next/router';
import styles from '../../styles/Home.module.scss'


const {BLOG_URL, CONTENT_API_KEY} = process.env;

async function getPosts(slug) {
    const res = await fetch(`${BLOG_URL}/ghost/api/v3/content/posts/slug/${slug}?key=${CONTENT_API_KEY}&fields=title,slug,html`)
        .then((res) => res.json());
    // console.log("RESPONSE", res);
    const posts = res.posts;
    return posts[0];
}

// Ghost CMS Request
export const getStaticProps = async ({params}) => {
    // console.log("PARAMA", params)
    const post = await getPosts(params.slug);
    return {
        props: {post},
        revalidate: 10 // at most 1 request to the ghost CMS in the backend
    }
}

//IN PROD
//hello-world - on first requests = GHost CMS call is made (1)
//hello-world - on other requests = filesystem is called (every time)

export const getStaticPaths = () => {
    //paths->slugs which are allowed
    //fallback->
    return {
        paths: [],
        fallback: true
    }
}


function Post({post}) {
    console.log("POSTS", post);
    const router = useRouter();
    const [enableLoadComments, setEnableLoadComments] = useState(true);


    const loadComments = () => {
        setEnableLoadComments(false);
        var disqus_config = function () {
            this.page.url = window.location.href;  // Replace PAGE_URL with your page's canonical URL variable
            this.page.identifier = post.slug; // Replace PAGE_IDENTIFIER with your page's unique identifier variable
        };

        const script = document.createElement('script');
        script.src = 'https://bikash-ghost.disqus.com/embed.js';
        script.setAttribute('data-timestamp', Date.now().toString());
        document.body.appendChild(script);
    }


    if (router.isFallback) {
        return <h2>Loading...</h2>;
    }
    return (
        <div className={styles.container}>
            <Link href="/"><a className={styles.goback}>Go Back</a></Link>
            <h1>{post.title}</h1>
            <div dangerouslySetInnerHTML={{__html: post.html}}></div>

            {enableLoadComments && (<p className={styles.goback} onClick={loadComments}>
                Load Comments
            </p>)}
            <div id="disqus_thread"></div>
        </div>
    );
}

export default Post;
