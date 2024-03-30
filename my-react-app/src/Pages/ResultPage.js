import React from "react";
import { Link } from "react-router-dom"; 
import "./ResultPage.css";

function ResultPage({ result }) {
  // Extracting label from the result object
  const label = result && result[0] && result[0]._label;

  return (
    <div className="container">
      <div className="inner-container">
        <h1>Welcome!</h1>
        <div>
          {label ? (
            <div>
              {/* <h3>User:</h3> */}
              <h3>{label}</h3>
            </div>
          ) : (
            <h3>Face Not Recognised</h3>
          )}

<br></br>
          <Link to="/admin" className="add-user-link" state={linkStyle}>
             Add User
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ResultPage;
const linkStyle = {
textAlign: 'center' ,
 marginLeft: '30px'
}

// import React from "react";

// function ResultPage({ result }) {
//   // Extracting label from the result object
//   const label = result && result[0] && result[0]._label;

//   return (
//     <div className="container">
//       <h1>Welcome!</h1>

//       {label ? (
//         <div>
//           <h3>User:</h3>
//           <p>{label}</p>
//         </div>
//       ) : (
//         <p>Face Not Recognised</p>
//       )}
//     </div>
//   );
// }

// export default ResultPage;

// import React from "react";

// function ResultPage({ result }) {
//   return (
//     <div className="container">
//       <h1>Welcome!</h1>
//       <h2>Result</h2>
//       {result ? (
//         <pre>{JSON.stringify(result, null, 2)}</pre>

//       ) : (
//         <p>Face Not Recognised</p>
//       )}
//     </div>
//   );
// }

// export default ResultPage;

// ResultPage.js
// import React from "react";

// function ResultPage({ label, distance }) {
//   return (
//     <div className="container">
//       <h1>Welcome!</h1>
//       <h2>Result</h2>
//       <div className="label-container">
//         <h3>Label:</h3>
//         <p>{label}</p>
//       </div>
//       <div className="distance-container">
//         <h3>Distance:</h3>
//         <p>{distance}</p>
//       </div>
//     </div>
//   );
// }

// export default ResultPage;
