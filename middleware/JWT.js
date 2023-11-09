import { getAuth } from "firebase-admin/auth";
import { adminApp } from "../firebaseConfig.js";



// Sử dụng middleware để xử lý CORS và phần thân yêu cầu HTTP
 const authorizationJWT = async (req, res, next) => {
    const authorizationHeader = req.headers.authorization;
    console.log(authorizationHeader);
    
    if (authorizationHeader) {
      const accessToken = authorizationHeader.split(" ")[1];
      // console.log("alo alo" + accessToken);
      getAuth(adminApp)
        .verifyIdToken( accessToken)
        .then((decodedToken) => {
          res.locals.uid = decodedToken.uid;
          next();
        })
        .catch((err) => {
          return res.status(403).json({ message: "Forbidden", error: err });
        });
    } else {
       return res.status(401).json({ message: "Unauthorized" });
    }
  };
export default authorizationJWT;