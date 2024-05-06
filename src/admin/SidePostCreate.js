import { Box, Button, TextField, Typography } from "@mui/material";
import { useFormik } from "formik";
import Dropzone from "react-dropzone";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import axios from "axios";
import { toast } from "react-toastify";
import React, { useRef, useMemo } from "react";
import config from '../config'
import Joi from 'joi-browser';
const token =  JSON.parse(localStorage.getItem('userInfo'))?.accesstoken;
// console.log("@@@@@@@",token);


const validationSchema = Joi.object({
  title: Joi.string()
    .min(4)
    .required()
    .label("Post title"),
  Price: Joi.number()
    .required()
    .label("Price"),
  offer: Joi.string()
    .min(3)
    .required()
    .label("offer"),
  link: Joi.string()
    .min(3)
    .required()
    .label("offer"),
});
const SidePostCreate = ({ placeholder }) => {
  const editor = useRef(placeholder);
  const config = useMemo(
    () => ({ readonly: false, placeholder: placeholder || "Start typings..." }),
    [placeholder]
  );
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
      Price: "",
      offer:"",
      link:"",
      image: null,
    },
    

    validationSchema: validationSchema,
    onSubmit: (values, actions) => {
      createNewPost(values);
      console.log(values);
      // alert(JSON.stringify(values, null, 2));
      actions.resetForm();
    },
  });


  const createNewPost = async (values) => {
    try {
      console.log(values)
      const { data } = await axios.post(`${config.URL}/api/sidebar/post-create`, values,{headers: {
        'authorization': `Bearer ${token}`
    }});
      toast.success("post created");
    } catch (error) {
      console.log(error);
      toast.error(error);
    }
  };

  return (
    <>
      <Box sx={{ bgcolor: "white", padding: "20px 200px" }}>
        <Typography variant="h5" sx={{ pb: 4 }}>
          {" "}
          Create post{" "}
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
            placeholder="Price"
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
            placeholder="Post offer"
            value={values.offer}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.offer && Boolean(errors.offer)}
            helperText={touched.offer && errors.offer}
          />
          <TextField
            sx={{ mb: 3 }}
            fullWidth
            id="link"
            label="link"
            name="link"
            InputLabelProps={{
              shrink: true,
            }}
            placeholder="link"
            value={values.link}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.link && Boolean(errors.link)}
            helperText={touched.link && errors.link}
          />  

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
            // disabled={loading}
          >
            Create post
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default SidePostCreate;