const express = require("express");
const serverless=require("serverless-http");
const faceapi = require("face-api.js");
const mongoose = require("mongoose");
const { Canvas, Image } = require("canvas");
const canvas = require("canvas");
const fileUpload = require("express-fileupload");
faceapi.env.monkeyPatch({ Canvas, Image });
const cors = require("cors");
const app = express();
const path=require("path")
app.use(cors());
app.use(
  fileUpload({
    useTempFiles: true,
  })
);

// app.get("/", (req, res) => {
//   app.use(express.static(path.resolve(__dirname, "my-react-app", "build")));
//   res.sendFile(path.resolve(__dirname, "my-react-app", "build", "index.html"));
// }); 
app.get("/", (req, res) => {
  // Resolve the absolute path to the build folder of your React app
  const reactAppBuildPath = path.resolve(
    __dirname,
    "..",
    "my-react-app",
    "build"
  );
  // Serve static files from the build folder
  app.use(express.static(reactAppBuildPath));
  // Send the index.html file
  res.sendFile(path.join(reactAppBuildPath, "index.html"));
});
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});
async function LoadModels() {
  // Load the models
  // __dirname gives the root directory of the server
  await faceapi.nets.faceRecognitionNet.loadFromDisk(__dirname + "/models");
  await faceapi.nets.faceLandmark68Net.loadFromDisk(__dirname + "/models");
  await faceapi.nets.ssdMobilenetv1.loadFromDisk(__dirname + "/models");
}
LoadModels();

const faceSchema = new mongoose.Schema({
  label: {
    type: String,
    required: true,
    unique: true,
  },
  descriptions: {
    type: Array,
    required: true,
  },
});

const FaceModel = mongoose.model("Face", faceSchema);

async function uploadLabeledImages(images, label) {
  try {
    let counter = 0;
    const descriptions = [];
    // Loop through the images
    for (let i = 0; i < images.length; i++) {
      const img = await canvas.loadImage(images[i]);
      counter = (i / images.length) * 100;
      console.log(`Progress = ${counter}%`);
      // Read each face and save the face descriptions in the descriptions array
      const detections = await faceapi
        .detectSingleFace(img)
        .withFaceLandmarks()
        .withFaceDescriptor();
      descriptions.push(detections.descriptor);
    }

    // Create a new face document with the given label and save it in DB
    const createFace = new FaceModel({
      label: label,
      descriptions: descriptions,
    });
    await createFace.save();
    return true;
  } catch (error) {
    console.log(error);
    return error;
  }
}

async function getDescriptorsFromDB(image) {
  // Get all the face data from mongodb and loop through each of them to read the data
  let faces = await FaceModel.find();
  for (i = 0; i < faces.length; i++) {
    // Change the face data descriptors from Objects to Float32Array type
    for (j = 0; j < faces[i].descriptions.length; j++) {
      faces[i].descriptions[j] = new Float32Array(
        Object.values(faces[i].descriptions[j])
      );
    }
    // Turn the DB face docs to
    faces[i] = new faceapi.LabeledFaceDescriptors(
      faces[i].label,
      faces[i].descriptions
    );
  }

  // Load face matcher to find the matching face
  const faceMatcher = new faceapi.FaceMatcher(faces, 0.6);

  // Read the image using canvas or other method
  const img = await canvas.loadImage(image);
  let temp = faceapi.createCanvasFromMedia(img);
  // Process the image for the model
  const displaySize = { width: img.width, height: img.height };
  faceapi.matchDimensions(temp, displaySize);

  // Find matching faces
  const detections = await faceapi
    .detectAllFaces(img)
    .withFaceLandmarks()
    .withFaceDescriptors();
  const resizedDetections = faceapi.resizeResults(detections, displaySize);
  const results = resizedDetections.map((d) =>
    faceMatcher.findBestMatch(d.descriptor)
  );
  return results;
}


app.post("/post-face", async (req, res) => {
  try {
    // Check if req.files is defined and contains the expected fields
    if (
      !req.files ||
      !req.files.File1 ||
      !req.files.File2 ||
      !req.files.File3
    ) {
      throw new Error("One or more files are missing in the request.");
    }

    const File1 = req.files.File1.tempFilePath;
    const File2 = req.files.File2.tempFilePath;
    const File3 = req.files.File3.tempFilePath;
    const label = req.body.label;
    let result = await uploadLabeledImages([File1, File2, File3], label);
    if (result) {
      res.json({ message: "Face data stored successfully" });
    } else {
      res.json({ message: "Something went wrong, please try again." });
    }
  } catch (error) {
    console.error("Error processing file upload:", error);
    res.status(400).json({ error: error.message });
  }
});



app.post("/check-face", async (req, res) => {
  try {
    // Check if req.files is defined and contains the expected field
    if (!req.files || !req.files.File1) {
      throw new Error("No file uploaded or invalid field name.");
    }

    const File1 = req.files.File1.tempFilePath;
    let result = await getDescriptorsFromDB(File1);
    console.log(result)
    res.json({ result });
  } catch (error) {
    console.error("Error processing file upload:", error);
    res.status(400).json({ error: error.message });
  }
});


mongoose
  .connect(
    "mongodb+srv://adityakumar0718:harsh1234@cluster0.6yw0zk7.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0/Facerecog"
  )
  .then(() => {
    
 
    app.listen(process.env.PORT || 5001);
    console.log("DB connected and server us running.");
 })
  .catch((err) => {
    console.log(err);
  });

