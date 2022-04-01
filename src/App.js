import "./App.css";
import axios from "axios";
import useLocalStorage from "use-local-storage";

function App() {
  const [jwt_token, setJWT] = useLocalStorage("jwt", "");

  const registerUser = (e) => {
    e.preventDefault();
    const userOb = {
      id: e.target.id.value,
      username: e.target.username.value,
      password: e.target.password.value,
    };
    axios
      .post("/users", userOb)
      .then((res) => {
        if (res.data.error === null) {
          alert(`User added successfully`);
        } else {
          console.log(res.data.error);
          alert(res.data.error.code);
        }
      })
      .catch((err) => {
        console.log(err);
        alert("Error while adding user");
      });
  };

  const loginUser = (e) => {
    e.preventDefault();
    const userOb = {
      username: e.target.username.value,
      password: e.target.password.value,
    };
    console.log(userOb);
    axios
      .post("/users/login", userOb)
      .then((res) => {
        if (!res.data.token) {
          alert("Error while logging in jwt");
        } else {
          console.log(res.data);
          setJWT(res.data.token);
          alert(`User logged in successfully with jwt_token: ${jwt_token}`);
        }
      })
      .catch((err) => {
        console.log(err);
        alert("Error while loggingn error;");
      });
  };
  return (
    <div className='App'>
      <div className='register-div'>
        <form
          className='form-container bg-light clearfix'
          onSubmit={registerUser}>
          <h1 className='text-center mb-4'> Register</h1>
          <div className='form-group'>
            <input
              required
              className='form-control'
              type='number'
              name='id'
              placeholder='ID'
            />
            <input
              required
              type='text'
              name='username'
              className='form-control'
              placeholder='Username'
            />
            <input
              required
              type='password'
              name='password'
              className='form-control'
              placeholder='Password'
            />
          </div>
          <input
            type='submit'
            className='btn btn-success m-1'
            value='Register'
          />
        </form>
      </div>
      <div className='login-div'>
        <form onSubmit={loginUser} className='form-container bg-light clearfix'>
          <h1 className='text-center mb-4'>Login</h1>
          <div className='form-group'>
            <input
              required
              type='text'
              className='form-control'
              name='username'
              placeholder='Username'
            />
            <input
              required
              type='password'
              name='password'
              className='form-control'
              placeholder='Password'
            />
          </div>
          <input type='submit' className='btn btn-success m-1' value='Login' />
        </form>
      </div>
    </div>
  );
}

export default App;
