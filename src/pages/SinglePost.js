import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import TelegramIcon from '@mui/icons-material/Telegram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import EmailIcon from '@mui/icons-material/Email';

import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Box, Button, Divider } from '@mui/material';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import moment from 'moment';
import Loader from '../components/Loader';
import { useSelector } from 'react-redux';
import TextareaAutosize from '@mui/base/TextareaAutosize';
import { toast } from 'react-toastify';
import CommentList from '../components/CommentList';
import { io } from 'socket.io-client';
import config from '../config'
const token =  JSON.parse(localStorage.getItem('userInfo'))?.accesstoken;
// console.log("@@@@@@@",token);

const socket = io('/', {
    reconnection: true
})


const SinglePost = () => {


    const { userInfo } = useSelector(state => state.signIn);

    const [title, setTitle] = useState('');
    const [author,setauthor]=useState('');
    const [content, setContent] = useState('');
    const [image, setImage] = useState('');
    const [createdAt, setCreatedAt] = useState('');
    const [loading, setLoading] = useState(false);
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState([]);
    const [commentsRealTime, setCommentsRealTime] = useState([]);



    const stripHtmlTags = (html) => {
        const doc = new DOMParser().parseFromString(html, 'text/html');
        return doc.body.textContent || "";
      };
    const { id } = useParams();
    //fetch single post
    const displaySinglePost = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get(`${config.URL}/api/post/${id}`);
            console.log(data)
            setTitle(data.post.title);
            setContent(stripHtmlTags(data.post.content));
            setImage(data.post.image.url);
            setCreatedAt(data.post.createdAt);
            setauthor(data.post.postedBy.name);
            setLoading(false);
            setComments(data.post.comments);

        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        displaySinglePost();
    }, [])

    useEffect(() => {
        // console.log('SOCKET IO', socket);
        socket.on('new-comment', (newComment) => {
            setCommentsRealTime(newComment);
        })
    }, [])


    // add comment
    const addComment = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.put(`${config.URL}/api/comment/post/${id}`, { comment },{headers: {
              'authorization': `Bearer ${token}`
          }});
            if (data.success === true) {
                setComment('');
                toast.success("comment added");
                //displaySinglePost();
                socket.emit('comment', data.post.comments);
            }
            //console.log("comment post", data.post)
        } catch (error) {
            console.log(error);
            toast.error(error);
        }
    }

    let uiCommentUpdate = commentsRealTime.length > 0 ? commentsRealTime : comments;

    return (
        <>
        <Navbar />

  <div
    className="bg-gray-100 flex justify-center pt-4 pb-4  min-h-screen"
    style={{ backgroundColor: "#fafafa" }}
  >
    {loading ? (
      <Loader />
    ) : (
      <>
        <div
          className="pagewidth   h-full bg-white shadow-lg"
        >
          <div className="items-center px-2 py-5">
            <div className="flex-grow ">
              <h1 className="text-5xl font-serif">{title}</h1>
            </div>
            <p className="text-gray-500">
                {moment(createdAt).format("MMMM DD, YYYY")}
              </p>
              
          </div>
          <div className="p-1">
          <div className='flex pb-1'>
                <a className='border-1 bg-blue-500 text-white font-serif p-1 mx-1'><FacebookIcon/>facebook</a>
                <a className='border-1 bg-green-400 text-white  p-1'><WhatsAppIcon/>whatsApp</a>
                <a className='border-1 bg-yellow-300 text-black  p-1 mx-1'>Twitter</a>
                <a className='border-1 bg-blue-800 text-white  p-1 mx-1'><TelegramIcon/>Telegram</a>
                <a className='border-1 bg-black text-white  p-1 mx-1'><TwitterIcon/>Twitter</a>
                <a className='border-1 bg-blue-800 text-white  p-1 mx-1'><LinkedInIcon/>LinkedIn</a>
                <a className='border-1 bg-red-500 text-white  p-1 mx-1'><EmailIcon/>Gmail</a>

            </div>
            <p
              className=" text-gray-700"
              dangerouslySetInnerHTML={{ __html: content }}
            >
            </p>
            <div
              className="  flex justify-start items-start rounded-full"
            >
            <p className='text-sm text-gray-500 pt-5 '>Posted By -{author}</p>
            </div>
            <div className="p-5">
              <hr className="my-5 border-gray-300" />
              {/* Add comment list */}
              {comments.length === 0 ? null : (
                <h2 className="text-xl font-bold mb-2">Comments:</h2>
              )}
              {uiCommentUpdate.map((comment) => (
                <div key={comment._id} className="mb-3">
                  <p className="font-bold">{comment.postedBy.name}</p>
                  <p>{comment.text}</p>
                </div>
              ))}
              {userInfo ? (
                <div className="p-3 bg-gray-100">
                  <h2 className="text-lg font-bold">Add your comment here!</h2>
                  <form onSubmit={addComment}>
                    <textarea
                      onChange={(e) => setComment(e.target.value)}
                      value={comment}
                      className="w-full min-h-[100px] border p-2"
                      placeholder="Add a comment..."
                    ></textarea>
                    <button
                      type="submit"
                      className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      Comment
                    </button>
                  </form>
                </div>
              ) : (
                <div className="p-3 bg-gray-100">
                  <p>
                    <Link to="/login" className="text-blue-500">
                      Log In to add a comment
                    </Link>
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </>
    )}
  </div>

<Footer />

        </>
    );
}

export default SinglePost;