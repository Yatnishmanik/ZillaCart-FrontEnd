import React, { useRef, useMemo, useState, useEffect } from "react";
import { Box, Button, TextField, Typography, MenuItem } from "@mui/material";
import Dropzone from "react-dropzone";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useFormik } from "formik";

import axios from "axios";
import { toast } from "react-toastify";
import JoditEditor from "jodit-react";
import Joi from "joi-browser";
import config from '../config'

const CreatePost = ({ placeholder }) => {
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${config.URL}/api/show/category`);
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const editor = useRef(placeholder);
  const config = useMemo(
    () => ({
      readonly: false,
      placeholder: placeholder || "Start typing...",
    }),
    [placeholder]
  );
  

  const validationSchema = Joi.object({
    title: Joi.string().min(4).required().label("Post title"),
    content: Joi.string().min(10).required().label("Text content"),
  });

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
      title: "",
      content: "",
      image: null,
      category: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values, actions) => {
      createNewPost(values);
      actions.resetForm();
    },
  });
  const handleChanges = (event) => {
    const { value } = event.target;
    setFieldValue("category", value);
  };

  const createNewPost = async (values) => {
    try {
      const { data } = await axios.post(`${config.URL}/api/post/create`, values);
      toast.success("Post created");
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error("Failed to create post");
    }
  };

  return (
    <>
      <Box sx={{ bgcolor: "white", padding: "20px 200px" }}>
        <Typography variant="h5" sx={{ pb: 4 }}>
          Create post
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
          <Box sx={{ my: 3 }}>
            <JoditEditor
              ref={editor}
              value={values.content}
              config={config}
              onChange={(e) => {
                setFieldValue("content", e);
              }}
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
              //maxFiles={3}
              onDrop={(acceptedFiles) =>
                acceptedFiles.map((file, index) => {
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
                  <input name="banner" {...getInputProps()} />
                  {isDragActive ? (
                    <>
                      <p style={{ textAlign: "center" }}>
                        <CloudUploadIcon
                          sx={{ color: "primary.main", mr: 2 }}
                        />
                      </p>
                      <p style={{ textAlign: "center", fontSize: "12px" }}>
                        {" "}
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
                        Drag and Drop here or click to choose
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
                            src={values.image}
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
            Create post
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default CreatePost;
