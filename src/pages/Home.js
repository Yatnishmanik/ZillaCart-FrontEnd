import React, { useEffect, useState } from 'react';
import PostCard from '../components/PostCard';
import LeftPostCard from '../components/LeftPostCard';
import SidepostCard from '../components/SidepostCard';
import { Box, Container, Grid } from '@mui/material';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import axios from 'axios';
import moment from 'moment';
import Loader from '../components/Loader';
import { io } from 'socket.io-client';
import config from '../config'


const socket = io('/', {
    reconnection: true
})



const Home = () => {

    const [sideposts, setsidePosts] = useState([]);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [postAddLike, setPostAddLike] = useState([]);
    const [postRemoveLike, setPostRemoveLike] = useState([]);
    const [Latest, setLatest] = useState([]);
    // const [latestpost,setLatestPosts]=useState([]);

    //display posts
    // Latest Post Filter data 
    const FetchLatest = async () => {
        setLoading(true);
        try {
          const response = await axios.get(`${config.URL}/api/show/filter?category=Latest`);
          setLatest(response.data);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching posts:', error);
        }
      };
    //

    const showPosts = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get(`${config.URL}/api/show/filter?category=All`);
            setPosts(data);
            setLoading(false);
        } catch (error) {
            console.log(error.response.data.error);
        }
    }
          
    const showsidePosts = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get(`${config.URL}/api/sidebar/show-post`);
            setsidePosts(data.posts);
            setLoading(false);
        } catch (error) {
            console.log(error.response.data.error);
        }
    }

    useEffect(() => {
        showPosts();
        showsidePosts();
        FetchLatest();
        
    }, []);

    useEffect(() => {
        socket.on('add-like', (newPosts) => {
            setPostAddLike(newPosts);
            setPostRemoveLike('');
        });
        socket.on('remove-like', (newPosts) => {
            setPostRemoveLike(newPosts);
            setPostAddLike('');
        });
    }, [])
    const stripHtmlTags = (html) => {
        const doc = new DOMParser().parseFromString(html, 'text/html');
        return doc.body.textContent || "";
      };

    let uiPosts = postAddLike.length > 0 ? postAddLike : postRemoveLike.length > 0 ? postRemoveLike : posts;
    const truncateTitle = (title, maxLength) => {
        if (title.length <= maxLength) {
          return title;
        } else {
          return title.slice(0, maxLength) + "...";
        }
      };
    //   console.log(sideposts);



    return (
        <>
    <Navbar/>
    <div className="my-10"></div>
    <div className='whole-div sm:flex w-[1300px]  mx-auto  '>

        {/* /////////////////////// LEFT SIDE POSTS //////////////////// */}
        <div className='left-div w-36 h-[1200px] text-center mr-5' >
            <div  className='bg-yellow-400   font-bold p-2 '>Latest Post</div>
            <div style={{ flexGrow: 1 }} className='' >
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-1 gap-4">
                    {loading ? (
                        <Loader />
                    ) : (
                        Latest.map((post, index) => (
                            <div key={index}>
                                <LeftPostCard
                                    id={post._id}
                                    title={truncateTitle(post.title, 50)}
                                    content={stripHtmlTags(post.content)}
                                    image={post.image ? post.image.url : ''}
                                    subheader={moment(post.createdAt).format('MMMM DD, YYYY')}
                                    comments={post.comments.length}
                                    likes={post.likes.length}
                                    likesId={post.likes}
                                    showPosts={showPosts}
                                />
                            </div>
                        ))
                    )}
                </div>
            </div>
        
        </div>

        {/* /////////////////   CENTER POSTS //////////// */}

        <div className='center-div  w-[775px] h-full  '>
            <div className='text-center font-bold font-serif p-2 bg-gray-700 mb-2 text-white '> All Latest Post</div>
        <div style={{ flexGrow: 1 }} className="flex">
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 gap-4">
                    {loading ? (
                        <Loader />
                    ) : (
                        uiPosts.map((post, index) => (
                            <div key={index}>
                                <PostCard
                                    id={post._id}
                                    title={truncateTitle(post.title, 50)}
                                    content={stripHtmlTags(post.content)}
                                    image={post.image ? post.image.url : ''}
                                    subheader={moment(post.createdAt).format('MMMM DD, YYYY')}
                                    comments={post.comments.length}
                                    likes={post.likes.length}
                                    likesId={post.likes}
                                    showPosts={showPosts}
                                />
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>

        {/* ///////////// SIDE BAR POSTS ///////////////////////// */}

        <div className='right-div  w-96 text-center'>
            <div className='bg-red-700 text-white p-2 ml-5'>Offer and Sale</div>
        <div style={{ flexGrow: 1 }} className="flex">
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-1 gap-4 ml-5 mt-5">
                    {loading ? (
                        <Loader />
                    ) : (
                        sideposts.map((sidepost, index) => (
                            <div key={index}>
                                <SidepostCard
                                    id={sidepost._id}
                                    title={truncateTitle(sidepost.title, 65)}
                                    image={sidepost.image ? sidepost.image.url : ''}
                                    subheader={moment(sidepost.createdAt).format('MMMM DD, YYYY')}
                                    Price={sidepost.Price}
                                    offer={sidepost.offer}
                                    link={sidepost.link}
                                />
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    </div>
    {/* <div className="flex border m-10 justify-center">
        <div style={{maxWidth:'1280px',border:'2px solid black'}}>
            
        </div>
    <div className="my-10"></div>
</div> */}

            <Footer />
        </>
    )
}

export default Home