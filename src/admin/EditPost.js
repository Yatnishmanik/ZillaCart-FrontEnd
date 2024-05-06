import { Box, Button, TextField, Typography } from "@mui/material";
import { useFormik } from "formik";
import * as yup from "yup";
import Dropzone from "react-dropzone";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import axios from "axios";
import { toast } from "react-toastify";
import JoditEditor from "jodit-react";
import React, { useEffect, useState,useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import configg from '../config'
const token =  JSON.parse(localStorage.getItem('userInfo'))?.accesstoken;
// console.log("@@@@@@@",token);

const validationSchema = yup.object({
  title: yup.string().min(4).required("Post title is required"),
  content: yup.string().min(10).required("Text content is required"),
});

const EditPost = ({ placeholder }) => {
  const editor = useRef(null);
  const [cate,setCate]=useState()
  const { id } = useParams();
  const [categories, setCategories] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${configg.URL}/api/show/category`);
        console.log("***********")
        console.log(response.data);
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error("Failed to fetch categories");
      }
    };
    fetchCategories();
  }, []);

  const {
    values,
    errors,
    touched,
    handleBlur,
    handleChange,
    handleSubmit,
    setFieldValue,
  } = useFormik({
    initialValues: {
      title,
      content,
      image: "",
      category: cate, // Add category field to initialValues
    },
    validationSchema: validationSchema,
    enableReinitialize: true,
    onSubmit: (values, actions) => {
      updatePost(values);
      actions.resetForm();
    },
  });

  const stripHtmlTags = (html) => {
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent || "";
  };

  const singlePostById = async () => {
    try {
      const { data } = await axios.get(`${configg.URL}/api/post/${id}`);
      setTitle(data.post.title);
      setCate(data?.post?.category)
      setContent(stripHtmlTags(data.post.content));
      setImagePreview(data.post.image.url);
    } catch (error) {
      console.log(error);
      toast.error(error);
    }
  };
  const handleChanges = (event) => {
    const { value } = event.target;
    setFieldValue("category", value);
  };

  useEffect(() => {
    singlePostById();
  }, []);

  const updatePost = async (values) => {
    try {
      console.log(values);
      const { data } = await axios.put(`${configg.URL}/api/update/post/${id}`, values,{headers: {
        'authorization': `Bearer ${token}`
    }});
      if (data.success === true) {
        toast.success("Post updated");
        navigate("/admin/dashboard");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.error);
    }
  };

  return (
    <>
      <Box sx={{ bgcolor: "white", padding: "20px 200px" }}>
        <Typography variant="h5" sx={{ pb: 4 }}>
          Edit post
        </Typography>
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            sx={{ mb: 3 }}
            fullWidth
            id="title"
            label="Post title"
            name="title"
            InputLabelProps={{
              shrink: true,
            }}
            placeholder="Post title"
            value={values.title}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.title && Boolean(errors.title)}
            helperText={touched.title && errors.title}
          />
          <div style={{ marginBottom: "1.5rem" }}>
            <label htmlFor="category" style={{ display: "block", marginBottom: "0.5rem", color:"grey"}}>Category</label>
            <select
              id="category"
              name="category"
              value={values.category}
              onChange={handleChanges}
              onBlur={handleBlur}
              style={{ width: "100%", padding: "0.5rem", borderRadius: "4px",color:"black"  ,border: `1px solid ${touched.category && errors.category ? "#d32f2f" : "#ced4da"}` }}
            >
              <option value="" disabled>Select category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                  
                </option>
              ))}
            </select>
            {touched.category && errors.category && <div style={{ color: "#d32f2f", fontSize: "12px", paddingLeft: "2px" }}>{errors.category}</div>}
          </div>
          <Box sx={{ mb: 3 }}>
            <JoditEditor
              ref={editor}
              value={values.content}
              onChange={(e) => setFieldValue("content", e)}
            />
            <Box
              component="span"
              sx={{ color: "#d32f2f", fontSize: "12px", pl: 2 }}
            >
              {touched.content && errors.content}
            </Box>
          </Box>

          <Box border="2px dashed blue" sx={{ p: 1 }}>
            <Dropzone
              acceptedFiles=".jpg,.jpeg,.png"
              multiple={false}
              onDrop={(acceptedFiles) =>
                acceptedFiles.map((file) => {
                  const reader = new FileReader();
                  reader.readAsDataURL(file);
                  reader.onloadend = () => {
                    setFieldValue("image", reader.result);
                  };
                })
              }
            >
              {({ getRootProps, getInputProps, isDragActive }) => (
                <Box
                  {...getRootProps()}
                  p="1rem"
                  sx={{
                    "&:hover": { cursor: "pointer" },
                    bgcolor: isDragActive ? "#cceffc" : "#fafafa",
                  }}
                >
                  <input name="image" {...getInputProps()} />
                  {isDragActive ? (
                    <>
                      <p style={{ textAlign: "center" }}>
                        <CloudUploadIcon
                          sx={{ color: "primary.main", mr: 2 }}
                        />
                      </p>
                      <p style={{ textAlign: "center", fontSize: "12px" }}>
                        Drop here!
                      </p>
                    </>
                  ) : values.image === null ? (
                    <>
                      <p style={{ textAlign: "center" }}>
                        <CloudUploadIcon
                          sx={{ color: "primary.main", mr: 2 }}
                        />
                      </p>
                      <p style={{ textAlign: "center", fontSize: "12px" }}>
                        Drag and Drop image here or click to choose
                      </p>
                    </>
                  ) : (
                    <>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-around",
                          alignItems: "center",
                        }}
                      >
                        <Box>
                          <img
                            style={{ maxWidth: "100px" }}
                            src={
                              values.image === "" ? imagePreview : values.image
                            }
                            alt=""
                          />
                        </Box>
                      </Box>
                    </>
                  )}
                </Box>
              )}
            </Dropzone>
          </Box>
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            elevation={0}
            sx={{ mt: 3, p: 1, mb: 2, borderRadius: "25px" }}
          >
            Update post
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default EditPost;
