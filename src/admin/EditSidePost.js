import { Box, Button, TextField, Typography } from "@mui/material";
import { useFormik } from "formik";
import * as yup from "yup";
import Dropzone from "react-dropzone";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import axios from "axios";
import { toast } from "react-toastify";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import config from '../config'

const validationSchema = yup.object({
  title: yup.string().min(4).required("Post title is required"),
  Price: yup.number().min(3).required("Text content is required"),
  offer: yup.string().min(5).required("Text content is required"),
});

const EditSidePost = ({ placeholder }) => {

  const { id } = useParams();

  const [title, setTitle] = useState("");
  const [Price, setPrice] = useState("");
  const [offer, setoffer] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const navigate = useNavigate();


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
      Price,
      offer,
      image: "",
    },
    validationSchema: validationSchema,
    enableReinitialize: true,
    onSubmit: (values, actions) => {
      updatePost(values);
      actions.resetForm();
    },
  });

  const singlePostById = async () => {
    try {
      const { data } = await axios.get(`${config.URL}/api/sidebar/posts/${id}`);
      setTitle(data.post.title);
      setPrice(data.post.Price);
      setoffer(data.post.offer);
      setImagePreview(data.post.image.url);
    } catch (error) {
      console.log(error);
      toast.error(error);
    }
  };

  useEffect(() => {
    singlePostById();
  }, []);

  const updatePost = async (values) => {
    try {
        console.log("&&&&&&&&&&&&&&&")
        console.log(values);
      const { data } = await axios.put(`${config.URL}/api/sidebar/update-post/${id}`, values);
      if (data.success === true) {
        toast.success("Post updated");
        navigate("/admin/sidedashboard");
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
          <TextField
            sx={{ mb: 3 }}
            fullWidth
            id="Price"
            label="Price"
            name="Price"
            InputLabelProps={{
              shrink: true,
            }}
            value={values.Price}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.Price && Boolean(errors.Price)}
            helperText={touched.Price && errors.Price}
          />
          <TextField
            sx={{ mb: 3 }}
            fullWidth
            id="offer"
            label="offer"
            name="offer"
            InputLabelProps={{
              shrink: true,
            }}
            value={values.offer}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.offer && Boolean(errors.offer)}
            helperText={touched.offer && errors.offer}
          />
          

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

export default EditSidePost;
