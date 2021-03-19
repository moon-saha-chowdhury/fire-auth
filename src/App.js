import './App.css';
import firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.config';
import { useState } from 'react';
!firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app()
// firebase.initializeApp(firebaseConfig);

function App() {
  const [newUser, setNewUser] = useState(false);

  const [user, setUser] = useState({
    isSignedIn: false,
    name: '',
    email: '',
    password: '',
    photo: ''
  })
  const googleProvider = new firebase.auth.GoogleAuthProvider();
  const fbProvider = new firebase.auth.FacebookAuthProvider();
  const handleSignIn = () => {
    firebase.auth().signInWithPopup(googleProvider)
      .then(res => {
        const { displayName, photoURL, email } = res.user;
        const signedInUser = {
          isSignedIn: true,
          name: displayName,
          email: email,
          photo: photoURL
        }
        setUser(signedInUser);
      })
      .catch(err => {
        console.log(err);
        console.log(err.message);

      })
  }

  const handleSignOut = () => {
    firebase.auth().signOut()
      .then(res => {
        const signedOutUser = {
          isSignedIn: false,
          name: '',
          email: '',
          photo: '',
          error: '',
          success: false
        }
        setUser(signedOutUser);

      })
      .catch(err => {

      })

  }

  const handleFbSignIn =()=>{
    firebase.auth().signInWithPopup(fbProvider)
  .then((result) => {
    /** @type {firebase.auth.OAuthCredential} */
    var credential = result.credential;

    // The signed-in user info.
    var user = result.user;

    // This gives you a Facebook Access Token. You can use it to access the Facebook API.
    var accessToken = credential.accessToken;

    console.log("Fb user sign in", user);

    // ...
  })
  .catch((error) => {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // The email of the user's account used.
    var email = error.email;
    // The firebase.auth.AuthCredential type that was used.
    var credential = error.credential;

    // ...
  });

  }


  const handleBlur = (event) => {
    console.log(event.target.name, event.target.value);
    let isFieldValid = true;
    if (event.target.name === 'email') {
      isFieldValid = /\S+@\S+\.\S+/.test(event.target.value);
      // console.log(isFormValid);
    }

    if (event.target.name === 'password') {
      const isPasswordValid = event.target.value.length > 6;
      const passwordHasValue = /\d{1}/.test(event.target.value);
      isFieldValid = isPasswordValid && passwordHasValue;
    }
    if (isFieldValid) {
      const newUserInfo = { ...user };
      newUserInfo[event.target.name] = event.target.value;
      // console.log(newUserInfo);
      setUser(newUserInfo);

    }
  }

  const handleSubmit = (event) => {
    if (newUser && user.email && user.password) {
      firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
        .then(response => {
          // Signed in
          const newSuccessText = { ...user }
          newSuccessText.error = '';
          newSuccessText.success = true;
          setUser(newSuccessText);
          updateUsers(user.name);
          // ...
        })
        .catch(error => {
          const newUserError = { ...user };
          newUserError.error = error.message;
          newUserError.success = false;
          setUser(newUserError);
          // ..
        });
    }
    if (!newUser && user.email && user.password) {
      firebase.auth().signInWithEmailAndPassword(user.email, user.password)
        .then(res => {
          // Signed in
          const newSuccessText = { ...user }
          newSuccessText.error = '';
          newSuccessText.success = true;
          setUser(newSuccessText);
          console.log('sign in userinfo', res.user);
          // ...
        })
        .catch((error) => {
          const newUserError = { ...user };
          newUserError.error = error.message;
          newUserError.success = false;
          setUser(newUserError);
        });
    }
    event.preventDefault();
    //submit button a click kore page reload hoy aita off korar jonno preventDefault method

  }

  const updateUsers = name => {
    const user = firebase.auth().currentUser;

    user.updateProfile({
      displayName:name
    }).then(function () {
      console.log('user name updated successfully');
      // Update successful.
    }).catch(function (error) {
      console.log(error);
      // An error happened.
    });

  }

  return (
    <div className="App">
      {
        user.isSignedIn ? <button onClick={handleSignOut}>Sign Out</button> :
          <button onClick={handleSignIn}>Sign In</button>


      }
      <br/>
      <button onClick={handleFbSignIn}>Sign in with facebook</button>
      {
        user.isSignedIn && <div>
          <h2>Welcome {user.name}</h2>
          <p>Your Email: {user.email}</p>
          <img src={user.photo} alt="user"></img>
        </div>
      }
      <h1>Our Own Authentication </h1>
      <input type="checkbox" onChange={() => setNewUser(!newUser)} name="newUser" id="" />
      <label htmlFor="newUser">New User Sign Up</label>
      <form onSubmit={handleSubmit}>
        {newUser && <input name="name" onBlur={handleBlur} type="text" placeholder="Your Name" />
        }
        <br />
        <input onBlur={handleBlur} type="text" name="email" placeholder="Your Email Address" required />
        <br />
        <input onBlur={handleBlur} type="password" name="password" placeholder="Your Password" required />
        <br />
        <input type="submit" value={newUser? "Sign Up" :"Sign In"} />
      </form>
      <p style={{ color: "red" }}>{user.error}</p>
      {
        user.success && <p style={{ color: "green" }}>User {newUser ? "Created" : "Log In"} Successfully</p>

      }

    </div>
  );
}

export default App;
