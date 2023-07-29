
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import app from './firebase.init';
import { getAuth, createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, sendEmailVerification, 
  sendPasswordResetEmail, 
  updateProfile} from "firebase/auth";
import { Button, Form } from 'react-bootstrap';
import { useState } from 'react';

function App() {
  const [validated, setValidated] = useState(false);
  const [error, setError] = useState('')
  const [registered, setRegistered] = useState(false)
  const [name,setName]=useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState({})
  const auth = getAuth(app)


  const handlaeName = (event) => {
    setName(event.target.value)
  }

  const handlaeEmail = (event) => {
    setEmail(event.target.value)
  }

  const handlaePassword = event => {
    setPassword(event.target.value)
    //console.log(event.target.value)
  }

  const handleChecked = event => {
    setRegistered(event.target.checked)
  }

  const handleSubmit = event => {
    event.preventDefault()

    if (registered) {
      signInWithEmailAndPassword(auth, email, password)
        .then(result => {
          const user = result.user
          setUser(user)
          console.log(user)
          setEmail("")
          setPassword("")
          setError("")
        })
        .catch(error => {
          console.error(error)
          setError(error.message)
        })
    }
    else {
      const form = event.currentTarget;
      if (form.checkValidity() === false) {
        event.stopPropagation();
        return
      }
      if (!/(?=.*[!@#$%^&*])(?=.*[0-9])/.test(password)) {
        setError(' Password should contain one special character & at least one Number')
        return
      }
      setError(" ")

      setValidated(true);
      console.log(email, password)
      createUserWithEmailAndPassword(auth, email, password)
        .then(result => {
          const user = result.user
          setUser(user)
          console.log(user)
          setEmail("")
          setPassword("")
          emailVerification()
          updateName()
        })
        .catch(error => {
          console.error(error)
          setError(error.message)
        })
    }
  }

  
  const emailVerification = () => {
    sendEmailVerification(auth.currentUser)
      .then(() => {
        console.log('Email verification sent!')

      });

  }

  const updateName =()=>{
    updateProfile(auth.currentUser,{
      displayName:name
    })
    .then(()=>{
      console.log('Name updated')
    })
  }

  const resetPassword = () => {
    sendPasswordResetEmail(auth, email)
      .then(() => {
        console.log('Password reset email sent!')
      })
      .catch((error) => {

        setError(error.message);

      });
  }


  return (
    <div >
      <div className='w-50 mx-auto'>
        <h2 className='text-center mt-2'>{registered ? ' Please Login' : 'Please Register Here !!'}</h2>
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          {!registered && <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Name</Form.Label>
            <Form.Control onBlur={handlaeName} type="text" placeholder="Enter your Name" required />
            <Form.Control.Feedback type="invalid">
              Please provide your Name
            </Form.Control.Feedback>
          </Form.Group>}
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control onBlur={handlaeEmail} type="email" placeholder="Enter email" required />
            <Form.Text className="text-muted">
              We'll never share your email with anyone else.
            </Form.Text>
            <Form.Control.Feedback type="invalid">
              Please choose a email
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control onBlur={handlaePassword} type="password" placeholder="Password" required />
            <Form.Control.Feedback type="invalid">
              Please choose a password
            </Form.Control.Feedback>
          </Form.Group>
          <small onClick={resetPassword} className='text-info '>Reset Password</small>
          {error && <p className='text-danger'>{error}</p>}
          <Form.Group className="mb-2" controlId="formBasicCheckbox">
            <Form.Group className="mb-1" controlId="formBasicCheckbox">
              <Form.Check onChange={handleChecked} type="checkbox" label="Have you already register ?" />
            </Form.Group>
          </Form.Group>
          <Button variant="primary" type="submit">
            {registered ? 'Login' : 'Register'}
          </Button>
        </Form>

      </div>
      <div>
        <h3 className='text-primary text-center underline'> New user Info</h3>
        <p className='text-info text-center text-bold underline'> User email:{user.email}</p>
      </div>

    </div>
  );
}

export default App;
