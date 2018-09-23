import { object, string } from 'yup'; // for everything

export default object().shape({
  usernameOrEmail: string().required('Username or email is required.'),
  password: string().required('Password is required.')
});
